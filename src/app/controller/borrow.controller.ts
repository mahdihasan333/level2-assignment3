import express, { Request, Response } from "express";
import Borrow from "../models/borrow.models";
import Book from "../models/book.models";
import { borrowValidationSchema } from "../validation/borrow.validation";

export const borrowRoutes= express.Router();


// ✅ POST /borrow - Borrow a book
borrowRoutes.post("/borrow", async (req: Request, res: Response) => {
  try {
    // 1. Validate request
    const parsed = borrowValidationSchema.parse(req.body);
    const { book, quantity, dueDate } = parsed;

    // 2. Find the book
    const foundBook = await Book.findById(book);
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
    const borrow = await Borrow.create({ book, quantity, dueDate });

    // 6. Respond to client
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

// ✅ GET /borrow - Borrow Summary
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve borrow summary",
      error: err,
    });
  }
});
