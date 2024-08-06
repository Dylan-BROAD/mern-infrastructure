import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./NotePage.css"; // Import the CSS file

export default function NotePage({ user }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const token = localStorage.getItem("token");

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch("/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      setFetchError(error.message);
    }
  }, [token]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (e) => {
    e.preventDefault();

    if (text.trim() === "") {
      setError("Note text cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const newNote = await response.json();

      if (!newNote.createdAt) {
        newNote.createdAt = new Date().toISOString();
      }

      setNotes((prevNotes) => [...prevNotes, newNote]);
      setText("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedNotes = notes.sort((a, b) => {
    return sortOrder === "asc"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="note-page-container">
      <h1>Notes Page For {user.name}</h1>

      <form onSubmit={addNote} className="note-form">
        <label htmlFor="prompt">
          <h2>Add Note:</h2>
        </label>
        <div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            id="text"
            placeholder="Add note..."
            required
            className="note-input"
          />
        </div>
        <button type="submit" disabled={loading} className="note-button">
          Add Note
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      <h2>Previous Notes:</h2>

      <button onClick={toggleSortOrder} className="note-button">
        Sort ({sortOrder === "asc" ? "Ascending" : "Descending"})
      </button>
      {sortedNotes.length > 0 ? (
        <ul className="note-list">
          {sortedNotes.map((note) => (
            <li key={note._id} className="note-list-item">
              {note.text} - {new Date(note.createdAt).toLocaleString()}
              <button
                onClick={() => deleteNote(note._id)}
                className="note-button"
              >
                DELETE
              </button>
              <Link to={`/note/${note._id}`}>
                <button className="note-button">EDIT</button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes yet</p>
      )}
    </div>
  );
}
