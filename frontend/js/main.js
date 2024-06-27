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
                        <button class="btn btn-info btn-sm" onclick="populateUpdateForm(${project.id})">Update</button>
                        <button class="btn btn-danger btn-sm" onclick="confirmDelete(${project.id}, this)">Delete</button>
                    </td>
                `;
                projectList.appendChild(row);
            });
        });
                // const listItem = document.createElement('li');
                // listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                // listItem.textContent = project.name;

                // Create delete button
                // const deleteButton = document.createElement('button');
                // deleteButton.className = 'btn btn-danger btn-sm ml-2';
                // deleteButton.textContent = 'Delete';
                // deleteButton.onclick = () => deleteProject(project.id, listItem);

                // Create update button
                // const updateButton = document.createElement('button');
                // updateButton.className = 'btn btn-info btn-sm ml-2';
                // updateButton.textContent = 'Update';
                // updateButton.onclick = () => populateUpdateForm(project);


        //         listItem.appendChild(deleteButton);
        //         listItem.appendChild(updateButton);
        //         projectList.appendChild(listItem);
        //     });
        // });

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
            // Update project
            fetch(`http://localhost:3000/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(project)
            })
            .then(response => response.json())
            .then(updatedProject => {
                location.reload(); // Reload to see the updated project list
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
                location.reload(); // Reload to see the new project in the list
            });
            // .then(newProject => {
            //     const projectList = document.getElementById('project-list');
            //     const listItem = document.createElement('li');
            //     listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            //     listItem.textContent = newProject.name;
                
            //     // Add delete button to new project
            //     const deleteButton = document.createElement('button');
            //     deleteButton.className = 'btn btn-danger btn-sm ml-2';
            //     deleteButton.textContent = 'Delete';
            //     deleteButton.onclick = () => deleteProject(newProject.id, listItem);
            //     listItem.appendChild(deleteButton);
                
            //     // Add update button to new project
            //     const updateButton = document.createElement('button');
            //     updateButton.className = 'btn btn-info btn-sm ml-2';
            //     updateButton.textContent = 'Update';
            //     updateButton.onclick = () => populateUpdateForm(newProject);
            //     listItem.appendChild(updateButton);

            //     projectList.appendChild(listItem);
            //     $('#projectModal').modal('hide');
            // });
        }
    });
});


// Populate the form with existing project data for updating
// function populateUpdateForm(project) {
//     console.log('Populating form with project:', project);
//     const projectId = document.getElementById('projectId');
//     const name = document.getElementById('name');
//     const description = document.getElementById('description');
//     const startDate = document.getElementById('startDate');
//     const endDate = document.getElementById('endDate');
//     const budget = document.getElementById('budget');
//     const status = document.getElementById('status');

//     if (projectId && name && description && startDate && endDate && budget && status) {
//         projectId.value = project.id;
//         name.value = project.name;
//         description.value = project.description;
//         startDate.value = project.startDate.split('T')[0]; // Extract date part
//         endDate.value = project.endDate.split('T')[0]; // Extract date part
//         budget.value = project.budget;
//         status.value = project.status;
//         $('#projectModal').modal('show');
//     } else {
//         console.error('One or more elements are not found:', {
//             projectId,
//             name,
//             description,
//             startDate,
//             endDate,
//             budget,
//             status
//         });
//     }
// }

// Populate the form with existing project data for updating
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
            startDate.value = project.startDate.split('T')[0]; // Extract date part
            endDate.value = project.endDate.split('T')[0]; // Extract date part
            budget.value = project.budget;
            status.value = project.status;

            // jQuery.noConflict();
            // Use jQuery instead of $ to ensure compatibility
            // jQuery('#updateProjectModal').modal('show');
            updateModal.show();
        })
        .catch(error => {
            console.error('Error fetching project:', error);
        });
}

// Delete project function
// function deleteProject(projectId, listItem) {
//     if (confirm('Are you sure you want to delete this project?')) {
//         fetch(`http://localhost:3000/projects/${projectId}`, {
//             method: 'DELETE'
//         })
//         .then(response => {
//             if (response.ok) {
//                 listItem.remove();
//             } else {
//                 alert('Failed to delete the project.');
//             }
//         });
//     }
// }


// Delete project function
// function deleteProject(projectId, button) {
//     if (confirm('Are you sure you want to delete this project?')) {
//         fetch(`http://localhost:3000/projects/${projectId}`, {
//             method: 'DELETE'
//         })
//         .then(response => {
//             if (response.ok) {
//                 const row = button.closest('tr');
//                 row.remove();
//             } else {
//                 alert('Failed to delete the project.');
//             }
//         });
//     }
// }

function confirmDelete(projectId, button) {
    console.log('Confirm delete function called with projectId:', projectId);
    const confirmed = confirm('Are you sure you want to delete this project?');
    if (confirmed) {
        deleteProject(projectId, button);
    }
}

function deleteProject(projectId, button) {
    console.log('Delete project function called with projectId:', projectId);
    // if (!projectId) {
    //     console.error('Project ID is undefined or null.');
    //     return;
    // }

    // const confirmed = confirm('Are you sure you want to delete this project?');
    // if (!confirmed) {
    //     return; // Exit if user cancels
    // }

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