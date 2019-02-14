const Account = require('models/Account');
const Post = require('models/post');
const Joi = require('joi');
const ObjectId = require('mongoose').Types.ObjectId;


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
  const { cursor, username } = ctx.query;

  // ObjectId 검증
  if(cursor && !ObjectId.isValid(cursor)) {
    ctx.status = 400;
    return;
  }
  
  let posts = null;
  try {
    posts = await Post.list({cursor, username});
  } catch(e) {
    ctx.throw(500, e);
  }

  // 만약에 불러올 데이터가 20개라면, 그 다음 데이터들이 더 있을 수 있습니다.
  // 현재 불러온 데이터 중 가장 마지막 데이터를 기점으로 데이터를 추가적으로 로딩하는 API 의 주소를 만들어줍니다.
  const next = posts.length === 20 ? `/api/posts/?${username? `username=${username}&` : ''}cursor=${posts[19]._id}` : null;
  ctx.body = {
    next,
    data : posts
  };

}

