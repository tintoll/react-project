const mongoose = require('mongoose');
const { Schema } = mongoose;

const crypto = require('crypto');

const { generateToken } = require('lib/token')

function hash(password) {
  return crypto.createHmac('sha256', process.env.SECRET_KEY)
               .update(password).digest('hex');
}

const Account = new Schema({
  profile : {
    username : String,
    thumbnail : {type:String , default : '/static/images/default_thumbnail.png'}
  },
  email : String,
  social : {
    facebook : {
      id : String,
      accessToken : String
    },
    google : {
      id : String,
      accessToken : String
    }
  },
  password : String,
  thoughtCount : {type : Number, default : 0},
  createAt : {type:Date, default: Date.now}
});

/*
모델 메소드는 두 종류로 만들 수 가 있습니다. 
.statics 와 .methods 인데요, 각 종류는 서로 가르키는 this 값이 다른데요, 
전자의 경우엔 모델 자체를 가르키고, 후자의 경우엔 데이터 인스턴스를 가르킵니다.
*/
Account.statics.findByUsername = function(username) {
  // 객체에 내장되어있는 값을 사용 할 때는 객체명.키 이런식으로 쿼리하면 됩니다
  return this.findOne({'profile.username':username}).exec();
}
Account.statics.findByEmail =  function(email){
  return this.findOne({'email':email}).exec();
}
Account.statics.findByEmailOrUsername = function({email, username}) {
  return this.findOne({
    // $or 연산자를 통해 둘중에 하나를 만족하는 데이터를 찾습니다
    $or : [
      {'profile.username' : username},
      {'email' : email}
    ]
  }).exec();
}
Account.statics.localRegister = function({username, email, password}) {
  const account = new this({
    profile : {
      username : username
      // thumbnail 값을 설정하지 않으면 기본값으로 설정됩니다.
    },
    email,
    password : hash(password)
  });
  return account.save();
}

Account.methods.validatePassword = function(password) {
  // 함수로 전달받은 password 의 해시값과, 데이터에 담겨있는 해시값과 비교를 합니다.
  const hashed = hash(password);
  return this.password === hashed;
}
Account.methods.generateToken = function() {
  // JWT 에 담을 내용
  const payload = {
    _id: this._id,
    profile: this.profile
  };
  return generateToken(payload, 'account');
}

Account.methods.increaseThoughtCount = function() {
  this.thoughtCount++;
  return this.save();
}

module.exports = mongoose.model('Account', Account);