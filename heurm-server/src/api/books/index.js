const Router = require('koa-router');

const books = new Router();

// 핸들러들을 따로 파일로 만들어주면 유지보수에 더 용이하다.
const booksCtrl = require('./books.controller');

books.get('/', booksCtrl.list);
books.get('/:id', booksCtrl.get);
books.post('/', booksCtrl.create);
books.delete('/:id', booksCtrl.delete);

// PUT 의 경우엔 데이터를 통째로 바꿔버리는 메소드이며, PATCH 의 경우엔 주어진 필드만 수정하는 메소드입니다.
// PUT 의 경우엔 모든 필드를 받도록 데이터를 검증해야합니다.
// 추가적으로 PUT 의 경우에 데이터가 존재하지 않는다면 데이터를 새로 만들어주어야 하는게 원칙입니다.
books.put('/:id', booksCtrl.replace);
books.patch('/:id', booksCtrl.update);

module.exports = books;