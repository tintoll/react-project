import React, { Component } from "react";
import PostList from "components/Shared/PostList";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as postsActions from "redux/modules/posts";

import { toast } from "react-toastify";

class PostListContainer extends Component {
  prev = null;

  load = async () => {
    // 가장 최근 작성된 포스트를 20개 불러옵니다.
    const { PostsActions } = this.props;

    try {
      await PostsActions.loadPost();
      const { next } = this.props;
      if (next) {
        // 다음 불러올 포스트들이 있다면 미리 로딩을 해둔다.
        await PostsActions.prefetchPost(next);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 다음 목록 불러오기
  loadNext = async () => {
    const { PostsActions, next } = this.props;
    PostsActions.showPrefetchedPost(); // 미리 불러왔던걸 보여준다

    if (next === this.prev || !next) return; // 이전에 해던 요청과 동일하면 요청하지 않는다.
    this.prev = next;

    // 다음 데이터 요청
    try {
      await PostsActions.prefetchPost(next);
    } catch (e) {
      console.log(e);
    }

    this.handleScroll(); // 한번 더 호출함으로써 인터넷 느린 상황에 밀리는 현상방지
  };

  handleScroll = () => {
    const { nextData } = this.props;
    if (nextData.size === 0) return; // 미리 불러온 데이터 없으면 작업 중지

    const { innerHeight } = window;
    const { scrollHeight } = document.body;
    // IE 에서는 body.scrollTop 대신에 document.documentElement.scrollTop 사용해야함
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    if (scrollHeight - innerHeight - scrollTop < 100) {
      this.loadNext();
    }
  };

  handleToggleLike = ({ postId, liked }) => {
    const { PostsActions, logged } = this.props;
    const message = message => (
      <div style={{ fontSize: "1.1rem" }}>{message}</div>
    );

    if (!logged) {
      return toast(message("로그인 후 이용하실수 있습니다."), {
        type: "error"
      });
    }

    if (liked) {
      PostsActions.unlikePost(postId);
    } else {
      PostsActions.likePost(postId);
    }
  };

  componentDidMount() {
    // 컴포넌트가 마운트 됏을때 호출
    this.load();
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    // 컴포넌트가 언마운트 될 때에는 스크롤 이벤트리스너를 제거합니다
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    const { data } = this.props;
    const { handleToggleLike } = this;
    return <PostList posts={data} onToggleLike={handleToggleLike} />;
  }
}

export default connect(
  state => ({
    next: state.posts.get("next"),
    data: state.posts.get("data"),
    nextData: state.posts.get("nextData"),
    logged: state.user.get("logged")
  }),
  dispatch => ({
    PostsActions: bindActionCreators(postsActions, dispatch)
  })
)(PostListContainer);
