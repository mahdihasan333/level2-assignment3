import express, { Request, Response } from 'express';
import Book from '../models/book.models';

export const booksRoutes = express.Router()


booksRoutes.post('/create-book', async (req: Request, res: Response) => {
    const body = req.body;

    const book = await Book.create(body)
    res.status(201).json({
        success: true,
        message: 'Book created successfully',
        book
    })
})

booksRoutes.get('/', async (req: Request, res: Response) => {
    const books = await Book.find()

    res.status(201).json({
        success: true,
        message: 'Books retrieved successfully',
        books
    })
})

booksRoutes.get('/:bookId', async (req: Request, res: Response) => {
    const bookId = req.params.bookId
    const book = await Book.findById(bookId)

    res.status(201).json({
        success: true,
        message: 'Book retrieved successfully',
        book
    })
})

booksRoutes.patch('/:bookId', async (req: Request, res: Response) => {
    const bookId = req.params.bookId
    const updatedBody = req.body;
    const book = await Book.findByIdAndUpdate(bookId, updatedBody, {new: true})

    res.status(201).json({
        success: true,
        message: 'Book updated successfully',
        book
    })
})

booksRoutes.delete('/:bookId', async (req: Request, res: Response) => {
    const bookId = req.params.bookId
    const book = await Book.findByIdAndDelete(bookId)


    res.status(201).json({
        success: true,
        message: 'Book deleted successfully',
        book
    })
})