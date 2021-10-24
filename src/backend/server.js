import express from "express";
import dotenv from "dotenv";
import bookRouter from "./routes/router.js"

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

// Set view templates directory
app.set('views','./views')

// Set view engine
app.set('view engine', 'pug')

// Books endpoint
app.use(bookRouter);

// Server Running
app.get("/", (req, res) => {
  res.send("Server is ready");
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
