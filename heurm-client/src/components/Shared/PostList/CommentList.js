import React, { Component } from "react";
import styled from "styled-components";
import oc from "open-color";
import Comment from "./Comment";

import withRelayout from "lib/withRelayout";

const CommentListWrapper = styled.div`
  margin-top: 0.75rem;
`;

const ReadMore = styled.div`
  color: ${oc.gray[6]};
  font-size: 0.9rem;
  text-align: center;
  cursor: pointer;

  &:hover {
    color: ${oc.cyan[6]};
    font-weight: 500;
  }
`;

class CommentList extends Component {
  state = {
    limit: 5
  };

  handleReadMore = () => {
    this.setState({
      limit: this.state.limit + 10
    });
    this.props.onRelayout();
  };

  render() {
    const { comments } = this.props;
    if (comments.size === 0) return null;

    const { limit } = this.state;
    const { handleReadMore } = this;

    const commentList = comments
      .slice(0, limit)
      .map(comment => <Comment {...comment.toJS()} key={comment.get("_id")} />);

    return (
      <CommentListWrapper>
        {commentList}
        {limit < comments.size && (
          <ReadMore onClick={handleReadMore}>
            {comments.size - limit}개 더 보기
          </ReadMore>
        )}
      </CommentListWrapper>
    );
  }
}

export default withRelayout(CommentList);
