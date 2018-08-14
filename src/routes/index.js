
var fs = require("fs");
var Web3 = require("../../node_modules/web3");
var Web3x = require("../../web3.0/node_modules/web3");
/**
 * / route
 *
 * @class User
 */
var keyMap={};
var IndexRoute = (function () {
    function IndexRoute() {
    }
    /**
     * Create the routes.
     *
     * @class Ind-exRoute
     * @method create
     * @static
     */
    IndexRoute.create = function (router) {
        router.get("/", function (req, res, next) {
            res.redirect('/docs');
        });
        router.get("/bcurl", function (req, res, next) {
            var blockchainurl = process.env.BLOCKCHAIN_SERVICE_URL;
            var privateIp = process.env.HEROKU_PRIVATE_IP;
            console.log(process.env.BLOCKCHAIN_SERVICE_URL);
            console.log(blockchainurl);
            res.send({ "blockchainurl": blockchainurl, "privateIp": privateIp });
        });
        router.get("/doc.json", function (req, res, next) {
            var docjson = fs.readFileSync('./assets/doc.json', "utf8");
            res.header('Access-Control-Allow-Origin', '*');
            res.download('./assets/doc.json');
        });
        router.post("/:smartcontractId/:key", function (req, res, next) {
            var blockchainurl = process.env.BLOCKCHAIN_SERVICE_URL;
            var web3 = new Web3x(new Web3x.providers.HttpProvider(blockchainurl));
            var requestData = JSON.stringify(req.body);
            var requestParams = req.params;
            var contractAddress = requestParams.smartcontractId;
            var transactionHash = "";
            var input = fs.readFileSync('./assets/HLSABI.json', "utf8");
            var abi = JSON.parse(input);   
            var map={};
            try {
                var myContract = web3.eth.contract(abi);
                var validContractId = web3.eth.getCode(contractAddress);
                
                if(validContractId.length <= 3){
                    res.status(400);
                    res.json("Invalid contract id");
		        }

                var myContractInstance = myContract.at(contractAddress);
                var transactionObject = {
                    from: web3.personal.listAccounts[0],
                    gas: 3000000,
                    gasPrice: 18000000000
                };
                myContractInstance.write(requestParams.key, requestData, transactionObject, function (error, result) {
                    if (!error) {

                        if(contractAddress in keyMap)
                        {
                            var m=keyMap[contractAddress];
                            m[requestParams.key]=requestData;
                        } 
                        else
                        {
                            map[requestParams.key]=requestData;
                            keyMap[contractAddress]=map;
                        } 

                        transactionHash = result;
                        res.status(201);
                        res.json(transactionHash);
                    }
                    else {
                        console.log("error while writting: ", error);
                        res.status(500);
                        res.json(transactionHash);
                    }
                });
            }
            catch (err) {
                console.log("error: ", err);
                res.status(500);
                res.json(err);
            }
        });
        router.get("/:smartcontractId/:key", function (req, res, next) {
            var blockchainurl = process.env.BLOCKCHAIN_SERVICE_URL;
            var web3 = new Web3x(new Web3x.providers.HttpProvider(blockchainurl));
            var requestData = JSON.stringify(req.body);
            var requestParams = req.params;
            var contractAddress = requestParams.smartcontractId;
            var transactionHas = "";
            var input = fs.readFileSync('./assets/HLSABI.json', "utf8");
            var abi = JSON.parse(input);
            try {
                var myContract = web3.eth.contract(abi);

                var validContractId = web3.eth.getCode(contractAddress);
                    if(validContractId.length <= 3){
                        throw ("Invalid contract id");
                    }

                var myContractInstance = myContract.at(contractAddress);
                var transactionObject = {
                    from: web3.personal.listAccounts[0],
                    gas: 3000000,
                    gasPrice: 1800
                };
                var result = myContractInstance.read(requestParams.key);
                var resultData = [];
                if (result.length != 0) {
                    for (var i = 1; i < result.length; i++) {
                        resultData.push(result[i]);
                    }
                    var resultObject = {
                        key: requestParams.key,
                        value: resultData
                    };
                    res.status(200);
                    res.json(resultObject);
                }
                else {
                    res.status(400);
                }
            }
            catch (err) {
                console.log("Error while read: ",err);
                res.status(500);
                res.json(err);
            }
        });
        router.put("/:smartcontractId/:key/:method", function (req, res, next) {
            var blockchainurl = process.env.BLOCKCHAIN_SERVICE_URL;
            var web3 = new Web3x(new Web3x.providers.HttpProvider(blockchainurl));
            var requestData = JSON.stringify(req.body);
            var requestParams = req.params;
            var contractAddress = requestParams.smartcontractId;
            var transactionHash = "";
            var updateData = [web3.fromAscii(requestParams.key), web3.fromAscii(requestData)];
            var input = fs.readFileSync('./assets/HLSABI.json', "utf8");
            var abi = JSON.parse(input);

            try {
                var myContract = web3.eth.contract(abi);

                var validContractId = web3.eth.getCode(contractAddress);
                    if(validContractId.length <= 3){
                        res.status(400);
                        res.json("Invalid contract id");
                    }

                var myContractInstance = myContract.at(contractAddress);
                var transactionObject = {
                    from: web3.personal.listAccounts[0],
                    gas: 3000000,
                    gasPrice: 1800
                };
                myContractInstance.executeFunction(requestParams.method, requestParams.key, requestData, transactionObject, function (error, result) {
                    if (!error) {

                        //Local key value
                        if(contractAddress in keyMap)
                        {
                            var m=keyMap[contractAddress];
                            m[requestParams.key]=requestData;
                        } 
                        
                        transactionHash = result;
                        console.log("result ", result);
                        res.status(200);
                        res.json(transactionHash);
                    }
                    else {
                        transactionHash = error;
                        console.log("error while update ", error);
                        res.status(500);
                        res.json(transactionHash);
                    }
                });
            }
            catch (err) {
                console.log("error while update ", err);
                res.status(500);
                res.json(err);
            }
        });

        //Dynamic ABI Method Call
        router.post("/contract/exec/:smartcontractId", async function (req, res, next) {
            var blockchainurl = process.env.BLOCKCHAIN_SERVICE_URL;
            var web3 = new Web3(new Web3.providers.HttpProvider(blockchainurl));
            var defaultAccount = '';
            var resultData;
            await web3.eth.getAccounts().then(function(accounts) {
                defaultAccount = accounts[0];
            })
            var requestData = req.body;
            var requestParams = req.params;
            var requestQuery= req.query;
            var contractAddress = requestParams.smartcontractId;
            var transactionHash = "";
            var abi =requestData;
            var fromAddress = defaultAccount;
            console.log("requestQuery.funcParams", requestQuery.funcParams);
            var params = requestQuery.funcParams != undefined ? requestQuery.funcParams.split(",") : '';
            try {
                var transactionObject = {
                    from: fromAddress,
                    gas: 3000000,
                    gasPrice: 0
                };
                var Contract = new web3.eth.Contract(abi, contractAddress, transactionObject);
                var method = requestQuery.funcName;
                // ...params will convert array to string example: params[0], params[1],...params[n]
                if( requestQuery.type == 'read') {
                   await Contract.methods[method](...params).call().then(function(result) {
                        res.status(200);
                        res.json(result);
                    }).catch(function(err) {
                        console.log("Contract Read Error ", err);
                        res.status(500);
                        res.json(err);
                    });
                } else if( requestQuery.type == 'store'){
                    await Contract.methods[method](...params).send(transactionObject)
                        .on('transactionHash', function(hash){
                        res.status(200);
                        res.json(hash);
                    }).catch(function(err) {
                        console.log("Contract Write Error ", err);
                        res.status(500);
                        res.json(err);
                    });
                } 
            } catch (error) {
                console.log("Console Error ", error);
                const err = new Error(error);
                const errorMsg = err.message;
                res.status(500);
                res.send(errorMsg);
            }
        }); 

        router.get("/list/keys/:smartcontractId/", function (req, res, next) {
            var requestParams = req.params;
            var contractAddress = requestParams.smartcontractId;
            try {
                   res.status(200);
                   res.json(keyMap[contractAddress]);
                }
            catch (err) 
            {
                console.log("Error while read: ",err);
                res.status(500);
                res.json(err);
            }
        });



    };
    return IndexRoute;
})();
exports.IndexRoute = IndexRoute;
