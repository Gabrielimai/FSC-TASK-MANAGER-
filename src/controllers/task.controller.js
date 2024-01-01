const TasksModel = require("../models/task.model");

class TaskController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async getAll() {
        try {
            const tasks = await TasksModel.find({});
            this.res.status(200).send(tasks);
        } catch (error) {
            this.res.status(500).send(error.message);
        }
    }

    async getById() {
        try {
            const taskId = this.req.params.id;

            const task = await TasksModel.findById(taskId);

            if (!task) {
                return this.res
                    .status(404)
                    .send("Essa tarefa não foi encontrada.");
            }
            return this.res.status(200).send(task);
        } catch (error) {
            this.res.status(500).send(error.message);
        }
    }

    async Create() {
        try {
            const newTask = new TasksModel(this.req.body);

            await newTask.save();

            this.res.status(201).send(newTask);
        } catch (error) {
            this.res.status(500).send(error.message);
        }
    }

    async getUpedate(){
        try {
            const taskId = this.req.params.id; // Contem o id da task
            const taskData = this.req.body; // Contem os dados da task
    
            const taskToUpdate = await TasksModel.findById(taskId); // Pega a task
    
            const allowedUpdates = ["isCompleted"]; // mapeou os campos que podemos atualizar
            const requestedUpdates = Object.keys(this.req.body); // Pega os campus que o usuário quer atualizar
    
            // Para cada campo que recebemos no body, verificamos se a lista de permitidos inclui esse campo.
            for (const update of requestedUpdates) {
                if (allowedUpdates.includes(update)) {
                    // Verifica se está incluido nos campos permitidos para atualização
                    taskToUpdate[update] = taskData[update]; // Se for verdadeiro, significa que esse campo pode ser atualizado
                } else {
                    return this.res
                        .status(500)
                        .send("Um ou mais campos inseridos, não são editáveis.");
                }
            }
    
            await taskToUpdate.save();
            return this.res.status(200).send(taskToUpdate);
        } catch (error) {
            return this.res.status(500).send(error.message);
        }
    }

    async delete(){
        try {
            const taskId = this.req.params.id;
    
            const taskToDelete = await TasksModel.findById(taskId);
    
            if (!taskToDelete) {
                return this.res.status(404).send("Essa tarefa não foi encontrada.");
            }
    
            const deletedTask = await TasksModel.findByIdAndDelete(taskId);
    
            this.res.status(200).send(deletedTask);
        } catch (error) {
            this.res.status(500).send(error.message);
        }
    }
}

module.exports = TaskController;
