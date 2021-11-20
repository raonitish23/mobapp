const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var multer = require('multer');
var upload = multer();
const path = require('path')
module.exports = function () {
    let server = express(),
        create,
        start;

    create = (config, db) => {
        let routes = require('../routes');
        // set all the server things
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);


        
        server.use(express.static(path.join(__dirname, '../public')));
        // server.use(bodyParser.json());
        // server.use(bodyParser.urlencoded({
        //     extended: true
        // }));
        server.use(express.json());       // to support JSON-encoded bodies
        server.use(express.urlencoded()); // to support URL-encoded bodies

        server.use(function (err, req, res, next) {
            
            if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
                
                res.status(400).send({ code: 400, message: "Bad Request" });
            } else next();
        });


        //connect the database
        mongoose.connect(
            db.database,
            db.options
        ).then(() => console.log("Successfully connect to MongoDB."))
            .catch(err => console.error("Connection error", err));

        // Set up routes
        routes.init(server);
    };


    start = () => {
        let hostname = server.get('hostname'),
            port = server.get('port');
        server.listen(port, function () {
            console.log('Express server listening on - http://' + hostname + ':' + port);
        });
    };
    return {
        create: create,
        start: start
    };
};
