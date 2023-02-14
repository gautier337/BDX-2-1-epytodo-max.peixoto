const db = require('../../config/db');

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}

function get_todos_id(res, id) {
    db.query('SELECT * FROM todo WHERE id = ?', [id], function(err, results, fields) {
        if (results) {
            if (results.length > 0)
                return res.status(200).json(results);
            else
                return res.status(200).json({"msg":"Not found"});
        } else
            return res.status(500).json({"msg":"Internal server error"});
    })
}

function get_all_todos(res) {
    db.query('SELECT * FROM todo', function(err, results, fields) {
        if (results)
            if (results.length > 0)
                return res.status(200).json(results);
            else
                return res.status(200).json({"msg":"Not found"});
        else
            return res.status(500).json({"msg":"Internal server error"});
    })
}

function insert_todos(res, user, title, description, due_time, status) {
    db.execute('INSERT INTO todo (user_id, title, description, due_time, status) VALUES (?, ?, ?, ?, ?)',
        [user, title, description, due_time, status], function(err, results, fields) {
        if (results)
            return get_todos_id(res, results.insertId);
        else
            return res.status(500).json({"msg":"Internal server error"});
    })
}

function delete_todos_id(res, id) {
    db.execute('DELETE FROM todo WHERE id = ?', [id], function(err, results, fields) {
        if (results)
            return res.status(200).json({"msg":"Successfully deleted record number: " + id});
        else
            return res.status(500).json({"msg":"Internal server error"});
    })
}

module.exports = {
    isNumeric,
    delete_todos_id,
    get_todos_id,
    insert_todos,
    get_all_todos
}
