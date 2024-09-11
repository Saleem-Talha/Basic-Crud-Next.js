// Import the necessary modules from Next.js and the local project.
// `NextResponse` is used to return JSON responses from the API.
// `connectToDatabase` is a helper function that establishes a connection to the MongoDB database.
// `Book` is the Mongoose model that represents the "Book" schema in the database.
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Book from '@/models/Book';

// GET: Fetch all books from the database.
export async function GET() {
  try {
    // Connect to the MongoDB database.
    await connectToDatabase();

    // Retrieve all books from the database by using the Mongoose `find()` method.
    const books = await Book.find({});

    // Return the list of books as a JSON response.
    return NextResponse.json(books);
  } catch (error) {
    // In case of any error during the process, log it and return a 500 status with an error message.
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

// POST: Add a new book to the database.
export async function POST(req: Request) {
  try {
    // Extract the title and author fields from the request body.
    const { title, author } = await req.json();

    // Connect to the MongoDB database.
    await connectToDatabase();

    // Create a new instance of the Book model with the provided title and author.
    const newBook = new Book({ title, author });

    // Save the new book to the database.
    await newBook.save();

    // Return a success message as a JSON response.
    return NextResponse.json({ message: 'Book added successfully!' });
  } catch (error) {
    // If an error occurs during the process, log it and return a 500 status with an error message.
    console.error('Error adding book:', error);
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}

// DELETE: Remove a book from the database by its ID.
export async function DELETE(req: Request) {
  try {
    // Extract the book ID from the request body.
    const { id } = await req.json();

    // Connect to the MongoDB database.
    await connectToDatabase();

    // Use the Mongoose `findByIdAndDelete()` method to delete the book with the given ID.
    await Book.findByIdAndDelete(id);

    // Return a success message indicating the book has been deleted.
    return NextResponse.json({ message: 'Book deleted successfully!' });
  } catch (error) {
    // If an error occurs during the deletion, log it and return a 500 status with an error message.
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
