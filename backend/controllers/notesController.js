// backend/controllers/notesController.js

import Note from '../models/Note.js';

// @desc    Get all notes for a logged-in user
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req, res) => {
  try {
    // req.user.userId is added by the authenticate middleware
    const notes = await Note.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req, res) => {
  try {
	 console.log("Request Body:", req.body); 
    console.log("Authenticated User ID:", req.user.userId);
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = new Note({
      title,
      user: req.user._id,
    });

    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // IMPORTANT: Check if the note belongs to the user trying to delete it
    if (note.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await note.deleteOne();
    res.status(200).json({ message: 'Note removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};