const apiRoute = require('./apis');

const init = (server) => {
    server.get('*', function (req, res, next) {
        return next();
    });
    
    server.use('/api', apiRoute);
}
module.exports = {
    init: init
};