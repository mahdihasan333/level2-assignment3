// src/controller/book.controller.ts

import express, { Request, Response } from "express";
import Book from "../models/book.models";
import { bookValidationSchema } from "../validation/book.validation";

export const booksRoutes = express.Router();

booksRoutes.post("/books", async (req: Request, res: Response) => {
  try {
    const parsed = bookValidationSchema.parse(req.body);
    const book = await Book.create(parsed);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: "Failed to create book",
      error: err.errors || err,
    });
  }
});

booksRoutes.get("/books", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
    } = req.query;

    const query: any = {};
    if (filter) query.genre = filter;

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === "asc" ? 1 : -1 })
      .limit(parseInt(limit as string));

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve books",
      error: err,
    });
  }
});

booksRoutes.get("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.bookId);
    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Book not found",
      error: err,
    });
  }
});

booksRoutes.patch("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const parsed = bookValidationSchema.partial().parse(req.body);
    const book = await Book.findByIdAndUpdate(req.params.bookId, parsed, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: "Failed to update book",
      error: err.errors || err,
    });
  }
});

booksRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  try {
    await Book.findByIdAndDelete(req.params.bookId);
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to delete book",
      error: err,
    });
  }
});
