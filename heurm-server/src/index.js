const Koa = require('koa');
const app = new Koa();

// app.use() 는 미들웨어를 등록하여 줍니다. 
// 미들웨어란? 요청이 와서 응답을 주기 전까지 해야할 일들을 담음 함수
// 아래는 어떤한 요청이 들어와도 무조건 Helo Koa를 body에 넣어준다. 

// 미들웨어 함수는 인자로 ctx, next를 받는다. 
// ctx는 웹 요청과, 응답에 대한 정보를 지니고있고, next 는 다음 미들웨어를 실행시키는 함수이다 
app.use((ctx,next) => {
    console.log(1);
    const started = new Date();
    // next() 를 실행하면, 프로미스를 반환합니다. 따라서, 작업들이 끝나고 나서 할 작업들을 정해줄 수도 있습니다.
    next().then(() => {
        console.log(new Date() - started + 'ms');
    });
});

// 서버측에서 async/await 는 자주 사용되는데요. 
// 이는 데이터베이스에 요청을 할 때 매우 유용하게 사용됩니다. 이 문법이 있으니, 콜백이 여러개 겹칠일이 없겠죠.
app.use(async (ctx,next) => {
    console.log(2);
    const started = new Date();
    await next();
    console.log(new Date() - started + 'ms');
});
app.use(ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(4000, () => {
    console.log('server is listening to port 4000');
});
