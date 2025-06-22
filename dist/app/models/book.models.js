"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const book_interface_1 = require("../interface/book.interface");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
        type: String,
        required: true,
        enum: Object.values(book_interface_1.Genre),
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: {
        type: Number,
        required: true,
        min: [0, "Copies must be a positive number"],
    },
    available: { type: Boolean, default: true },
}, {
    versionKey: false,
    timestamps: true,
});
bookSchema.pre("save", function (next) {
    this.available = this.copies > 0;
    next();
});
bookSchema.statics.updateAvailability = async function (bookId) {
    const book = await this.findById(bookId);
    if (book) {
        book.available = book.copies > 0;
        await book.save();
    }
};
const Book = (0, mongoose_1.model)("Book", bookSchema);
exports.default = Book;
