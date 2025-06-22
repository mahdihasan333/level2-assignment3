import express, { Request, Response } from 'express';
import Borrow from '../models/borrow.models';
import { borrowValidationSchema } from '../validation/borrow.validation';
import { z } from 'zod';
import Book from '../models/book.models';

export const borrowRoutes = express.Router();

// Borrow a Book
borrowRoutes.post("/borrow", async (req: Request, res: Response) => {
  try {
    // Validate input
    const parsed = borrowValidationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: parsed.error.errors,
      });
    }

    const { book, quantity, dueDate } = parsed.data;

    // Check if the book exists and has enough copies
    const bookRecord = await Book.findById(book);
    if (!bookRecord) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (bookRecord.copies < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough copies available',
      });
    }

    // Create borrow record
    const borrowRecord = await Borrow.create({
      book,
      quantity,
      dueDate: new Date(dueDate),
    });

    // Deduct the quantity from the book
    bookRecord.copies -= quantity;
    await bookRecord.save();

    // If copies become 0, mark the book as unavailable
    if (bookRecord.copies <= 0) {
      bookRecord.available = false;
      await bookRecord.save();
    }

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrowRecord,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Failed to borrow book',
      error: err,
    });
  }
});
