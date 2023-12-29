const { Schema, model } = require("mongoose");

const TasksSchema = Schema({
    description: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
});

const TasksModel = model("Task", TasksSchema);

module.exports = TasksModel;
