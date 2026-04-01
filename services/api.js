import axios from 'axios';

// Use the env variable, fallback to localhost for safety
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/books';

export const BookService = {
    // Fetch all books (with optional search)
    getBooks: async (searchQuery = '') => {
        const url = searchQuery ? `${API_URL}?search=${searchQuery}` : API_URL;
        const response = await axios.get(url);
        return response.data.data; // Backend returns { success, data, message }
    },

    // Add a new book
    addBook: async (title, author) => {
        const response = await axios.post(API_URL, { title, author });
        return response.data.data;
    },

    // Update read status
    toggleReadStatus: async (id, is_read) => {
        await axios.put(`${API_URL}/${id}`, { is_read });
    },

    // Delete a book
    deleteBook: async (id) => {
        await axios.delete(`${API_URL}/${id}`);
    }
};