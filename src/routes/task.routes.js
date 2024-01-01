const express = require("express");

const TaskController = require("../controllers/task.controller");
const TasksModel = require("../models/task.model");

const router = express.Router();

// Pegando todas as tasks
router.get("", async (req, res) => {
    return new TaskController(req, res).getAll();
});

// Pegando uma task pelo Id
router.get("/:id", async (req, res) => {
    return new TaskController(req, res).getById();
});

// Criando uma task
router.post("", async (req, res) => {
    return new TaskController(req, res).Create();
});

//Atualizando uma task
router.patch("/:id", async (req, res) => {
    return new TaskController(req, res).getUpedate();
});

// Deletando uma task
router.delete("/:id", async (req, res) => {
  return new TaskController(req,res).delete();
});

module.exports = router;
