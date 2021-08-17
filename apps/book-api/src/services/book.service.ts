import {Book} from "../models/book.model";
import { Request, Response } from "express";
import * as log4js from 'log4js';

const log = log4js.getLogger("book");

export const allBooks = (req: Request, res: Response) => {
    log.debug("Fetch All Books result started");
    Book.find((err, books) => {
        if (err) {
            log.error('Fetch All Book Result Error',err);
          res.send("Error!");
        } else {
        log.debug("Fetch All Books result Ended");
          res.send(books);
        }
      });
};
  
export const getBook = (req: Request, res: Response) => {
    log.debug("Fetch Single Book result Started");
    Book.findById(req.params.id, (err, book) => {
        if (err) {
            log.error('Fetch Single Book Result Error',err);
            console.log("test",err);
          res.status(404).send({message:"Book Details Not available or id value is wrong"});
        } else {
            log.debug("Fetch Single Book result Ended");
          res.send(book);
        }
      });
};

export const deleteBook = (req: Request, res: Response) => {
    log.debug("Delete Single Book Started");
    Book.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            log.error('Delete Single Error',err);
            res.status(404).send({message:"Book Details Not available or id value is wrong"});
        } else {
        log.debug("Delete Single Book Ended");
          res.send({message:"Successfully Deleted Book"});
        }
      });
};

export const updateBook = (req: Request, res: Response) => {
    log.debug("Update Single Book Started");
    Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      (err, book) => {
        if (err) {
            log.error('Update Book Error',err);
          res.send(err);
        } else {
            log.debug("Update Single Book Ended");
          res.send({result:book});
        }
      }
    );
};

export const addBook = (req: Request, res: Response) => {
    const book = new Book(req.body);
    log.debug("Add Book Started");
  book.save((err) => {
    if (err) {
        log.error('Add Book Error',err);
      res.send(err);
    } else {
        log.debug("Add Book Ended");
      res.send(book);
    }
  });
}