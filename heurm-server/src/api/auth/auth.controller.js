const Joi = require('joi');
const Account = require('models/Account');

// 로컬 회원가입
exports.localRegister = async (ctx) => {
  // 데이터 검증
  // 아이디는 4~15자의 영소문자이며, 비밀번호는 최소 6자, 이메일은, 당연하게도, 이메일 형식이어야 합니다.
  const schema = Joi.object().keys({
    username : Joi.string().alphanum().min(4).max(15).required(),
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required()
  });

  const result = Joi.validate(ctx.request.body, schema);
  if(result.error) {
    ctx.status = 400;
    return;
  }

  // 아이디 / 이메일 중복 체크
  let existing = null;
  try {
    existing = await Account.findByEmailOrUsername(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }
  // 중복값이 존재하면 
  if(existing) {
     ctx.status = 409; // Conflict
     ctx.body = {
      key: existing.email === ctx.request.body.email ? 'email' : 'username'
     }
     return;
  }

  // 계정생성
  let account = null;
  try {
    account = await Account.localRegister(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  let token = null;
  try {
    token = await account.generateToken();
  } catch (e) {
    ctx.throw(500, e);
  }

  // 쿠키에 httpOnly 속성 정의
  ctx.cookies.set('access_token', token, {httpOnly : true, maxAge : 1000 * 60 * 60 * 24 * 7});
  ctx.body = account.profile; // 프로필 정보로 응답합니다.
};

// 로컬 로그인
exports.localLogin = async (ctx) => {
  // 데이터 검증
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const result = Joi.validate(ctx.request.body, schema);
  if(result.error) {
      ctx.status = 400; // Bad Request
      return;
  }
  
  const {email, password} = ctx.request.body;
  let account = null;
  try {
      // 이메일로 계정 찾기
      account = await Account.findByEmail(email);
  } catch (e) {
      ctx.throw(500, e);
  }
   // 유저가 존재하지 않거나 || 비밀번호가 일치하지 않으면
  if(!account || !account.validatePassword(password)) {
    ctx.status = 403; // Forbidden
    return;
  }

  let token = null;
  try {
      token = await account.generateToken();
  } catch (e) {
      ctx.throw(500, e);
  }

  ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
  ctx.body = account.profile;
};

// 이메일 / 아이디 존재유무 확인
exports.exists = async (ctx) => {
  const {key, value} = ctx.params;

  let account = null;
  try {
    //await 뒤에 () 로 감싸주어야 한다.
    account = await (key === 'email' ? Account.findByEmail(value) : Account.findByUsername(value));
  } catch (e) {
    ctx.throw(500, e);
  }


  ctx.body = {
    exists : account !== null
  };
};

// 로그아웃
exports.logout = async (ctx) => {
  
  ctx.cookies.set('access_token', null, {
    maxAge : 0,
    httpOnly : true
  });
  ctx.status = 204;
};

// 체크 
exports.check = async (ctx) => {
  //  ctx.request.user 에 접근하면 토큰에 설정했던 객체값을 얻을 수 있습니다.
  const { user } = ctx.request;
  if(!user) {
    ctx.status = 403;
    return;
  }
  ctx.body = user.profile;
}