"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookValidationSchema = void 0;
const zod_1 = require("zod");
exports.bookValidationSchema = zod_1.z.object({
    title: zod_1.z.string({ required_error: 'Title is required' }),
    author: zod_1.z.string({ required_error: 'Author is required' }),
    genre: zod_1.z.enum([
        'FICTION',
        'NON_FICTION',
        'SCIENCE',
        'HISTORY',
        'BIOGRAPHY',
        'FANTASY',
    ], {
        required_error: 'Genre is required',
        invalid_type_error: 'Invalid genre value'
    }),
    isbn: zod_1.z.string({ required_error: 'ISBN is required' }),
    description: zod_1.z.string().optional(),
    copies: zod_1.z
        .number({ required_error: 'Copies is required' })
        .min(0, 'Copies must be a positive number'),
    available: zod_1.z.boolean().optional(),
});
