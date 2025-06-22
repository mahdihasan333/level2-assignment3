import { model, Schema } from "mongoose";
import { Genre, IBook } from "../interface/book.interface";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      required: true,
      enum: Object.values(Genre),
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: {
      type: Number,
      required: true,
      min: [0, "Copies must be a positive number"],
    },
    available: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.statics.updateAvailability = async function (bookId: string) {
  const book = await this.findById(bookId);
  if (book) {
    if (book.copies <= 0) {
      book.available = false;
      await book.save();
    }
  }
};

const Book = model<IBook>('Book', bookSchema);

export default Book;