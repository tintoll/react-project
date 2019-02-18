const Router = require('koa-router');
const api = new Router();
/*
const books = require('./books');
api.use('/books', books.routes());
*/


const auth = require('./auth');
const posts = require('./posts');
const users = require('./users');
api.use('/auth', auth.routes());
api.use('/posts', posts.routes());
api.use('/users', users.routes());


module.exports = api;