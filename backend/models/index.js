const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Project = require('./project');
const Task = require('./task');

const models = {
    Project,
    Task
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
