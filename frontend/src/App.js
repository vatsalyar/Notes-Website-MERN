import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  // Fetch all notes
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/notes')
      .then((res) => setNotes(res.data))
      .catch((err) => console.error('Error fetching notes', err));
  }, []);

  // Handle form submit to create a new note
  const handleSubmit = (e) => {
    e.preventDefault();

    const newNote = { title, content };

    axios
      .post('http://localhost:5000/api/notes', newNote)
      .then((res) => {
        setNotes((prevNotes) => [...prevNotes, res.data]);
        setTitle('');
        setContent('');
      })
      .catch((err) => console.error('Error creating note', err));
  };

  // Handle note deletion
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error('Error deleting note', err);
    }
  };

  // Handle editing a note
  const handleEdit = (note) => {
    setEditingNote(note); // Set the note to be edited
  };

  // Handle saving an updated note
  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedNote = { title: editingNote.title, content: editingNote.content };

    axios
      .put(`http://localhost:5000/api/notes/${editingNote._id}`, updatedNote)
      .then((res) => {
        // Update the notes list
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note._id === res.data._id ? res.data : note))
        );
        setEditingNote(null); // Clear the editing state
      })
      .catch((err) => console.error('Error updating note', err));
  };

  return (
    <div>
      <h1>Notes</h1>

      {/* Form for creating a new note */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Note</button>
      </form>

      {/* Form for editing an existing note */}
      {editingNote && (
        <form onSubmit={handleUpdate}>
          <h2>Edit Note</h2>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={editingNote.title}
              onChange={(e) =>
                setEditingNote((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label>Content</label>
            <textarea
              value={editingNote.content}
              onChange={(e) =>
                setEditingNote((prev) => ({ ...prev, content: e.target.value }))
              }
              required
            />
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setEditingNote(null)}>
            Cancel
          </button>
        </form>
      )}

      <h2>All Notes</h2>
      <ul className="note-list">
        {notes.map((note) => (
          <li key={note._id}>
            <div>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </div>
            <div className="btn-group">
              <button className="edit" onClick={() => handleEdit(note)}>Edit</button>
              <button className="delete" onClick={() => deleteNote(note._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
