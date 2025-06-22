import express, {Application, Request, Response} from 'express'
import { booksRoutes } from './app/controller/book.controller';


const app: Application = express();

app.use(express.json())

app.use('/api', booksRoutes)


app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Book App')
})

export default app;