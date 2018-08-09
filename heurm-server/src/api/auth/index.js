const Router = require('koa-router');
const auth = new Router();
const authCtrl = require('./auth.controller');

auth.post('/register/local', authCtrl.localRegister);
auth.post('/login/local', authCtrl.localLogin);
// :key(email|username) 이 사용되었는데, 이 의미는 key 라는 파라미터를 설정하는데, 
// 이 값들이 email 이나 username 일때만 허용한다는 것 입니다.
auth.get('/exists/:key(email|username)/:value', authCtrl.exists);
auth.post('/logout', authCtrl.logout);
auth.post('/check', authCtrl.check);

module.exports = auth;