// backend/routes/notesRoutes.js

import express from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/notesController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// All routes here are protected and require a valid token
router.use(authenticate);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .delete(deleteNote);

export default router;