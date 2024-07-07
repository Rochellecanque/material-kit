const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = require('./project');

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    dueDate: {
        type: DataTypes.DATE
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

Task.belongsTo(Project, { foreignKey: 'projectId' });

module.exports = Task;
