const db = require('../../config/db');
const jwt = require('jsonwebtoken');

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}

function get_user_with_id(res, id) {
    db.query('SELECT * FROM `user` WHERE id = ?', [id], function(err, results, fields) {
        if (results)
            if (results.length > 0)
                return res.status(200).json(results);
            else
                return res.status(200).json({"msg":"Not found"});
        else
            return res.status(500).json({"msg":"Internal server error"});
    });
}

function get_user_with_email(res, mail) {
    db.query('SELECT * FROM `user` WHERE email = ?', [mail], function(err, results, fields) {
        if (results) {
            if (results.length > 0)
                return res.status(200).json(results);
            else
                return res.status(200).json({"msg":"Not found"});
        } else
            return res.status(500).json({"msg":"Internal server error"});
    });
}

function all_user(res) {
    db.query('SELECT * FROM `user`', function(err, results, fields) {
        if (results)
            if (results.length > 0)
                return res.status(200).json(results);
            else
                return res.status(200).json({"msg":"Not found"});
        else
            return res.status(500).json({"msg":"Internal server error"});
    });
}

function check_account_already_exists(res, mail, return_value) {
    db.execute('SELECT * FROM `user` WHERE email = ?', [mail], function(err, results, fields) {
        if (results && results.length > 0)
            return_value(1);
        else
            return_value(0);
        return;
    })
}

function check_password(res, mail, pwd, bcrypt, return_value) {
    db.execute('SELECT password, id FROM `user` WHERE email = ?', [mail], function(err, results, fields) {
        if (!results)
            return res.status(500).json({"msg":"Internal server error"});
        if (results.length > 0) {
            var password2 = results[0].password;
            var id2 = results[0].id;
            if (bcrypt.compareSync(pwd, password2)) {
                const token = jwt.sign({email:mail, id:id2}, process.env.SECRET, {expiresIn: '30000s'});
                res.json({token});
                return_value(0);
            } else
                return_value(84);
        } else
            return_value(84);
        return;
    })
}

function register(res, mail, pwd, mname, fname) {
    db.execute('INSERT INTO `user` (id, email, password, name, firstname) VALUES (?, ?, ?, ?, ?)',
        [0, mail, pwd, mname, fname], function() {
        const token = jwt.sign({email:mail, password:pwd}, process.env.SECRET);
        res.status(201).json({token});
    })
}

function update_data_user_with_id(res, id, email, pwd, name, firstname) {
    db.execute('UPDATE `user` SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?',
        [email, pwd, name, firstname, id], function(err, results, fields) {
        if (!results)
            return res.status(500).json({"msg":"Internal server error"});
        if (results.changedRows > 0)
            db.execute('SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?',
                [id], function(err, results, fields) {
                return res.status(200).json(results);
            });
        else
            return res.status(401).json({"msg":"Bad parameter"});
    });
}

function delete_user_with_id(res, id) {
    db.execute('DELETE FROM `user` WHERE id = ?', [id], function(err, results, fields) {
        if (!results)
            return res.status(500).json({"msg":"Internal server error"});
        if (results && results.affectedRows > 0)
            return res.status(200).json({"msg":"Succesfully deleted record number: " + id});
        else
            return res.status(401).json({"msg":"Bad parameter"});
    });
}

module.exports = {
    isNumeric,
    delete_user_with_id,
    update_data_user_with_id,
    get_user_with_id,
    get_user_with_email,
    all_user,
    check_account_already_exists,
    check_password,
    register
}