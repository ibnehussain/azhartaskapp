# Task Manager Web App

A simple web application with Python Flask backend and HTML/CSS/JavaScript frontend.

## Features

- ✅ Add, edit, and delete tasks
- 📊 View task statistics
- 🎨 Modern, responsive UI
- 🔄 Real-time updates
- 💾 REST API backend

## Project Structure

```
azhartaskapp/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML page
├── static/
│   ├── styles.css        # CSS styling
│   └── script.js         # JavaScript functionality
└── .venv/                # Python virtual environment
```

## How to Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ibnehussain/azhartaskapp.git
   cd azhartaskapp
   ```

2. **Set up virtual environment:**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask server:**
   ```bash
   python app.py
   ```

5. **Open your browser and go to:**
   ```
   http://localhost:5000
   ```

## API Endpoints

- `GET /` - Serve the main page
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Add a new task
- `PUT /api/tasks/<id>` - Update a task
- `DELETE /api/tasks/<id>` - Delete a task
- `GET /api/stats` - Get task statistics

## Technologies Used

- **Backend:** Python Flask
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** CSS Grid, Flexbox, Gradients
- **Features:** REST API, CORS support, Responsive design

## Next Steps

- Add user authentication
- Implement data persistence (database)
- Add task categories/tags
- Deploy to cloud platform

