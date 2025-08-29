import React, { useState , useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}



function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = () => {
    fetch(`${apiUrl}/api/tasks?status=open`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(() => setTasks([]));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${apiUrl}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        setMessage("Task created!");
        setTitle("");
        setDescription("");
        fetchTasks(); 
         setTimeout(() => setMessage(""), 2000); // Clear message after 2 seconds
      } else {
        setMessage("Failed to create task.");
      }
    } catch {
      setMessage("Error connecting to backend.");
    }
  };

  return (
    <div className="custom-center" style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
      <div className="custom-overlay">
      <section className = "custom-card" style={{ flex: 1, maxWidth: 400 }}>
      <h1 className="custom-title">Add New Task</h1>
      <form onSubmit={handleSubmit} className="custom-form">
        <div>
          <label>Title:
            <input
            className="custom-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ width: "100%" }}
          />
          </label>
          
        </div>
        <div>
          <label>Description:
            <textarea
            className="custom-textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: "100%" }}
          />
          </label>
          </div>
        <button type="submit" className="custom-btn">Add Task</button>
      </form>
      {message && <p style={{ marginTop: "1rem", color: "#000000" }}>{message}</p>}
      </section>
      <section className="custom-card" style={{ flex: 1 , maxWidth: 500}}>
        <h2 className="custom-title" style={{ fontSize: "1.5rem" }}>Open Tasks</h2>
        <ul>
          {tasks.length === 0 && <li>No open tasks.</li>}
          {tasks.map(task => (
            <li key={task.id} style={{ marginBottom: "1rem" }} 
            className={"custom-list-item"}>
              <div className="custom-list-content">
              <strong>{task.title}</strong>
              <div style={{ fontSize: "0.9em", color: "#555" }}>{task.description}</div>
              </div>
              <button
                className="custom-circle-btn"
                style={{ marginTop: "0.5rem" }}
                onClick={async () => {
                    try {
                    const res = await fetch(`${apiUrl}/api/tasks/${task.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "DONE" }),
                    });
                    if (!res.ok) {
                        console.error("Failed to update task", await res.text());
                    }
                    fetchTasks();
                    } catch (err) {
                    console.error("Error updating task", err);
                    }
                }}
                >
                
            </button>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </div>
  );
}

export default App;