import * as mongoose from "mongoose";

export interface Reviews extends mongoose.Document {
    book:string,
    review_id: string;
    reviewer: Array<string>;
    message:string;
}

export interface IBook extends mongoose.Document {
    id?:string;
  name: string;
  author: Array<string>;
  price:string;
  reviews:Array<Reviews>;
  publisher:{
      publisher_id:string,
      name:string,
      location:string
  };
}

export const BookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    author:[{type:String,required:true}],
    price:{
        type:String,
        required:true
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Reviews'
    }],
    publisher:{
        publisher_id:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        }
    }
});

export const ReviewSchema = new mongoose.Schema({
    book: { type: mongoose.Types.ObjectId, ref: 'Book' }, // overriding _id with ObjectId
    review_id: {
        type:String,
        required:true
    },
    reviewer: [{type:String,required:true}],
    message:{
        type:String,
        required:true
    }
});

export const Book = mongoose.model<IBook>("Book", BookSchema);

export const Reviews = mongoose.model<Reviews>("Reviews", ReviewSchema);
