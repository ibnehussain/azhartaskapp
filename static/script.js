class TaskManager {
    constructor() {
        this.apiUrl = '/api';
        this.tasks = [];
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadTasks();
        await this.loadStats();
    }

    bindEvents() {
        const addTaskBtn = document.getElementById('add-task-btn');
        const taskInput = document.getElementById('task-input');

        addTaskBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
    }

    async loadTasks() {
        try {
            const response = await fetch(`${this.apiUrl}/tasks`);
            const data = await response.json();
            this.tasks = data.tasks;
            this.renderTasks();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showError('Failed to load tasks');
        }
    }

    async loadStats() {
        try {
            const response = await fetch(`${this.apiUrl}/stats`);
            const data = await response.json();
            this.updateStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    async addTask() {
        const taskInput = document.getElementById('task-input');
        const title = taskInput.value.trim();

        if (!title) {
            this.showError('Please enter a task title');
            return;
        }

        const addTaskBtn = document.getElementById('add-task-btn');
        addTaskBtn.disabled = true;
        addTaskBtn.textContent = 'Adding...';

        try {
            const response = await fetch(`${this.apiUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: title })
            });

            if (response.ok) {
                const data = await response.json();
                this.tasks.push(data.task);
                taskInput.value = '';
                this.renderTasks();
                this.loadStats();
                this.showSuccess('Task added successfully!');
            } else {
                throw new Error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
            this.showError('Failed to add task');
        } finally {
            addTaskBtn.disabled = false;
            addTaskBtn.textContent = 'Add Task';
        }
    }

    async toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        try {
            const response = await fetch(`${this.apiUrl}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !task.completed })
            });

            if (response.ok) {
                task.completed = !task.completed;
                this.renderTasks();
                this.loadStats();
            } else {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            this.showError('Failed to update task');
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.renderTasks();
                this.loadStats();
                this.showSuccess('Task deleted successfully!');
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            this.showError('Failed to delete task');
        }
    }

    async editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const newTitle = prompt('Edit task:', task.title);
        if (!newTitle || newTitle.trim() === '') return;

        try {
            const response = await fetch(`${this.apiUrl}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle.trim() })
            });

            if (response.ok) {
                task.title = newTitle.trim();
                this.renderTasks();
                this.showSuccess('Task updated successfully!');
            } else {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            this.showError('Failed to update task');
        }
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        
        if (this.tasks.length === 0) {
            container.innerHTML = '<p class="no-tasks">🎉 No tasks yet. Add one above!</p>';
            return;
        }

        const tasksHtml = this.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-content">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${task.completed ? 'checked' : ''} 
                        onchange="taskManager.toggleTask(${task.id})"
                    >
                    <span class="task-title ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.title)}</span>
                    <span class="task-date">${task.created_at}</span>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="taskManager.editTask(${task.id})">
                        ✏️ Edit
                    </button>
                    <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = tasksHtml;
    }

    updateStats(stats) {
        document.getElementById('total-tasks').textContent = stats.total;
        document.getElementById('completed-tasks').textContent = stats.completed;
        document.getElementById('pending-tasks').textContent = stats.pending;
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});