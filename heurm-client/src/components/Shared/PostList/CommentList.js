import React, { Component } from "react";
import styled from "styled-components";
import oc from "open-color";
import Comment from "./Comment";

const CommentListWrapper = styled.div`
  margin-top: 0.75rem;
`;

class CommentList extends Component {
  render() {
    const { comments } = this.props;
    if (comments.size === 0) return null;

    const commentList = comments.map(comment => (
      <Comment {...comment.toJS()} key={comment.get("_id")} />
    ));

    return <CommentListWrapper>{commentList}</CommentListWrapper>;
  }
}

export default CommentList;
