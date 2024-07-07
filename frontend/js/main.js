document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/projects')
        .then(response => response.json())
        .then(projects => {
            const projectList = document.getElementById('project-list');
            projectList.innerHTML = '';
            projects.forEach(project => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${project.name}</td>
                    <td>${project.description}</td>
                    <td>${new Date(project.startDate).toLocaleDateString()}</td>
                    <td>${new Date(project.endDate).toLocaleDateString()}</td>
                    <td>${project.budget}</td>
                    <td>${project.status}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="openTasksModal(${project.id})">Tasks</button>
                        <button class="btn btn-info btn-sm" onclick="populateUpdateForm(${project.id})">Update</button>
                        <button class="btn btn-danger btn-sm" onclick="confirmDelete(${project.id}, this)">Delete</button>
                    </td>
                `;
                projectList.appendChild(row);
            });
        });

    document.getElementById('create-project-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const projectId = document.getElementById('projectId').value;
        const project = {
            name: formData.get('name'),
            description: formData.get('description'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            budget: formData.get('budget'),
            status: formData.get('status')
        };

        if (projectId) {
            fetch(`http://localhost:3000/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(project)
            })
            .then(response => response.json())
            .then(updatedProject => {
                location.reload();
            })
            .catch(error => {
                console.error('Error updating project:', error);
            });
        } else {
            fetch('http://localhost:3000/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(project)
            })
            .then(response => response.json())
            .then(newProject => {
                location.reload();
            });
        }
            // Clear form fields after submission
        document.getElementById('create-project-form').reset();
    });
});



function populateUpdateForm(projectId) {
    fetch(`http://localhost:3000/projects/${projectId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch project');
            }
            return response.json();
        })
        .then(project => {
            const updateModal = new bootstrap.Modal(document.getElementById('projectModal'));
            const projectIdInput = document.getElementById('projectId');
            const name = document.getElementById('name');
            const description = document.getElementById('description');
            const startDate = document.getElementById('startDate');
            const endDate = document.getElementById('endDate');
            const budget = document.getElementById('budget');
            const status = document.getElementById('status');

            projectIdInput.value = project.id;
            name.value = project.name;
            description.value = project.description;
            startDate.value = project.startDate.split('T')[0];
            endDate.value = project.endDate.split('T')[0];
            budget.value = project.budget;
            status.value = project.status;

            updateModal.show();
        })
        .catch(error => {
            console.error('Error fetching project:', error);
        });
}

function confirmDelete(projectId, button) {
    const confirmed = confirm('Are you sure you want to delete this project?');
    if (confirmed) {
        deleteProject(projectId, button);
    }
}

function deleteProject(projectId, button) {
    fetch(`http://localhost:3000/projects/${projectId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            const row = button.closest('tr');
            if (row) {
                row.remove();
            } else {
                console.error('Could not find row to delete.');
            }
        } else {
            alert('Failed to delete the project.');
        }
    })
    .catch(error => {
        console.error('Error deleting project:', error);
        alert('Failed to delete the project.');
    });
}

function openTasksModal(projectId) {
    document.getElementById('projectId').value = projectId;
    fetchTasks(projectId);
    $('#tasksModal').modal('show');
}

function fetchTasks(projectId) {
    fetch(`http://localhost:3000/projects/${projectId}/tasks`)
        .then(response => response.json())
        .then(tasks => {
            const tasksList = document.getElementById('tasks-list');
            tasksList.innerHTML = '';
            tasks.forEach(task => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                listItem.innerHTML = `
                    ${task.title} - ${task.description}
                    <div>
                        <button class="btn btn-info btn-sm" onclick="editTask(${task.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="confirmDeleteTask(${task.id}, this)">Delete</button>
                    </div>
                `;
                tasksList.appendChild(listItem);
            });
        });
}

document.getElementById('create-task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskId = document.getElementById('taskId').value;
    const projectId = document.getElementById('projectId').value;
    const task = {
        title: formData.get('taskName'),
        description: formData.get('taskDescription')
    };

    if (taskId) {
        fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(updatedTask => {
            $('#tasksModal').modal('hide');
            fetchTasks(projectId);
        });
    } else {
        fetch(`http://localhost:3000/projects/${projectId}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(newTask => {
            $('#tasksModal').modal('hide');
            fetchTasks(projectId);
        });
    }
    document.getElementById('create-task-form').reset();
});

function editTask(taskId) {
    fetch(`http://localhost:3000/tasks/${taskId}`)
        .then(response => response.json())
        .then(task => {
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskName').value = task.title;
            document.getElementById('taskDescription').value = task.description;
        });
}

function confirmDeleteTask(taskId, button) {
    const confirmed = confirm('Are you sure you want to delete this task?');
    if (confirmed) {
        deleteTask(taskId, button);
    }
}

function deleteTask(taskId, button) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            const listItem = button.closest('li');
            listItem.remove();
        } else {
            alert('Failed to delete the task.');
        }
    });
}
