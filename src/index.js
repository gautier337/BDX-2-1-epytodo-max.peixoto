const express = require('express')
const { json } = require('express/lib/response')
const app = express()
const port = 3000
app.use(express.json())
require('dotenv').config();
require('./routes/todos/todos')(app);
require('./routes/user/user')(app);
require('./routes/auth/auth')(app);

app.listen(port, function() {
  console.log(`App listening on port ${port}`)
})
