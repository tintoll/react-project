require('dotenv').config(); //.env 파일에서 환경변수 불러오기 

const Koa = require('koa');
const Router = require('koa-router');
const { jwtMiddleware } = require('lib/token');

const app = new Koa();
const router = new Router();

// 미들웨어는 POST/PUT 등의 메소드의 Request Body 에 JSON 형식으로 데이터를 넣어주면 
// 이를 파싱해서 서버측에서 사용 할 수 있도록 해준다.
const bodyParser = require('koa-bodyparser');

// mongoose 사용
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; //Promise종류가 여러개있는데 node의 Promise를 사용하겠다는 의미
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true
})
.then((response) => {
    console.log('success mongoDb');
}).catch( e => {
    console.error(e);
});

app.use(bodyParser()); // 바디파서 적용, 라우터 적용코드보다 상단에 있어야합니다.

app.use(jwtMiddleware); // jwt미들웨어 적용 

const api = require('./api/index');
router.use('/api',api.routes()); // api 라우트를 /api 경로 하위 라우트로 설정

/*
router.get('/', (ctx , next) => {
    ctx.body = '홈';
});

router.get('/about', (ctx , next) => {
    ctx.body = '소개';
});

router.get('/about/:name', (ctx , next) => {
    const { name } = ctx.params; // 라우트 경로에서 :파라미터명 으로 정의된 값이 ctx.params 안에 설정됩니다.
    ctx.body = `${name} 님 소개`;
});

router.get('/posts', (ctx, next) => {
    const { id } = ctx.request.query; // 주소 뒤에 ?id=10 이런식으로 작성된 쿼리는 ctx.request.query 에 파싱됩니다.
    if(id) {
        ctx.body = `포스트 #${id}`;
    } else {
        ctx.body = '포스트가 존재하지 않습니다.';
    }
});
*/
app.use(router.routes());
app.use(router.allowedMethods());


const port = process.env.PORT || 4000; // .env의 값 가져오기 

app.listen(port, () => {
    console.log('server is listening to port '+port);
});
