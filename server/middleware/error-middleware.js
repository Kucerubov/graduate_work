const ApiErrors = require("../exception/api-error");

module.exports = function (err, req, res, next) {
    console.log(  req.body);
    console.log(err);
    if(err instanceof ApiErrors) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    res.on('finish', () => {
        console.log(res.statusCode);
        console.log(res.statusMessage);
        console.log(res.getHeaders());
        console.log(res.body);
    });
    return res.status(500).json({message: 'An unexpected error'})
}