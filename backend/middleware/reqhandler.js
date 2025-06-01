const reqhandler = (req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}, Request date: ${new Date().toLocaleDateString()}`);
    console.log(`Request Body: ${JSON.stringify(req.body)}`);
    // console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
    next();
}
module.exports = reqhandler;