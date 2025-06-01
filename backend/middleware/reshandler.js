const reshandler = (req, res, next) => {
    const originalSend = res.send.bind(res); // Preserve the original res.send method
    res.send = function (data) {
        console.log(new Date().toLocaleDateString(), "Response", data);
        return originalSend(data); // Call the original res.send method
    };
    next();
};
module.exports = reshandler;