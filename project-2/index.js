const express = require("express");
const port = 8015;

const server = express();

server.use(express.urlencoded());
server.set("view engine", "ejs");

let taskData = [
    { id: "1", task: "Buy groceries" },
    { id: "2", task: "Complete project" },
    { id: "3", task: "Read a book" },
];

server.get("/", (req, res) => {
    res.render("index", { tasks: taskData });
});

server.get("/editTask/:id", (req, res) => {
    let editTask = taskData.find(task => task.id === req.params.id);
    if (!editTask) {
        return res.redirect("/");
    }
    res.render("edit", { editTask });
});

server.post("/addTask", (req, res) => {
    const { id, task } = req.body;

    if (taskData.some(t => t.id === id)) {
        console.log("Error: Task ID already exists");
        return res.redirect("/");
    }

    taskData.push({ id, task });
    console.log("Task added:", { id, task });
    res.redirect("/");
});
server.get("/deleteTask/:id", (req, res) => {
    let taskId = req.params.id;
    taskData = taskData.filter(task => task.id !== taskId);
    console.log("Deleted task with ID:", taskId);
    res.redirect("/");
});

server.post("/editTask/:id", (req, res) => {
    let taskId = req.params.id;
    const { task } = req.body;

    let index = taskData.findIndex(t => t.id === taskId);
    if (index !== -1) {
        taskData[index] = { id: taskId, task };
        console.log("Task updated:", { id: taskId, task });
    }

    res.redirect("/");
});

server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
});