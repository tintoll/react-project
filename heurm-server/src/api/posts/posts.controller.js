const Account = require("models/Account");
const Post = require("models/post");
const Joi = require("joi");
const ObjectId = require("mongoose").Types.ObjectId;

const redis = require("redis");
const publisher = redis.createClient();

exports.write = async ctx => {
  // 유저 검증 하기
  const { user } = ctx.request;
  if (!user) {
    ctx.status = 403;
    ctx.body = { message: " not logged in" };
    return;
  }

  // 유저의 throughtCount 가져오기

  let account;
  try {
    account = await Account.findById(user._id).exec();
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!account) {
    ctx.status = 403;
    return;
  }

  const count = account.thoughtCount + 1;

  // 요청 데이터 스키마 검증하기
  const schema = Joi.object().keys({
    content: Joi.string()
      .min(5)
      .max(1000)
      .required()
  });

  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    return;
  }

  const { content } = ctx.request.body;

  // Post write 메소드 호출
  let post;
  try {
    post = await Post.write({
      count,
      username: user.profile.username,
      content
    });

    await account.increaseThoughtCount();
  } catch (e) {
    ctx.throw(500, e);
  }

  // post 에 liked 값 false 로 설정
  post = post.toJSON();
  delete post.likes;
  post.liked = false;

  // 포스트 정보 반환
  ctx.body = post;

  // TODO 소켓을 통하여 접속중인 유저에게 싨간 포스트 정보 전송
  /* 데이터를 리덕스 액션 형식으로 전송 */
  publisher.publish(
    "posts",
    JSON.stringify({
      type: "posts/RECEIVE_NEW_POST",
      payload: post
    })
  );
};

exports.list = async ctx => {
  const { cursor, username } = ctx.query;

  // ObjectId 검증
  if (cursor && !ObjectId.isValid(cursor)) {
    ctx.status = 400;
    return;
  }

  // API를 호출한 유저의 정보를 가져옵니다.
  const { user } = ctx.request;
  const self = user ? user.username : null; //로그인한 유저라면 username 값을 self에 넣어줍니다.

  let posts = null;
  try {
    posts = await Post.list({ cursor, username, self });
  } catch (e) {
    ctx.throw(500, e);
  }

  // 만약에 불러올 데이터가 20개라면, 그 다음 데이터들이 더 있을 수 있습니다.
  // 현재 불러온 데이터 중 가장 마지막 데이터를 기점으로 데이터를 추가적으로 로딩하는 API 의 주소를 만들어줍니다.
  const next =
    posts.length === 20
      ? `/api/posts/?${username ? `username=${username}&` : ""}cursor=${
          posts[19]._id
        }`
      : null;

  // 좋아요 했는지 호가인
  function checkLiked(post) {
    // posts 에 스키마에 속하지 않은 값을 추가해주려면 toObject() 를 해주어야합니다.
    // 혹은, 쿼리를 하게 될 떄 .lean().exec() 의 형식으로 해야합니다.
    post = post.toObject();

    // 비로그인 상태라면 false
    // 배열에 아이템이 있다면, 자신의 아이디가 들어있다는 뜻이니 true
    const checked = Object.assign(post, {
      liked: user !== null && post.likes.length > 0
    });
    delete checked.likes; // likes key 제거
    return checked;
  }
  posts = posts.map(checkLiked); //map을 통하여 각 포스트를 변형시켜줍니다.

  ctx.body = {
    next,
    data: posts
  };
};
