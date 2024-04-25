import express, { json } from "express";
import pkg from 'body-parser';
import dotenv from 'dotenv';
import cors from "cors";
import jobRouter from './routers/job.js';
import postRouter from './routers/post.js';

dotenv.config();

const { urlencoded } = pkg;

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use(jobRouter);
app.use(postRouter);


app.listen(port, () => {
  console.log("Server is running ");
});
