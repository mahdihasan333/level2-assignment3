import { Schema, model, Types } from 'mongoose';

interface IBorrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

const borrowSchema = new Schema<IBorrow>(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Borrow = model<IBorrow>('Borrow', borrowSchema);

export default Borrow;
