import React, { useState, useEffect } from 'react';
import { FiTrash2, FiSun } from 'react-icons/fi'; // Icons from your new design
import './Dashboard.css'; // We will use a new CSS file for this design

// --- Backend Connection Setup ---
const API_URL = 'http://localhost:8000' || '';

const Dashboard = () => {
  // --- STATE MANAGEMENT (from our logic) ---
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  // --- DATA FETCHING (from our logic) ---
  useEffect(() => {
    if (!token) {
      handleSignOut(); // Redirect if no token is found
      return;
    }

    const fetchData = async () => {
      try {
        const [userResponse, notesResponse] = await Promise.all([
          fetch(`${API_URL}/api/auth/profile`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/api/notes`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!userResponse.ok || !notesResponse.ok) {
          throw new Error('Failed to fetch data. Please log in again.');
        }

        const userData = await userResponse.json();
        const notesData = await notesResponse.json();
        setUser(userData.user);
        setNotes(notesData);
      } catch (err) {
        setError(err.message);
        setTimeout(handleSignOut, 3000); // Sign out on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // --- EVENT HANDLERS (from our logic) ---
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: newNoteTitle }),
      });
      if (!response.ok) throw new Error('Could not create note.');

      const createdNote = await response.json();
      setNotes([createdNote, ...notes]);
      setNewNoteTitle('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Could not delete note.');
      
      setNotes(notes.filter(note => note._id !== noteId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  
  // --- Loading and Error States ---
  if (loading) return <div className="status-message">Loading Dashboard...</div>;
  if (error) return <div className="status-message error">{error}</div>;

  // --- RENDER (your new design with logic integrated) ---
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-nav">
          <div className="nav-left">
            <FiSun className="dashboard-icon" />
            <span className="dashboard-title">Dashboard</span>
          </div>
          <button className="sign-out-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          {/* Using dynamic user data */}
          <h2>Welcome, {user?.firstName || 'User'}!</h2>
          <p className="user-email">Email: {user?.email}</p>
        </div>

        {/* Replaced the button with the functional form */}
        <form onSubmit={handleCreateNote} className="create-note-form">
          <input
            className="create-note-input"
            type="text"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Create a new note..."
          />
          <button className="create-note-btn" type="submit">
            Create Note
          </button>
        </form>

        <div className="notes-section">
          <h3>Notes</h3>
          <div className="notes-list">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note._id} className="note-item">
                  <span className="note-title">{note.title}</span>
                  <button
                    className="delete-note-btn"
                    onClick={() => handleDeleteNote(note._id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))
            ) : (
              <p className="no-notes-message">You have no notes yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
