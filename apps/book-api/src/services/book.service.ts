import {Book} from "../models/book.model";
import { Request, Response } from "express";
import * as log4js from 'log4js';
import {writeLogError} from '../services/common.service'

const log = log4js.getLogger("info");

export const allBooks = (req: Request, res: Response) => {
    log.info("Fetch All Books result started");
    try {
      Book.find((err, books) => {
        if (err) {
          writeLogError(log,err);
          res.status(404).send({message:"Book Details Not available"});
        } else {
        log.debug("Fetch All Books result Ended");
          res.send(books);
        }
      });
    } catch (error) {
      writeLogError(log,error);
      res.status(500).send({message:"Book Details Not available"});
    }
    
};
  
export const getBook = (req: Request, res: Response) => {
    log.debug("Fetch Single Book result Started");
    try{
    Book.findById(req.params.id, (err, book) => {
        if (err) {
          writeLogError(log,err);
          res.status(404).send({message:"Book Details Not available or id value is wrong"});
        } else {
            log.debug("Fetch Single Book result Ended");
          res.send(book);
        }
      });
    }catch(err){
      writeLogError(log,err);
      res.status(500).send({message:"Book Details Not available"});
    }
};

export const deleteBook = (req: Request, res: Response) => {
    log.debug("Delete Single Book Started");
    try{
    Book.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
          writeLogError(log,err);
            res.status(404).send({message:"Book Details Not available or id value is wrong"});
        } else {
        log.debug("Delete Single Book Ended");
          res.send({message:"Successfully Deleted Book"});
        }
      });
    }catch(err){
      writeLogError(log,err);
      res.status(500).send({message:"Book Details Not available"});
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
            writeLogError(log,err);
              res.status(400).send({message:"Book Details Not available or Request for update book details are wrong"});
          } else {
              log.debug("Update Single Book Ended");
            res.send({result:book});
          }
        }
      );
    }catch(err){
      writeLogError(log,err);
      res.status(500).send({message:"Request for update book details are wrong"});
    }
};

export const addBook = (req: Request, res: Response) => {
  log.debug("Add Book Started");
  try {
    const book = new Book(req.body);
    book.save((err) => {
      if (err) {
        writeLogError(log,err);
          res.status(400).send({message:"Request for update book details are wrong"});
      } else {
          log.debug("Add Book Ended");
        res.send(book);
      }
    });
  } catch (err) {
    writeLogError(log,err);
    res.status(500).send({message:"Request for add book details are wrong"});
  }
    
}