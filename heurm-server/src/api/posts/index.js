const Router = require("koa-router");
const posts = new Router();

const postsCtrl = require("./posts.controller");
const likesCtl = require("./like.controller");
const commentsCtrl = require("./comments.controller");

posts.post("/", postsCtrl.write);
posts.get("/", postsCtrl.list);

posts.post("/:postId/likes", likesCtl.like);
posts.delete("/:postId/likes", likesCtl.unlike);
posts.post("/:postId/comments", commentsCtrl.comment);

module.exports = posts;
