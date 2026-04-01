"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import { BookService } from "@/services/api";
import toast from "react-hot-toast";
import { Trash2, CheckCircle, Circle, Search, PlusCircle, BookMarked } from "lucide-react";

export default function Home() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    const fetchBooks = async (query = "") => {
        try {
            setLoading(true);
            const data = await BookService.getBooks(query);
            setBooks(data);
        } catch (error) {
            toast.error("Failed to load books from server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchBooks(search);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleAddBook = async (e) => {
        e.preventDefault();
        if (!title || !author) return toast.error("Title and Author are required!");
        
        try {
            await BookService.addBook(title, author);
            toast.success("Book added successfully!");
            setTitle("");
            setAuthor("");
            fetchBooks(); 
        } catch (error) {
            toast.error("Failed to add book.");
        }
    };

    const handleToggleRead = async (book) => {
        try {
            const newStatus = !book.is_read;
            await BookService.toggleReadStatus(book.id, newStatus);
            toast.success(newStatus ? "Marked as read!" : "Marked as unread.");
            setBooks(books.map(b => b.id === book.id ? { ...b, is_read: newStatus } : b));
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this book?")) return;
        try {
            await BookService.deleteBook(id);
            toast.success("Book deleted.");
            setBooks(books.filter(b => b.id !== id)); 
        } catch (error) {
            toast.error("Failed to delete book.");
        }
    };

    return (
        <div className="min-h-screen pb-20 selection:bg-primary/20 selection:text-primary">
            <Hero />

            <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-3 gap-10">
                
                {/* LEFT COLUMN: Add Form */}
                <div className="lg:col-span-1">
                    <div className="bg-card border border-border p-8 rounded-3xl shadow-xl sticky top-28 transition-colors">
                        <h2 className="text-2xl font-extrabold text-foreground mb-6 flex items-center gap-3">
                            <PlusCircle className="text-primary" size={26} />
                            Add New Book
                        </h2>
                        <form onSubmit={handleAddBook} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wide">Book Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Atomic Habits"
                                    className="w-full p-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wide">Author Name</label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="e.g. James Clear"
                                    className="w-full p-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-black text-lg py-4 rounded-xl shadow-lg shadow-primary/30 transform hover:-translate-y-1 transition-all duration-200"
                            >
                                Save to Library
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN: Search & List */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Search Bar */}
                    <div className="relative group">
                        <Search className="absolute left-5 top-4 text-muted-foreground group-focus-within:text-primary transition-colors" size={24} />
                        <input
                            type="text"
                            placeholder="Search your library..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-14 p-4 text-lg rounded-2xl border border-border bg-card text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Book List */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : books.length === 0 ? (
                        <div className="text-center py-20 bg-card border border-border rounded-3xl shadow-sm">
                            <BookMarked className="mx-auto text-muted-foreground/50 mb-4" size={64} />
                            <p className="text-2xl font-bold text-foreground mb-2">Your library is empty.</p>
                            <p className="text-muted-foreground text-lg">Add your first book to begin tracking.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {books.map((book) => (
                                <div key={book.id} className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md hover:border-primary/50 transition-all duration-300 group">
                                    <div className="flex-1 pr-6">
                                        <h3 className={`font-black text-xl mb-1 transition-all ${book.is_read ? 'text-muted-foreground line-through opacity-70' : 'text-foreground'}`}>
                                            {book.title}
                                        </h3>
                                        <p className="text-muted-foreground font-medium tracking-wide">{book.author}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        {/* Status Toggle Button */}
                                        <button 
                                            onClick={() => handleToggleRead(book)}
                                            className={`p-3 rounded-xl transition-all transform hover:scale-110 shadow-sm ${book.is_read ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary'}`}
                                            title={book.is_read ? "Mark as unread" : "Mark as read"}
                                        >
                                            {book.is_read ? <CheckCircle size={26} /> : <Circle size={26} />}
                                        </button>
                                        
                                        {/* Delete Button - NOW ALWAYS VISIBLE */}
                                        <button 
                                            onClick={() => handleDelete(book.id)}
                                            className="p-3 text-red-500/70 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-all transform hover:scale-110"
                                            title="Delete Book"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}