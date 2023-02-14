const query = require('./todos.query');
const auth = require('../../middleware/auth');

module.exports = function(app) {

    app.get('/user/todos', auth, (req, res) => {
        var user = req.user;

        if (!req.user)
            return res.status(500).json({"msg":"Internal server error"});
        return query.get_todos_id(res, user);
    });

    app.get("/todos/:id", auth, (req, res) => {
        var id = req.params.id;

        if (!id)
            return res.status(500).json({"msg":"Internal server error"});
        if (query.isNumeric(id) == false)
            return res.status(200).json({"msg":"Bad parameter"})
        return query.get_todos_id(res, id);
    });
    app.get("/todos", auth, (req, res) => {
        return query.get_all_todos(res);
    });

    app.post("/todos", auth, (req, res) => {
        var user = req.user;
        var title = req.body["title"];
        var description = req.body["description"];
        var due_time = req.body["due_time"];
        var status = req.body["status"];

        if (!title || !description || !user || !due_time || !status)
            return res.status(500).json({"msg":"Internal server error"});
        return query.insert_todos(res, user, title, description, due_time, status);
    });

    app.post("/todos/:id", auth, (req, res) => {
        var user = req.params.id;
        var title = req.body["title"];
        var description = req.body["description"];
        var due_time = req.body["due_time"];
        var status = req.body["status"];

        if (!title || !description || !user || !due_time || !status)
            return res.status(500).json({"msg":"Internal server error"});
        if (query.isNumeric(id) == false)
            return res.status(200).json({"msg":"Bad parameter"})
        return query.insert_todos(res, user, title, description, due_time, status);
    });

    app.delete("/todos/:id", auth, (req, res) => {
        var id = req.params.id;

        if (!id)
            return res.status(500).json({"msg":"Internal server error"});
        if (query.isNumeric(id) == false)
            return res.status(200).json({"msg":"Bad parameter"})
        return query.delete_todos_id(res, id);
    });
}
