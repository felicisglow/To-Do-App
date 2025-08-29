<!DOCTYPE html>
<html lang="en">

<body>
  <h1>Todo App</h1>
  <p>A simple Todo app with PostgreSQL, Node.js + Express + Prisma, and React (Vite). All components run using Docker Compose.</p>

  <h2>Tech Stack</h2>
  <ul>
    <li>Database: PostgreSQL</li>
    <li>Backend API: Node.js + Express + Prisma</li>
    <li>Frontend: React (Vite) – SPA</li>
    <li>Orchestration: Docker & Docker Compose</li>
  </ul>

  <h2>Features</h2>
  <ul>
    <li>Add tasks</li>
    <li>View all tasks or a single task by ID</li>
    <li>Mark tasks as done (PATCH)</li>
    <li>Delete tasks</li>
    <li>Updating or searching tasks is not implemented</li>
  </ul>

  <h2>Architecture</h2>
  <ul>
    <li>Database: task table (id, title, description, done, createdAt, updatedAt)</li>
    <li>Backend API: REST API with Node.js + Express + Prisma</li>
    <li>Frontend UI: React SPA</li>
    <li>Docker Compose: runs all containers</li>
  </ul>

  <h2>Ports</h2>
  <ul>
    <li>Backend: 8082 (host) → 8080 (container)</li>
    <li>Database: 5433 (host) → 5432 (container)</li>
  </ul>

  <h2>API Endpoints</h2>
  <ul>
    <li>GET /tasks – Get all tasks</li>
    <li>GET /tasks/:id – Get task by ID</li>
    <li>POST /tasks – Create a new task</li>
    <li>PATCH /tasks/:id – Mark task as done</li>
    <li>DELETE /tasks/:id – Delete a task</li>
  </ul>

  <h2>Running the Project</h2>
  <ol>
    <li>Clone the repository: <code>git clone &lt;your-repo-link&gt; &amp;&amp; cd &lt;repo-folder&gt;</code></li>
    <li>Create a .env file: <code>DATABASE_URL=postgresql://postgres:yourpassword@localhost:5433/tododb</code></li>
    <li>Start all services: <code>docker-compose up --build</code></li>
    <li>Access the app:
      <ul>
        <li>Backend API: <a href="http://localhost:8082">http://localhost:8082</a></li>
        <li>Frontend UI: <a href="http://localhost:5173">http://localhost:5173</a></li>
      </ul>
    </li>
  </ol>
</body>
</html>
