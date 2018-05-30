var solc = require("solc");
var fs = require("fs");
var request = require("request");
var Web3 = require("web3");
/**
 * / route
 *
 * @class User
 */
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
        router.get("/bcurl", function (req, res, next) {
            var blockchainurl = process.env.BLOCKCHAIN_SERVICE_URL;
            var privateIp = process.env.HEROKU_PRIVATE_IP;
            console.log(process.env.BLOCKCHAIN_SERVICE_URL);
            console.log(blockchainurl);
            console.log(process.env.HEROKU_PRIVATE_IP);
            console.log(process.env.HEROKU_DNS_APP_NAME);
            console.log(process.env.HEROKU_DNS_DYNO_NAME);
            console.log(process.env.HEROKU_DNS_FORMATION_NAME);
            res.send({ "blockchainurl": blockchainurl, "privateIp": privateIp });
        });
        router.get("/sol", function (req, res, next) {
            var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            var input = fs.readFileSync('./assets/sample1.sol', "utf8");
            res.send("Welcome");
        });
        router.post("/solstring", function (req, res, next) {
            // console.log(req);
            // res.send(req.body.request);
            //var output = solc.compile(req, 1)
            //res.send(output);
            try {
                var output = solc.compile(req.body.source, 1);
                res.send(output);
            }
            catch (e) {
            }
        });
        router.post("/create/account", function (req, res, next) {
            request.post({
                "headers": { "content-type": "application/json" },
                "url": "https://g5zr7zqn17.execute-api.us-east-1.amazonaws.com/dev/datastore",
                "body": JSON.stringify(req.body)
            }, function (error, response, body) {
                if (error) {
                    res.send(error);
                }
                res.send(body);
            });
        });
        router.get("/accounts", function (req, res, next) {
            request.get({
                "headers": { "content-type": "application/json" },
                "url": "https://g5zr7zqn17.execute-api.us-east-1.amazonaws.com/dev/datastore/" + req.query.host
            }, function (error, response, body) {
                if (error) {
                    res.send(error);
                }
                res.send(body);
            });
        });
        router.get("/loanappurl", function (req, res, next) {
            var loanappurl = process.env.BLOCKCHAIN_LOAN_APP_URL;
            res.send({ "url": loanappurl });
        });
        router.post("/write/:smartcontractId/:key", function (req, res, next) {
            var blockchainurl = process.env.BLOCKCHAIN_SERVICE_URL;
            var web3 = new Web3(new Web3.providers.HttpProvider(blockchainurl));
            var requestData = req.body;
            var requestParams = req.params;
            var contractAddress = requestParams.smartcontractId;
            var transactionHash = "";
            var input = fs.readFileSync('./assets/HLSABI.json', "utf8");
            var abi = JSON.parse(input);
            try {
                var myContract = web3.eth.contract(abi);
                var myContractInstance = myContract.at(contractAddress);
                var transactionObject = {
                    from: web3.personal.listAccounts[0],
                    gas: 3000000,
                    gasPrice: 0
                };
                myContractInstance.write(requestParams.key, requestData.value, transactionObject, function (error, result) {
                    if (!error) {
                        transactionHash = result;
                        res.status(201);
                        res.json(transactionHash);
                    }
                    else {
                        res.status(400);
                        res.json(transactionHash);
                    }
                });
            }
            catch (err) {
                res.status(400);
                res.json(transactionHash);
            }
        });
        router.get("/read/:smartcontractId/:key", function (req, res, next) {
            var blockchainurl = process.env.BLOCKCHAIN_SERVICE_URL;
            var web3 = new Web3(new Web3.providers.HttpProvider(blockchainurl));
            var requestData = req.body;
            var requestParams = req.params;
            var contractAddress = requestParams.smartcontractId;
            var transactionHas = "";
            var input = fs.readFileSync('./assets/HLSABI.json', "utf8");
            var abi = JSON.parse(input);
            try {
                var myContract = web3.eth.contract(abi);
                var myContractInstance = myContract.at(contractAddress);
                var transactionObject = {
                    from: web3.personal.listAccounts[0],
                    gas: 3000000,
                    gasPrice: 0
                };
                var result = myContractInstance.read(requestParams.key);
                res.status(200);
                res.json(result);
            }
            catch (err) {
                res.status(400);
                res.json(err);
            }
        });
        router.put("/execute/:smartcontractId/:key", function (req, res, next) {
            var blockchainurl = process.env.BLOCKCHAIN_SERVICE_URL;
            var web3 = new Web3(new Web3.providers.HttpProvider(blockchainurl));
            var requestData = req.body;
            var requestParams = req.params;
            var contractAddress = requestParams.smartcontractId;
            var transactionHash = "";
            var updateData = [web3.fromAscii(requestParams.key), web3.fromAscii(requestData.value)];
            console.log("requestData", requestData);
            var input = fs.readFileSync('./assets/HLSABI.json', "utf8");
            var abi = JSON.parse(input);
            try {
                var myContract = web3.eth.contract(abi);
                var myContractInstance = myContract.at(contractAddress);
                var transactionObject = {
                    from: web3.personal.listAccounts[0],
                    gas: 3000000,
                    gasPrice: 0
                };
                myContractInstance.executeFunction(requestData.method, requestParams.key, requestData.value, transactionObject, function (error, result) {
                    if (!error) {
                        transactionHash = result;
                        console.log("result ", result);
                        res.status(202);
                        res.json(transactionHash);
                    }
                    else {
                        transactionHash = error;
                        console.log("error ", error);
                        res.status(400);
                        res.json(transactionHash);
                    }
                });
            }
            catch (err) {
                res.status(400);
                res.json(err);
            }
        });
    };
    return IndexRoute;
})();
exports.IndexRoute = IndexRoute;
