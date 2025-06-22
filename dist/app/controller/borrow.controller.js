"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
// ✅ Borrow a Book (POST)
exports.borrowRoutes.post("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = borrow_validation_1.borrowValidationSchema.parse(req.body);
        const { book, quantity, dueDate } = parsed;
        // 1. Find book
        const foundBook = yield book_models_1.default.findById(book);
        if (!foundBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
                error: `No book with ID ${book}`,
            });
        }
        // 2. Check if enough copies
        if (foundBook.copies < quantity) {
            return res.status(400).json({
                success: false,
                message: "Not enough copies available",
                error: `Only ${foundBook.copies} copies left`,
            });
        }
        // 3. Deduct copies
        foundBook.copies -= quantity;
        // availability handled by pre-save middleware (optional fallback below)
        if (foundBook.copies === 0) {
            foundBook.available = false;
        }
        yield foundBook.save();
        // 4. Create borrow record
        const borrow = yield borrow_models_1.default.create({
            book,
            quantity,
            dueDate,
        });
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
}));
// ✅ Borrow Summary (GET)
exports.borrowRoutes.get("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowSummary = yield borrow_models_1.default.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            {
                $unwind: {
                    path: "$bookDetails",
                    preserveNullAndEmptyArrays: false,
                },
            },
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
            message: "Failed to retrieve borrowed books summary",
            error: err,
        });
    }
}));
