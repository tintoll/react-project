const Account = require('models/Account');
const Post = require('models/post');
const Joi = require('joi');


exports.write = async (ctx) => {
  // 유저 검증 하기 
  const { user } = ctx.request;
  if(!user) {
    ctx.status = 403;
    ctx.body = { message : ' not logged in' }
    return;
  }

  // 유저의 throughtCount 가져오기 

  let account;
  try {
    account = await Account.findById(user._id).exec();
  } catch(e) {
    ctx.throw(500, e);
  }
  
  if(!account) {
    ctx.status = 403;
    return;
  }

  const count = account.thoughtCount + 1;

  // 요청 데이터 스키마 검증하기 
  const schema = Joi.object().keys({
    content : Joi.string().min(5).max(1000).required()
  });

  const result = Joi.validate(ctx.request.body, schema);
  if(result.error){
    ctx.status = 400;
    return;
  }

  const { content } = ctx.request.body;
  
  // Post write 메소드 호출
  let post;
  try {
    post = await Post.write({
      count, 
      username : user.profile.username,
      content
    });

    await account.increaseThoughtCount();

  } catch(e) {
    ctx.throw(500, e);
  }


  // 포스트 정보 반환
  ctx.body = post;

  // TODO 소켓을 통하여 접속중인 유저에게 싨간 포스트 정보 전송 
}

exports. list = async (ctx) => {
  ctx.body = 'list';
}

