const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const api = require('./api/index');
router.use('/api',api.routes()); // api 라우트를 /api 경로 하위 라우트로 설정

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

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(4000, () => {
    console.log('server is listening to port 4000');
});
