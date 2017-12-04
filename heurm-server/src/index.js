const Koa = require('koa');
const app = new Koa();


// app.use() 는 미들웨어를 등록하여 줍니다. 
// 미들웨어란? 
app.use(ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(4000, () => {
    console.log('server is listening to port 4000');
});