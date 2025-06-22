"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_models_1 = __importDefault(require("../models/borrow.models"));
const book_models_1 = __importDefault(require("../models/book.models"));
const borrow_validation_1 = require("../validation/borrow.validation");
exports.borrowRoutes = express_1.default.Router();
// ✅ POST /borrow - Borrow a book
exports.borrowRoutes.post("/borrow", async (req, res) => {
    try {
        // 1. Validate request
        const parsed = borrow_validation_1.borrowValidationSchema.parse(req.body);
        const { book, quantity, dueDate } = parsed;
        // 2. Find the book
        const foundBook = await book_models_1.default.findById(book);
        if (!foundBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
                error: `No book with ID ${book}`,
            });
        }
        // 3. Check availability
        if (foundBook.copies < quantity) {
            return res.status(400).json({
                success: false,
                message: "Not enough copies available",
                error: `Only ${foundBook.copies} copies left`,
            });
        }
        // 4. Deduct copies
        foundBook.copies -= quantity;
        if (foundBook.copies === 0) {
            foundBook.available = false;
        }
        await foundBook.save(); // pre-save middleware will update 'available' too
        // 5. Create borrow record
        const borrow = await borrow_models_1.default.create({ book, quantity, dueDate });
        // 6. Respond to client
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Borrow failed",
            error: err.errors || err.message || err,
        });
    }
});
// ✅ GET /borrow - Borrow Summary
exports.borrowRoutes.get("/borrow", async (req, res) => {
    try {
        const borrowSummary = await borrow_models_1.default.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            { $unwind: "$bookDetails" },
            {
                $group: {
                    _id: "$book",
                    book: { $first: "$bookDetails" },
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $project: {
                    totalQuantity: 1,
                    book: {
                        title: "$book.title",
                        isbn: "$book.isbn",
                    },
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: borrowSummary,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve borrow summary",
            error: err,
        });
    }
});
