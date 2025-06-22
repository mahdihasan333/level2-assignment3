"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowValidationSchema = void 0;
const zod_1 = require("zod");
exports.borrowValidationSchema = zod_1.z.object({
    book: zod_1.z.string({ required_error: 'Book ID is required' }),
    quantity: zod_1.z.number({ required_error: 'Quantity is required' }).min(1, 'Quantity must be at least 1'),
    dueDate: zod_1.z.string({ required_error: 'Due date is required' }).refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
});
