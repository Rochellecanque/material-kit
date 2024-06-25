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
app.get('/projects', async (req, res) => {
    const projects = await Project.findAll();
    res.json(projects);
});

//app.post('/projects', async (req, res) => {
//    const project = await Project.create(req.body);
//    res.json(project);
//});

app.post('/projects', (req, res) => {
    // Handle the POST request here
    res.status(200).json({ message: 'Project created successfully' });
  });

app.get('/projects/:id', async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    res.json(project);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
  });
  

app.put('/projects/:id', async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    await project.update(req.body);
    res.json(project);
});

app.delete('/projects/:id', async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    await project.destroy();
    res.json({ message: 'Project deleted' });
});

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
