// backend/models/Note.js

import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This creates the link to the User model
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Note = mongoose.model('Note', NoteSchema);

export default Note;