const mongoose = require("mongoose");
const { Schema } = mongoose;

const Comment = new Schema({
  createAt: { type: Date, default: Date.now },
  username: String,
  text: String
});

const Post = new Schema({
  createAt: { type: Date, default: Date.now },
  count: Number,
  username: String,
  content: String,
  likesCount: { type: Number, default: 0 },
  likes: { type: [String], default: [] },
  comments: {
    type: [Comment],
    default: []
  }
});

Post.statics.write = function({ count, username, content }) {
  const post = new this({
    count,
    username,
    content
  });
  return post.save();
};

Post.statics.list = function({ cursor, username, self }) {
  // cursor, username 값의 존재 유무에 따라 쿼리가 유동적으로 설정됩니다.

  // Object.assign 이 사용 된 이유는, 만약에 { cursor, username } 을 그대로 전달하게 된다면
  // 파라미터 값이 설정되지 않았을 때는 이 값들에 undefined 로 설정되어 원하지 않는 결과가 나타나기 때문입니다.
  // 따라서, 객체들을 합치는 방식으로 쿼리를 유동적으로 조합합니다.
  const query = Object.assign(
    {},
    cursor ? { _id: { $lt: cursor } } : {},
    username ? { username } : {}
  );

  return this.find(query)
    .sort({ _id: -1 }) //역순
    .limit(20)
    .exec();
};

Post.statics.like = function({ _id, username }) {
  return this.findByIdAndUpdate(
    _id,
    {
      $inc: { likesCount: 1 }, // likesCount 를 1더하고
      $push: { likes: username }
    },
    {
      new: true, // 이걸해야 업데이트 된 데이터를 반환함
      select: "likesCount"
    }
  ).exec();
};

Post.static.unlike = function({ _id, username }) {
  return this.findByIdAndUpdate(
    _id,
    {
      $inc: { likesCount: -1 },
      $pull: { likes: username }
    },
    {
      new: true,
      select: "likesCount" // 데이터를 불러올때 likesCount값만 불러오는 설정
    }
  );
};

module.exports = mongoose.model("Post", Post);
