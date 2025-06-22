import express, { Request, Response } from "express";
import Borrow from "../models/borrow.models";
import Book from "../models/book.models";
import { borrowValidationSchema } from "../validation/borrow.validation";

export const borrowRoutes = express.Router();

// ✅ Borrow a Book (POST)
borrowRoutes.post("/borrow", async (req: Request, res: Response) => {
  try {
    const parsed = borrowValidationSchema.parse(req.body);
    const { book, quantity, dueDate } = parsed;

    // 1. Find book
    const foundBook = await Book.findById(book);
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
    await foundBook.save();

    // 4. Create borrow record
    const borrow = await Borrow.create({
      book,
      quantity,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: "Borrow failed",
      error: err.errors || err.message || err,
    });
  }
});

// ✅ Borrow Summary (GET)
borrowRoutes.get("/borrow", async (req: Request, res: Response) => {
  try {
    const borrowSummary = await Borrow.aggregate([
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve borrowed books summary",
      error: err,
    });
  }
});
