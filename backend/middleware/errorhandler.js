const errorhandler = (err, req, res, next) => {
    console.error(new Date().toLocaleDateString(), 'Error:', err.stack);
    
    
    if (err.name === 'ValidationError') {
        res.status(400).send({
            message: 'Validation Error',
            error: err.message
        });
    }
    if (err.name === "UnauthorizedError") {
        res.status(401).send({
            message: 'Unauthorized',
            error: err.message
        });
    }
    if (err.name === "NotFoundError") {
        res.status(404).send({
            message: 'Not Found',
            error: err.message
        });
    }
    if (err.name === "ForbiddenError") {
        res.status(403).send({
            message: 'Forbidden',
            error: err.message
        });
    }
    else {
        res.status(500).send({
            message: 'Internal Server Error',
            error: err.message
        });
    }   
}
module.exports = errorhandler;