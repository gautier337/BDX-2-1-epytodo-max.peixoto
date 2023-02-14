const query = require('./../user/user.query');
const bcrypt = require('bcryptjs')

module.exports = function(app) {

    app.post('/login', (req, res) => {
        var email = req.body["email"];
        var pwd = req.body["password"]
        if (email == null || pwd == null)
            return res.status(500).json({"msg":"Internal server error"});
        query.check_password(res, email, pwd, bcrypt, function(returned) {
            if (returned == 84)
                res.status(401).json({"msg":"Invalid Credentials"});
            return;
        });
    });

    app.post('/register', (req, res) => {
        var email = req.body["email"];
        var mname = req.body["name"];
        var fname = req.body["firstname"];
        var pwd = req.body["password"];

        if (email == null || mname == null  ||
            fname == null || pwd == null)
            return res.status(500).json({"msg":"Internal server error"});
        if (!email.includes('@') || !email.includes('.') || email.length < 5)
            return res.status(401).json({"msg":"Invalid email adress"});
        query.check_account_already_exists(res, email, function(returned) {
            if (returned == 1)
                return res.status(401).json({"msg":"Account already exist"});
            else {
                pwd = bcrypt.hashSync(pwd, 10);
                return query.register(res, email, pwd, mname, fname);
            }
        });
    });

}
