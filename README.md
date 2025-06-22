# 📚 Library Management API

A backend API project built using **Express**, **TypeScript**, and **MongoDB (Mongoose)** that allows users to manage library books and borrowing records.

---

## 🚀 Features

* 📘 **Book Management**: Create, Read, Update, and Delete books
* 🔍 **Filtering & Sorting**: Filter books by genre, sort by creation date
* 📥 **Borrowing System**: Borrow books with quantity tracking
* 📊 **Aggregation Summary**: Get total borrowed quantity per book
* ✅ **Schema Validation**: Strong validation using Zod and Mongoose
* ⚙️ **Mongoose Static Methods & Middleware**: Business logic for availability

---

## 🔧 Technologies Used

* **Node.js** / **Express.js**
* **TypeScript**
* **MongoDB** with **Mongoose**
* **Zod** (for request validation)
* **Dotenv** (for environment config)

---

## 🏗️ Project Structure

```
src/
├── controller/
│   ├── book.controller.ts
│   └── borrow.controller.ts
├── interface/
│   └── book.interface.ts
├── models/
│   ├── book.models.ts
│   └── borrow.models.ts
├── validation/
│   ├── book.validation.ts
│   └── borrow.validation.ts
├── app.ts
├── server.ts
```

---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/mahdihasan333/level2-assignment3
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root:

```
PORT=5000
DATABASE_URL=mongodb://localhost:27017/library-management
```

### 4. Run the project

```bash
npm run dev
```

---

## 📘 API Endpoints

### ✅ Book Routes

#### Create Book

`POST /api/books`

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "Overview of cosmology",
  "copies": 5
}
```

#### Get All Books (with filters)

`GET /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

#### Get Book by ID

`GET /api/books/:bookId`

#### Update Book

`PATCH /api/books/:bookId`

#### Delete Book

`DELETE /api/books/:bookId`

---

### 📥 Borrow Routes

#### Borrow Book

`POST /api/borrow`

```json
{
  "book": "<bookObjectId>",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

#### Borrow Summary

`GET /api/borrow`

```json
{
  "success": true,
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    }
  ]
}
```

---

## 🧠 Business Logic

* ✅ Borrow only if `copies >= quantity`
* ✅ Auto update `available = false` when copies become 0 (via middleware)
* ✅ Uses `pre('save')` middleware in Book model
* ✅ `updateAvailability` static method to update book state


