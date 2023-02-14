const query = require('./user.query');
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs')

module.exports = function(app) {

    app.get('/user', auth, (req, res) => {
        var user = req.user;

        if (!req.user)
            return res.status(500).json({"msg":"Internal server error"});
        return query.get_user_with_id(res, user);
    });

    app.get('/user/:request', auth, (req, res) => {
        var request_string = req.params.request;

        if (!request_string)
            return res.status(500).json({"msg":"Internal server error"});
        if (request_string.includes('@')) {
            if (request_string.includes('.') && request_string.length > 5)
                return query.get_user_with_email(res, request_string)
            else
                return res.status(401).json({"msg":"Bad parameter"});
        }
        if (query.isNumeric(request_string) == false)
            return res.status(200).json({"msg":"Bad parameter"})
        return query.get_user_with_id(res, request_string);
    });

    app.put('/user/:id', auth, (req, res) => {
        var id = req.params.id;
        var email = req.body["email"];
        var password = req.body["password"];
        var firstname = req.body["firstname"];
        var name = req.body["name"];

        if (!id || !email || !password || !firstname || !name)
            return res.status(500).json({"msg":"Internal server error"});
        if (query.isNumeric(id) == false)
            return res.status(200).json({"msg":"Bad parameter"})
        password = bcrypt.hashSync(password, 10);
        return query.update_data_user_with_id(res, id, email, password, name, firstname);
    });

    app.delete("/user/:id", auth, (req, res) => {
        var id = req.params.id;

        if (!id)
            return res.status(500).json({"msg":"Internal server error"});
        if (query.isNumeric(id) == false)
            return res.status(200).json({"msg":"Bad parameter"})
        return query.delete_user_with_id(res, id);
    });

}
