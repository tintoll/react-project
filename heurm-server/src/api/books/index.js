const Router = require('koa-router');

const books = new Router();

// 핸들러들을 따로 파일로 만들어주면 유지보수에 더 용이하다.
const booksCtrl = require('./books.controller');
books.get('/', booksCtrl.list);
books.post('/', booksCtrl.create);
books.delete('/', booksCtrl.delete);
books.put('/', booksCtrl.replace);
books.patch('/', booksCtrl.update);

module.exports = books;