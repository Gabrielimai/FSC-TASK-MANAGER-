const express = require("express");
const dotenv = require("dotenv");

const connectToDatabase = require("./src/database/mongoose.database");
const TasksModel = require("./src/models/task.model");

dotenv.config();
const app = express();
app.use(express.json());

connectToDatabase();

// Pegando todas as tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await TasksModel.find({});
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Pegando uma task pelo Id
app.get("/tasks/:id", async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await TasksModel.findById(taskId);

        if (!task) {
            return res.status(404).send("Essa tarefa não foi encontrada.");
        }
        return res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Criando uma task
app.post("/tasks", async (req, res) => {
    try {
        const newTask = new TasksModel(req.body);

        await newTask.save();

        res.status(201).send(newTask);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Atualizando uma task
app.patch("/tasks/:id", async (req, res) => {
    try {
        const taskId = req.params.id; // Contem o id da task
        const taskData = req.body; // Contem os dados da task

        const taskToUpdate = await TasksModel.findById(taskId); // Pega a task

        const allowedUpdates = ["isCompleted"]; // mapeou os campos que podemos atualizar
        const requestedUpdates = Object.keys(req.body); // Pega os campus que o usuário quer atualizar

        // Para cada campo que recebemos no body, verificamos se a lista de permitidos inclui esse campo.
        for (update of requestedUpdates) {
            if (allowedUpdates.includes(update)) {  // Verifica se está incluido nos campos permitidos para atualização
                taskToUpdate[update] = taskData[update]; // Se for verdadeiro, significa que esse campo pode ser atualizado
            } else {
                return res
                    .status(500)
                    .send("Um ou mais campos inseridos, não são editáveis.");
            }
        }

        await taskToUpdate.save();
        return res.status(200).send(taskToUpdate);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// Deletando uma task
app.delete("/tasks/:id", async (req, res) => {
    try {
        const taskId = req.params.id;

        const taskToDelete = await TasksModel.findById(taskId);

        if (!taskToDelete) {
            return res.status(404).send("Essa tarefa não foi encontrada.");
        }

        const deletedTask = await TasksModel.findByIdAndDelete(taskId);

        res.status(200).send(deletedTask);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(8000, () => console.log("Listening on port 8000!"));
