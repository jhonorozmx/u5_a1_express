import express from "express";
import dotenv from "dotenv";
import path from "path";
import { cwd } from "process";
import bookRouter from "./routes/router.js"

dotenv.config();
const app = express();

//Some constants
const PORT = process.env.PORT || 5000;
const VIEWS = path.join(cwd(), "src", "backend", "views")


app.use(express.json());

// Set view templates directory
app.set('views',VIEWS)

// Set view engine
app.set('view engine', 'pug')

// Books endpoint
app.use(bookRouter);

// Server Running
app.get("/", (req, res) => {
  res.render('hello.pug');
});

// Error in the server
app.use((err, req, res, next) => {
  if(err){
    res.status(500).send({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serve at http://localhost:${PORT}`);
})
