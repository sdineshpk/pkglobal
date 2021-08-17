import * as express from 'express';
import * as bookServ from '../services/book.service';
import * as reviewServ from '../services/reviews.service';
import OktaJwtVerifier = require('@okta/jwt-verifier');
export const routes = express.Router();

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: 'https://dev-88273664.okta.com/oauth2/default' // required
  });



// Only let the user access the route if they are authenticated.
function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);
  // The expected audience passed to verifyAccessToken() is required, and can be either a string (direct match) or
  // an array  of strings (the actual aud claim in the token must match one of the strings).
  const expectedAudience = 'api://default';

  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }

  const accessToken = match[1];

  return oktaJwtVerifier.verifyAccessToken(accessToken, expectedAudience)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
  }

routes.get("/books",ensureAuthenticated, bookServ.allBooks);
routes.get("/books/:id",ensureAuthenticated, bookServ.getBook);
routes.post("/books",ensureAuthenticated, bookServ.addBook);
routes.put("/books/:id",ensureAuthenticated, bookServ.updateBook);
routes.delete("/books/:id",ensureAuthenticated, bookServ.deleteBook);

routes.get("/books/:id/reviews",ensureAuthenticated, reviewServ.allReviews);
routes.get("/books/:id/reviews/:review_id",ensureAuthenticated, reviewServ.getReview);
routes.post("/books/:id/reviews",ensureAuthenticated, reviewServ.addReview);
routes.put("/books/:id/reviews/:review_id",ensureAuthenticated, reviewServ.updateReview);
routes.delete("/books/:id/reviews/:review_id",ensureAuthenticated, reviewServ.deleteReview);