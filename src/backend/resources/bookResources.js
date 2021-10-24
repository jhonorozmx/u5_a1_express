import express from "express"
import { createBook, deleteBook, getAll, getByGuid, updateBook } from "../controllers/bookControllers.js"
import { validateInputs, validateRecords } from "../utils/validators.js";

const bookResources = express.Router();

bookResources.get('/', getAll)
bookResources.post('/', validateInputs, validateRecords, createBook)
bookResources.get('/:guid', getByGuid)
bookResources.put('/:guid',validateRecords, validateRecords,updateBook)
bookResources.delete('/:guid', deleteBook)

export default bookResources;