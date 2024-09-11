// src/models/Book.ts
import mongoose, { Schema, model, models } from 'mongoose';

// Define the Book schema
const bookSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
  },
});

// Check if the model exists to avoid overwrite issues during development
const Book = models.Book || model('Book', bookSchema);

export default Book;
