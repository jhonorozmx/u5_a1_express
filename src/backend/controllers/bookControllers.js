import Book from "../models/bookModel.js";

// Get all books
const getAll = (req, res)=>{
  Book.getAll((books)=>{
    res.send(books)
  })
}

// Get book by guid
const getByGuid = (req, res)=>{
  const {guid} = req.params
  // Read all books
  Book.getAll((books)=>{
    // Filter by guid
    const book = books.find(item => item.guid ===guid);
    if (book){
      res.send(book)
    } else {
      res.status(404).send({
        message: 'Oops!! Book not found. :('
      });
    }
  })
}

// Create a new book in db
const createBook = (req,res)=> {
  const {body} = req
  // Create a new instance
  const newBook = new Book(body);
  // Insert in db
  newBook.insert();
  res.send({
    message: `New book: '${newBook.title}', successfully created!! :)`,
    guid: newBook.getGuid(),
  })

}

// Update an existing book in db 
const updateBook = (req,res)=>{
  //Extract the body and the params from req
  const {params:{guid},body} = req

  // Read db
  Book.getAll((books)=>{
    // Look for the book to update using its guid
    const bookToUpdate = books.find((book)=>book.guid === guid)
    if (bookToUpdate){
      // We copy the properties from body into the book we want to update
      Object.assign(bookToUpdate,body)
      Book.update(books)
      res.send({
        message: `${bookToUpdate.title} by ${bookToUpdate.author} up to date!! :D`,
        guid: `${guid}`
      })
    } else {
      res.status(404).send({
        message: "Oops! Book not found"
      })
    }
  })
}

// Delete an existing book in db
const deleteBook =(req,res)=> {
  const {guid} = req.params
  // Read db
  Book.getAll((books)=>{
    const bookIdx = books.findIndex(book=> book.guid === guid);

    if(bookIdx != -1){
      const {title, author}= books[bookIdx]
      books.splice(bookIdx, 1);
      Book.update(books);
      res.send({
        message: `${title} by ${author} successfully deleted!!`
      })
    } else {
      res.status(404).send({
        message: 'Oops!! Book not found. :('
      })
    }
  })
}

export {getAll, getByGuid, createBook, updateBook, deleteBook}