from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# In-memory storage for demo purposes
tasks = [
    {"id": 1, "title": "Learn Python", "completed": False, "created_at": "2026-01-12"},
    {"id": 2, "title": "Build a web app", "completed": False, "created_at": "2026-01-12"}
]

@app.route('/')
def home():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    return jsonify({"tasks": tasks})

@app.route('/api/tasks', methods=['POST'])
def add_task():
    """
    Add a new task to the tasks list.
    Expects a JSON payload containing at least a 'title' field.
    Creates a new task with auto-generated ID, title from request data,
    completed status set to False, and current date as creation date.
    Returns:
        tuple: A JSON response containing the created task and HTTP status code 201 on success,
               or an error message with HTTP status code 400 if title is missing.
    Raises:
        400: If request data is missing or doesn't contain 'title' field.
    """
    """Add a new task"""
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({"error": "Task title is required"}), 400
    
    new_task = {
        "id": max([task["id"] for task in tasks]) + 1 if tasks else 1,
        "title": data['title'],
        "completed": False,
        "created_at": datetime.now().strftime("%Y-%m-%d")
    }
    
    tasks.append(new_task)
    return jsonify({"task": new_task}), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task"""
    data = request.get_json()
    
    for task in tasks:
        if task["id"] == task_id:
            if 'title' in data:
                task['title'] = data['title']
            if 'completed' in data:
                task['completed'] = data['completed']
            return jsonify({"task": task})
    
    return jsonify({"error": "Task not found"}), 404

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    global tasks
    tasks = [task for task in tasks if task["id"] != task_id]
    return jsonify({"message": "Task deleted"})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get task statistics"""
    total_tasks = len(tasks)
    completed_tasks = len([task for task in tasks if task["completed"]])
    pending_tasks = total_tasks - completed_tasks
    
    return jsonify({
        "total": total_tasks,
        "completed": completed_tasks,
        "pending": pending_tasks
    })

if __name__ == '__main__':
    # Development server
    app.run(debug=True, port=5000)
else:
    # Production server (when imported by startup.py or gunicorn)
    import os
    app.debug = False