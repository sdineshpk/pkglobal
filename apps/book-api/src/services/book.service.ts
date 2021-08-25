import {Book} from "../models/book.model";
import { Request, Response } from "express";
import * as log4js from 'log4js';


const log = log4js.getLogger("book");

export const allBooks = (req: Request, res: Response) => {
    log.debug("Fetch All Books result started");
    try {
      Book.find((err, books) => {
        if (err) {
            log.error('Fetch All Book Result Error',err);
          res.status(404).send({message:"Book Details Not available",error:err.stack});
        } else {
        log.debug("Fetch All Books result Ended");
          res.send(books);
        }
      });
    } catch (error) {
      res.status(500).send({message:"Book Details Not available",error:error.stack});
    }
    
};
  
export const getBook = (req: Request, res: Response) => {
    log.debug("Fetch Single Book result Started");
    try{
    Book.findById(req.params.id, (err, book) => {
        if (err) {
            log.error('Fetch Single Book Result Error',err);
          res.status(404).send({message:"Book Details Not available or id value is wrong",error:err.stack});
        } else {
            log.debug("Fetch Single Book result Ended");
          res.send(book);
        }
      });
    }catch(err){
      res.status(500).send({message:"Book Details Not available",error:err.stack});
    }
};

export const deleteBook = (req: Request, res: Response) => {
    log.debug("Delete Single Book Started");
    try{
    Book.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            log.error('Delete Single Error',err);
            res.status(404).send({message:"Book Details Not available or id value is wrong",error:err.stack});
        } else {
        log.debug("Delete Single Book Ended");
          res.send({message:"Successfully Deleted Book"});
        }
      });
    }catch(err){
      res.status(500).send({message:"Book Details Not available",error:err.stack});
    }
};

export const updateBook = (req: Request, res: Response) => {
    log.debug("Update Single Book Started");
    try{
      Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        (err, book) => {
          if (err) {
              log.error('Update Book Error',err);
              res.status(400).send({message:"Book Details Not available or Request for update book details are wrong",error:err.stack});
          } else {
              log.debug("Update Single Book Ended");
            res.send({result:book});
          }
        }
      );
    }catch(err){
      res.status(500).send({message:"Request for update book details are wrong",error:err.stack});
    }
};

export const addBook = (req: Request, res: Response) => {
  log.debug("Add Book Started");
  try {
    const book = new Book(req.body);
    book.save((err) => {
      if (err) {
          log.error('Add Book Error',err);
          res.status(400).send({message:"Request for update book details are wrong",error:err.stack});
      } else {
          log.debug("Add Book Ended");
        res.send(book);
      }
    });
  } catch (err) {
    res.status(500).send({message:"Request for add book details are wrong",error:err.stack});
  }
    
}