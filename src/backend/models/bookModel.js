import { readFile, writeFile } from "fs";
import path from "path";
import { cwd } from "process";
import { v4 as newGuid } from "uuid";

// Path to Books.json
export const PATH = path.join(cwd(), "src", "backend", "data", "books.json");

export default class Book {
  constructor(data) {
    const { title, author, year } = data;
    this.guid = newGuid();
    this.title = title;
    this.author = author;
    this.year = year;
  }

  // RETURN BOOK GUUID
  getGuid() {
    return this.guid;
  }

  // INSERT A NEW BOOK
  insert() {
    readFile(PATH, (err, data) => {
      let books = [];
      if (!err) {
        books = JSON.parse(data);
      }
      books.push(this);
      writeFile(PATH, JSON.stringify(books),(err)=>console.error(err));
    });
  }

  // UPDATE DATA
  static update(books) {
    writeFile(PATH, JSON.stringify(books),(err)=>console.error(err));
  }

  // FETCH ALL DATA
  static getAll(cb) {
    readFile(PATH, (err, data) => {
      let books = [];
      if (!err) {
        books = JSON.parse(data);
      }
      cb(books);
    });
  }

}
