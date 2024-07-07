const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const { Project, Task } = require('./models');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/api', taskRoutes);

sequelize.sync({ force: false })
    .then(() => console.log('Database & tables created!'))
    .catch(err => console.log('Error: ' + err));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.post('/invite', (req, res) => {
    const { email } = req.body;
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Team Invitation',
        text: 'You have been invited to join our team.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Failed to send invitation. ' + error.toString());
        }
        res.status(200).send('Invitation sent: ' + info.response);
    });
});

// Get all projects
app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});

// Create a new project
app.post('/projects', async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Get a specific project by ID
app.get('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve project' });
    }
});

// Update a project by ID
app.put('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            await project.update(req.body);
            res.json(project);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// Delete a project by ID
app.delete('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            await project.destroy();
            res.json({ message: 'Project deleted' });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Get all tasks for a specific project
app.get('/projects/:projectId/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { projectId: req.params.projectId } });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
});

// Create a new task for a specific project
app.post('/projects/:projectId/tasks', async (req, res) => {
    try {
        const { title, description, dueDate, completed } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        const task = await Task.create({ title, description, dueDate, completed, projectId: req.params.projectId });
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Get a specific task by ID
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve task' });
    }
});

// Update a specific task by ID
app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (task) {
            await task.update(req.body);
            res.json(task);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a specific task by ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (task) {
            await task.destroy();
            res.json({ message: 'Task deleted' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
