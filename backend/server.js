const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const Project = require('./models/project');
const Task = require('./models/task');

const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

sequelize.sync()
    .then(() => console.log('Database synced...'))
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

let projects = []; 

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

// Task 2 Routes
// Get all projects
app.get('/projects', async (req, res) => {
    try {
        // Fetch projects from a database or another source
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});

//app.post('/projects', async (req, res) => {
//    const project = await Project.create(req.body);
//    res.json(project);
//});

// app.post('/projects', async (req, res) => {
//     try {
//         const project = await Project.create(req.body);
//         res.status(201).json(project);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to create project' });
//     }
// });

// Create a new project
app.post('/projects', async (req, res) => {
    try {
        const project = await Project.create(req.body);
        projects.push(project); // Push the newly created project into the projects array
        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

app.get('/projects/:id', async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    res.json(project);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
  });
  

//   app.put('/projects/:id', async (req, res) => {
//     const project = await Project.findByPk(req.params.id);
//     if (project) {
//         await project.update(req.body);
//         res.json(project);
//     } else {
//         res.status(404).json({ error: 'Project not found' });
//     }
// })

// Update project by ID
app.put('/projects/:id', (req, res) => {
    const projectId = parseInt(req.params.id);
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
        projects[index] = req.body;
        res.json(projects[index]);
    } else {
        res.status(404).json({ error: 'Project not found' });
    }
});

// Delete project by ID
app.delete('/projects/:id', (req, res) => {
    const projectId = parseInt(req.params.id);
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
        projects.splice(index, 1);
        res.sendStatus(200);
    } else {
        res.status(404).json({ error: 'Project not found' });
    }
});

// app.delete('/projects/:id', async (req, res) => {
//     const project = await Project.findByPk(req.params.id);
//     if (project) {
//         await project.destroy();
//         res.json({ message: 'Project deleted' });
//     } else {
//         res.status(404).json({ error: 'Project not found' });
//     }
// });

app.get('/projects/:projectId/tasks', async (req, res) => {
    const tasks = await Task.findAll({ where: { projectId: req.params.projectId } });
    res.json(tasks);
});

app.post('/projects/:projectId/tasks', async (req, res) => {
    const task = await Task.create({ ...req.body, projectId: req.params.projectId });
    res.json(task);
});

app.get('/tasks/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    await task.update(req.body);
    res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    await task.destroy();
    res.json({ message: 'Task deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
