const Koa = require('koa');
const app = new Koa();


// app.use() 는 미들웨어를 등록하여 줍니다. 
// 미들웨어란? 요청이 와서 응답을 주기 전까지 해야할 일들을 담음 함수
// 아래는 어떤한 요청이 들어와도 무조건 Helo Koa를 body에 넣어준다. 
app.use(ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(4000, () => {
    console.log('server is listening to port 4000');
});
