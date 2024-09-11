'use client';

// Import necessary hooks from React for managing component state and side effects.
import { useState, useEffect } from 'react';

// Main functional component for the BooksPage.
export default function BooksPage() {
  // State to hold the list of books.
  const [books, setBooks] = useState([]);
  // State to manage input fields for adding a new book.
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  // Fetch all books when the component mounts.
  useEffect(() => {
    async function fetchBooks() {
      try {
        // Make a GET request to fetch the list of books from the API.
        const res = await fetch('/api/books');
        
        // Check if the response is successful; if not, throw an error.
        if (!res.ok) throw new Error('Failed to fetch books');
        
        // Parse the JSON data from the response.
        const data = await res.json();
        
        // Update the state with the fetched books.
        setBooks(data);
      } catch (error) {
        // Log any errors that occur during the fetch operation.
        console.error('Error fetching books:', error);
      }
    }
    
    // Call the fetchBooks function to load the books.
    fetchBooks();
  }, []); // Empty dependency array means this effect runs once when the component mounts.

  // Function to handle adding a new book.
  async function addBook(e: React.FormEvent) {
    e.preventDefault(); // Prevent the default form submission behavior.

    try {
      // Make a POST request to add a new book.
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON.
        },
        body: JSON.stringify({ title, author }), // Send the title and author in the request body.
      });

      // Check if the response is successful; if not, throw an error.
      if (!res.ok) throw new Error('Failed to add book');
      
      // Parse the JSON response to get the success message.
      const data = await res.json();
      
      // Display an alert with the success message.
      alert(data.message);
      
      // Clear the input fields.
      setTitle('');
      setAuthor('');
      
      // Refresh the list of books after adding a new one.
      const refreshedBooks = await fetch('/api/books');
      setBooks(await refreshedBooks.json());
    } catch (error) {
      // Log any errors that occur during the add operation.
      console.error('Error adding book:', error);
    }
  }

  // Function to handle deleting a book.
  async function deleteBook(id: string) {
    try {
      // Make a DELETE request to remove the book by its ID.
      const res = await fetch('/api/books', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON.
        },
        body: JSON.stringify({ id }), // Send the ID of the book to delete.
      });

      // Check if the response is successful; if not, throw an error.
      if (!res.ok) throw new Error('Failed to delete book');
      
      // Parse the JSON response to get the success message.
      const data = await res.json();
      
      // Display an alert with the success message.
      alert(data.message);
      
      // Refresh the list of books after deleting one.
      const refreshedBooks = await fetch('/api/books');
      setBooks(await refreshedBooks.json());
    } catch (error) {
      // Log any errors that occur during the delete operation.
      console.error('Error deleting book:', error);
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header for the Books page */}
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Books</h1>

      {/* Form to add new books */}
      <form onSubmit={addBook} className="mb-6 max-w-md mx-auto bg-white p-4 rounded-lg shadow-lg">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
          Add Book
        </button>
      </form>

      {/* Display the list of books */}
      <ul className="max-w-md mx-auto text-black bg-white p-4 rounded-lg shadow-lg">
        {books.map((book: any) => (
          <li key={book._id} className="flex justify-between items-center mb-2 p-2 border-b border-gray-300">
            <span>{book.title} by {book.author}</span>
            <button
              onClick={() => deleteBook(book._id)}
              className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
