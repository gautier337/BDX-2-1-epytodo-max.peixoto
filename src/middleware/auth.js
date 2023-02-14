const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || !authHeader)
        return res.status(401).json({"msg":"No token, authorization denied"});
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err)
            return res.status(400).json({"msg":"Token is not valid"});
        req.user = user["id"]
        next();
    });
};
