import * as request from 'supertest';
import {app} from '../main';
import { Book , Reviews} from '../models/book.model';
import {connect} from './db'
import { book, booksList, review } from '../tests/mock-data/mock-data';

describe('test book api', () => {
    jest.setTimeout(80000);
    const authToken =
        "Bearer eyJraWQiOiJiNkY1eWJKMzF3bkcyVzgtQkMyeXozeVhUSTUtWGFKOHBCcElSSk5LRTB3IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULmVLcXdlaHlNQ1JoQTNaTXluanh5cG9LZ2JiZFdncExzZzZhOG5lc2VRQkkiLCJpc3MiOiJodHRwczovL2Rldi04ODI3MzY2NC5va3RhLmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2MzE1MTg5NzEsImV4cCI6MTYzMTUyMjU3MSwiY2lkIjoiMG9hMWgwdWxqY0o1RmhRTWQ1ZDciLCJzY3AiOlsiYm9va3Njb3BlIl0sInN1YiI6IjBvYTFoMHVsamNKNUZoUU1kNWQ3In0.ddRphxWdCMSwiYVpz91-ZyrN72ueQdkEf72DBk4QlAqmdO-GBVcEAULZn6ePO2Q1awhHTJpeEDgplwqgbqC3l6woCJYbv6ub1oGGZEYe4CxpixybiCOcSetqfBStQtCYSdDny2GCCeEFxtJvei3UTxojqoRskfV31tOwkvp-lYXShTdOZGN4SQiIs2jNTKxpZ8xTulcESRit_9WRTQdFRo835Q_3cHJlbmRdO-vyxb2QJPpxBOBS0vSCjkbSI7IXJ0aY13ff_V0UivDclRhW15eniTdVgdQQ5RLmj_gHLOPFhCcRvBg0KqQrvjbwRPPwtavj1Jzjv42Pn5mpagDbew";
       // "Bearer ";

    beforeAll( async()=>{await connect()});

    describe("Books Success CRUD Operations", () => {
        it('fetch list all books', (done)=>{
            Book.find = jest.fn().mockImplementationOnce(() => ({
                                populate: jest.fn().mockResolvedValueOnce(booksList),
            }));
            request(app).get('/books').set({ Authorization: authToken }).expect(200,done);
        });
        it("Should create a book", (done) => {
            Book.prototype.save = jest
                .fn()
                .mockResolvedValueOnce({ ...book, _id: "B111" });
            request(app).post('/books').set({ Authorization: authToken }).send(book).expect(200,done);
        });
        it("Should fetch book details by id", async (done) => {
            Book.findById = jest.fn().mockResolvedValueOnce({ ...book });
            request(app).get('/books/B111').set({ Authorization: authToken }).expect(200,done);
        });

        it("Should update book by id", async (done) => {
            Book.findByIdAndUpdate = jest
                .fn()
                .mockResolvedValueOnce({ ...book, name: "Jokob" });
            request(app).put('/books/B111').set({ Authorization: authToken }).send(book).expect(200,done);
        });

        it("Should delete a book by id", async (done) => {
            Book.deleteOne = jest.fn().mockResolvedValueOnce({ ...book });
            request(app).delete('/books/B111').set({ Authorization: authToken }).expect(200,done);
        });
    });

    describe("Reviews Success CRUD Operations", () => {
        it('fetch list all books', (done)=>{
            Reviews.find = jest.fn().mockImplementationOnce(() => ({
                                populate: jest.fn().mockResolvedValueOnce([review]),
            }));
            request(app).get('/books').set({ Authorization: authToken }).expect(200,done);
        });
        it("Should create a book", (done) => {
            Reviews.prototype.save = jest
                .fn()
                .mockResolvedValueOnce({ ...review, _id: "R111" });
            request(app).post('/books/B111/reviews').set({ Authorization: authToken }).send(review).expect(200,done);
        });
        it("Should fetch book details by id", async (done) => {
            Reviews.findById = jest.fn().mockResolvedValueOnce({ ...review });
            request(app).get('/books/B111/reviews/R111').set({ Authorization: authToken }).expect(200,done);
        });

        it("Should update book by id", async (done) => {
            Reviews.findByIdAndUpdate = jest
                .fn()
                .mockResolvedValueOnce({ ...review});
            request(app).put('/books/B111/reviews').set({ Authorization: authToken }).send(review).expect(200,done);
        });

        it("Should delete a book by id", async (done) => {
            Reviews.deleteOne = jest.fn().mockResolvedValueOnce({ ...review });
            request(app).delete('/books/B111/reviews').set({ Authorization: authToken }).expect(200,done);
        });
    });

    describe("Books Failure CRUD Operations", () => {

        it("Should raise an error when no auth added in request", async (done) => {
            request(app).get('/books').expect(401,done);
        });

        it("Should raise an error to fetch all books", async (done) => {
            Book.find = jest.fn().mockImplementationOnce(() => ({
                populate: jest.fn().mockRejectedValueOnce([book]),
            }));
            request(app).get('/books').set({ Authorization: authToken }).expect(404,done);
        });
        it("Should raise an error to create a book", async (done) => {
            Book.prototype.save = jest
            .fn()
            .mockRejectedValueOnce({ ...book, _id: "B111" });
            request(app).post('/books').set({ Authorization: authToken }).send(book).expect(400,done);
        });

        it("Should raise an error to fetch a book", async (done) => {
            Book.findById = jest.fn().mockRejectedValueOnce({ ...book });
            request(app).get('/books/B111').set({ Authorization: authToken }).expect(404,done);
        });

        it("Should raise an error to update a book", async (done) => {
            Book.findByIdAndUpdate = jest
            .fn()
            .mockRejectedValueOnce({ ...book, name: "Jokob" });
            request(app).put('/books/B111').set({ Authorization: authToken }).send(book).expect(400,done);
        });

        it("Should raise an error to delete a book", async (done) => {
            Book.deleteOne = jest.fn().mockRejectedValueOnce({ ...book });
            request(app).delete('/books/B111').set({ Authorization: authToken }).expect(404,done);
        });
    });
    describe("Reviews Failure CRUD Operations", () => {
        it("Should raise an error to fetch all reviews", async (done) => {
            Reviews.find = jest.fn().mockImplementationOnce(() => ({
                populate: jest.fn().mockRejectedValueOnce([review]),
            }));
            request(app).get('/books/B111/reviews').set({ Authorization: authToken }).expect(404,done);
        });
        it("Should raise an error to create a review", async (done) => {
            Reviews.prototype.save = jest
            .fn()
            .mockRejectedValueOnce({ ...review, _id: "R111" });
            request(app).post('/books/B111/reviews').set({ Authorization: authToken }).send(review).expect(400,done);
        });

        it("Should raise an error to get a review", async (done) => {
            Reviews.findById = jest.fn().mockRejectedValueOnce({...review});
            request(app).get('/books/B111/reviews/R111').set({ Authorization: authToken }).expect(404,done);
        });

        it("Should raise an error to update a review", async (done) => {
            Reviews.findByIdAndUpdate = jest.fn().mockRejectedValueOnce({...review});
            request(app).put('/books/B111/reviews/R111').set({ Authorization: authToken }).send(review).expect(400,done);
        });

        it("Should raise an error to delete a review", async (done) => {
            Reviews.deleteOne = jest.fn().mockRejectedValueOnce({...review});
            request(app).delete('/books/B111/reviews/R111').set({ Authorization: authToken }).expect(404,done);
        });
    });
});