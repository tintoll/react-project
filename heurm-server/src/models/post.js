const mongoose = require('mongoose');
const { Schema } = mongoose;

const Comment = new Schema({
  createAt : {type: Date, default : Date.now},
  username : String,
  text : String
});


const Post = new Schema({
  createAt: { type: Date, default: Date.now },
  count : Number,
  username: String,
  content: String,
  likesCount : {type : Number, default : 0},
  likes : {type : [String], default : []},
  comments : {
    type :[Comment],
    default : []
  }
});



Post.statics.write = function({count, username, content}) {
  const post = new this({
    count, username, content
  });
  return post.save();
};

module.exports = mongoose.model('Post', Post);