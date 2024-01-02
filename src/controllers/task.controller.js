const TasksModel = require("../models/task.model");
const { notFoundError, objectIdCastError } = require("../errors/mongodb.error");
const { notAllowedFieldsToUpdateError } = require("../errors/general.errors");
const { default: mongoose } = require("mongoose");

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
                return notFoundError(this.res);
            }

            return this.res.status(200).send(task);
        } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
                return objectIdCastError(this.res);
            }

            return this.res.status(500).send(error.message);
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

    async getUpedate() {
        try {
            const taskId = this.req.params.id; // Contem o id da task
            const taskData = this.req.body; // Contem os dados da task

            const taskToUpdate = await TasksModel.findById(taskId); // Pega a task

            if (!taskToUpdate) {
                return notFoundError(this.res);
            }

            const allowedUpdates = ["isCompleted"]; // mapeou os campos que podemos atualizar
            const requestedUpdates = Object.keys(this.req.body); // Pega os campus que o usuário quer atualizar

            // Para cada campo que recebemos no body, verificamos se a lista de permitidos inclui esse campo.
            for (const update of requestedUpdates) {
                if (allowedUpdates.includes(update)) {
                    // Verifica se está incluido nos campos permitidos para atualização
                    taskToUpdate[update] = taskData[update]; // Se for verdadeiro, significa que esse campo pode ser atualizado
                } else {
                    return notAllowedFieldsToUpdateError(this.res);
                }
            }

            await taskToUpdate.save();
            return this.res.status(200).send(taskToUpdate);
        } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
                return objectIdCastError(this.res);
            }
            return this.res.status(500).send(error.message);
        }
    }

    async delete() {
        try {
            const taskId = this.req.params.id;

            const taskToDelete = await TasksModel.findById(taskId);

            if (!taskToDelete) {
                return notFoundError(this.res);
            }

            const deletedTask = await TasksModel.findByIdAndDelete(taskId);

            this.res.status(200).send(deletedTask);
        } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
                return objectIdCastError(this.res);
            }
            this.res.status(500).send(error.message);
        }
    }
}

module.exports = TaskController;
