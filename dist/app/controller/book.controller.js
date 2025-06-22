"use strict";
// src/controller/book.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_models_1 = __importDefault(require("../models/book.models"));
const book_validation_1 = require("../validation/book.validation");
exports.booksRoutes = express_1.default.Router();
exports.booksRoutes.post("/books", async (req, res) => {
    try {
        const parsed = book_validation_1.bookValidationSchema.parse(req.body);
        const book = await book_models_1.default.create(parsed);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to create book",
            error: err.errors || err,
        });
    }
});
exports.booksRoutes.get("/books", async (req, res) => {
    try {
        const { filter, sortBy = "createdAt", sort = "desc", limit = "10", } = req.query;
        const query = {};
        if (filter)
            query.genre = filter;
        const books = await book_models_1.default.find(query)
            .sort({ [sortBy]: sort === "asc" ? 1 : -1 })
            .limit(parseInt(limit));
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve books",
            error: err,
        });
    }
});
exports.booksRoutes.get("/books/:bookId", async (req, res) => {
    try {
        const book = await book_models_1.default.findById(req.params.bookId);
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (err) {
        res.status(404).json({
            success: false,
            message: "Book not found",
            error: err,
        });
    }
});
exports.booksRoutes.patch("/books/:bookId", async (req, res) => {
    try {
        const parsed = book_validation_1.bookValidationSchema.partial().parse(req.body);
        const book = await book_models_1.default.findByIdAndUpdate(req.params.bookId, parsed, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to update book",
            error: err.errors || err,
        });
    }
});
exports.booksRoutes.delete("/books/:bookId", async (req, res) => {
    try {
        await book_models_1.default.findByIdAndDelete(req.params.bookId);
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to delete book",
            error: err,
        });
    }
});
