import {Reviews,Book} from "../models/book.model";
import { Request, Response } from "express";
import * as log4js from 'log4js';

const log = log4js.getLogger("review");

export const allReviews = (req: Request, res: Response) => {
    log.debug("Fetch All Reviews result started");
    Reviews.find((err, books) => {
        if (err) {
            log.error('Fetch All Reviews Result Error',err);
          res.send("Error!");
        } else {
        log.debug("Fetch All Reviews result Ended");
          res.send(books);
        }
      });
};
  
export const getReview = (req: Request, res: Response) => {
    log.debug("Fetch Single Reviews result Started");
    Reviews.findById(req.params.review_id, (err, book) => {
        if (err) {
            log.error('Fetch Single Reviews Result Error',err);
            console.log("test",err);
          res.status(404).send({message:"Reviews Details Not available or id value is wrong"});
        } else {
            log.debug("Fetch Single Reviews result Ended");
          res.send(book);
        }
      });
};

export const deleteReview = (req: Request, res: Response) => {
    log.debug("Delete Single Book Started");
    Reviews.deleteOne({ _id: req.params.review_id }, (err) => {
        if (err) {
            log.error('Delete Single Error',err);
            res.status(404).send({message:"Reviews Details Not available or id value is wrong"});
        } else {
        log.debug("Delete Single Reviews Ended");
          res.send({message:"Successfully Deleted Reviews"});
        }
      });
};

export const updateReview = (req: Request, res: Response) => {
    log.debug("Update Single Reviews Started");
    Reviews.findByIdAndUpdate(
      req.params.review_id,
      req.body,
      (err, book) => {
        if (err) {
            log.error('Update Reviews Error',err);
            res.status(404).send({message:"Reviews Details Not available or id value is wrong"});
        } else {
            log.debug("Update Single Reviews Ended");
          res.send({result:book});
        }
      }
    );
};

export const addReview = (req: Request, res: Response) => {
    const reviews = new Reviews(req.body);
    const params=req.params;
    reviews.book=params.id;
    log.debug("Add Reviews Started");
    Book.findById(req.params.id,(err,book)=>{
        if (err) {
            log.error('Create Review Error',err);
            res.status(404).send({message:"Book Details Not available or id value is wrong"});
        } else {
            
        Reviews.create(reviews,(err) => {
            if (err) {
                log.error('Add Reviews Error',err);
              res.send(err);
            } else {
                log.debug("Update Single Reviews Ended");
              res.send(book);
            }
          });
        }
    });
  
}