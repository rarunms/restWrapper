var bodyParser = require("body-parser");
var express = require("express");
var errorHandler = require("errorhandler");
var cors = require('cors');
var index_1 = require("./routes/index");
var contract_controller_1 = require("./app/contract/contract.controller");
var Server = (function () {
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    function Server() {
        //create expressjs application
        this.app = express();
        //configure application
        this.config();
        //add routes
        this.routes();
        //add api
        this.api();
    }
    Server.bootstrap = function () {
        return new Server();
    };
    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    Server.prototype.api = function () {
        //empty for now
    };
    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    Server.prototype.config = function () {
        //mount json form parser
        this.app.use(bodyParser.json());
        //mount query string parser
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cors());
        this.app.use(express.static('public/dist'));
        this.app.get('/accountmanage', function (req, res) {
            var uid = req.params.uid, path = req.params[0] ? req.params[0] : 'index.html';
            res.sendFile(path, { root: 'public/dist' });
        });
        this.app.get('/accountmanage', function (req, res) {
            var uid = req.params.uid, path = req.params[0] ? req.params[0] : 'index.html';
            res.sendFile(path, { root: 'public/dist' });
        });
        this.app.get('/deploy/deploycontract', function (req, res) {
            var uid = req.params.uid, path = req.params[0] ? req.params[0] : 'index.html';
            res.sendFile(path, { root: 'public/dist' });
        });
        this.app.get('/analytics', function (req, res) {
            var uid = req.params.uid, path = req.params[0] ? req.params[0] : 'index.html';
            res.sendFile(path, { root: 'public/dist' });
        });
        this.app.get('/scheduling', function (req, res) {
            var uid = req.params.uid, path = req.params[0] ? req.params[0] : 'index.html';
            res.sendFile(path, { root: 'public/dist' });
        });
        this.app.get('/blockexplorer', function (req, res) {
            var uid = req.params.uid, path = req.params[0] ? req.params[0] : 'index.html';
            res.sendFile(path, { root: 'public/dist' });
        });
        // catch 404 and forward to error handler
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        //error handling
        this.app.use(errorHandler());
    };
    Server.prototype.routes = function () {
        var router;
        router = express.Router();
        //IndexRoute
        index_1.IndexRoute.create(router);
        //ContractController
        contract_controller_1.ContractController.index(router);
        //use router middleware
        this.app.use(router);
    };
    return Server;
})();
exports.Server = Server;
