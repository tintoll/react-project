const Router = require('koa-router');
const api = new Router();
/*
const books = require('./books');
api.use('/books', books.routes());
*/


const auth = require('./auth');
api.use('/auth', auth.routes());

module.exports = api;