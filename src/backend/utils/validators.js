import { body as checkBody, validationResult } from "express-validator";
import Book from "../models/bookModel.js";

// Custom sanitizer to trim and remove extra spaces from req.body.title and req.body.author
const custom = (inputValue) => inputValue.toString().trim().replace(/\s+/g, " ");

const validateInputs = async (req, res, next) => {
  // Validate Book Title input
  await checkBody("title")
    .notEmpty()
    .withMessage("Book Title is missing")
    .bail()
    .customSanitizer(custom)
    .isAlphanumeric("en-US", { ignore: /[,.&'\s]/g })
    .withMessage("Title can't include symbols")
    .run(req);

  // Validate Book Author input
  await checkBody("author")
    .notEmpty()
    .withMessage("Book Author is missing")
    .bail()
    .customSanitizer(custom)
    .isAlpha("en-US", { ignore: /[,.&'\s]/g })
    .withMessage("Author name can't include symbols or numbers")
    .run(req);

  // Validate Publication year input
  await checkBody("year")
    .trim()
    .notEmpty()
    .withMessage("Publication year is missing")
    .bail()
    .isNumeric()
    .withMessage("Year must include numbers only!")
    .bail()
    .isInt({ min: 1455, max: new Date().getFullYear() })
    .withMessage("Year must be a valid year between 1455 and current year")
    .toInt()
    .run(req);

  const result = validationResult(req);

  const formatter = (obj) => {
    const { errors } = obj;
    const err = new Map();

    for (const [i, error] of errors.entries()) {
      err.set(`ErrorNo${i + 1}`, error.msg);
    }
    return Object.fromEntries(err);
  };

  if (!result.isEmpty()) {
    const errors = formatter(result);
    return res.status(400).send(errors);
  }
  next();
};

const validateRecords = (req, res, next) => {
  const { title, author, year } = req.body;
  const { guid } = req.params;

  Book.getAll((books) => {
    const exists = books.find((book) => {
      return (
        book.title.toLowerCase() === title.toLowerCase() &&
        book.author.toLowerCase() === author.toLowerCase() &&
        book.year === year
      );
    });

    if (exists && req.method === "POST") {
      return res
        .status(409)
        .send({ message: `${title} by ${author} (${year}) already exists!` });
    }

    if (exists && req.method === "PUT" && exists.guid != guid) {
      return res
        .status(409)
        .send({ message: `${title} by ${author} (${year}) already exists!` });
    } 
      
    next();
  });
};

export { validateInputs, validateRecords };
