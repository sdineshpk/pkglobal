import {Reviews,Book} from "../models/book.model";
import { Request, Response } from "express";
import * as log4js from 'log4js';

const log = log4js.getLogger("review");

export const allReviews = (req: Request, res: Response) => {
    log.debug("Fetch All Reviews result started");
    try{
      Reviews.find((err, reviews) => {
          if (err) {
              log.error('Fetch All Reviews Result Error',err);
              res.status(404).send({message:"Reviews Details Not available",error:err.stack});
          } else {
          log.debug("Fetch All Reviews result Ended");
            res.send(reviews);
          }
        });
    }catch(err){
      res.status(500).send({message:"Reviews Details Not available",error:err.stack});
    }
};
  
export const getReview = (req: Request, res: Response) => {
    log.debug("Fetch Single Reviews result Started");
    try{
      Reviews.findById(req.params.review_id, (err, review) => {
          if (err) {
              log.error('Fetch Single Reviews Result Error',err);
            res.status(404).send({message:"Reviews Details Not available or id value is wrong",error:err.stack});
          } else {
              log.debug("Fetch Single Reviews result Ended");
            res.send(review);
          }
        });
    }catch(err){
      res.status(500).send({message:"Reviews Details Not available",error:err.stack});
    }
};

export const deleteReview = (req: Request, res: Response) => {
    log.debug("Delete Single Book Started");
    try{
      Reviews.deleteOne({ _id: req.params.review_id }, (err) => {
          if (err) {
              log.error('Delete Single Error',err);
              res.status(404).send({message:"Reviews Details Not available or id value is wrong",error:err.stack});
          } else {
          log.debug("Delete Single Reviews Ended");
            res.send({message:"Successfully Deleted Reviews"});
          }
        });
    }catch(err){
      res.status(500).send({message:"Reviews Details Not available",error:err.stack});
    }
};

export const updateReview = (req: Request, res: Response) => {
    log.debug("Update Single Reviews Started");
    try{
      Reviews.findByIdAndUpdate(
        req.params.review_id,
        req.body,
        (err, review) => {
          if (err) {
              log.error('Update Reviews Error',err);
              res.status(400).send({message:"Input are wrong for update Reviews Details",error:err.stack});
          } else {
              log.debug("Update Single Reviews Ended");
            res.send({result:review});
          }
        }
      );
    }catch(err){
      res.status(500).send({message:"Reviews Details Not available",error:err.stack});
    }
};

export const addReview = (req: Request, res: Response) => {
  try{
    const reviews = new Reviews(req.body);
    const params=req.params;
    reviews.book=params.id;
    log.debug("Add Reviews Started");
    Book.findById(params.id,(err)=>{
        if (err) {
            log.error('Create Review Error',err);
            res.status(404).send({message:"Book Details Not available or id value is wrong"});
        } else {
            
        Reviews.create(reviews,(err,review) => {
            if (err) {
                log.error('Add Reviews Error',err);
                res.status(400).send({message:"Input are wrong for add Reviews Details",error:err.stack});
            } else {
                log.debug("Update Single Reviews Ended");
              res.send(review);
            }
          });
        }
    });
  }catch(err){
    res.status(500).send({message:"Reviews Details Not available or Inputs are invalid",error:err.stack});
  }
  
}