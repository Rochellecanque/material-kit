const express = require('express');
const router = express.Router();
const { Task } = require('../models');

// Create Task
router.post('/projects/:projectId/tasks', async (req, res) => {
    try {
        const { title, description, dueDate, completed } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        const task = await Task.create({
            title,
            description,
            dueDate,
            completed,
            projectId: req.params.projectId
        });
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Get Tasks for Project
router.get('/projects/:projectId/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { projectId: req.params.projectId }
        });
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Update Task
router.put('/tasks/:taskId', async (req, res) => {
    try {
        const { title, description, dueDate, completed } = req.body;
        const task = await Task.findByPk(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.completed = completed || task.completed;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete Task
router.delete('/tasks/:taskId', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        await task.destroy();
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
