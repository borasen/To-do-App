const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let todos = [];

// Route to get all todos
app.get('/api/notes', (req, res) => {
    res.json(todos);
});

// Route to add a new todo
app.post('/api/notes', (req, res) => {
    const { title, time } = req.body;
    const newTodo = {
        id: todos.length ? todos[todos.length - 1].id + 1 : 1,
        title: title,
        time: time
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
