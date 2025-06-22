"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
let server;
const PORT = process.env.PORT || 5000;
async function main() {
    try {
        await mongoose_1.default.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB Using Mongoose!');
        server = app_1.default.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}
main();
