import express from "express";
import bookResources from "../resources/bookResources.js";


const bookRouter = express.Router();
bookRouter.use("/books", bookResources);
export default bookRouter;