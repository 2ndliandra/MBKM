import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', authRouter)

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
})