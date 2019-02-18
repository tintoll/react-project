import React from 'react';
import styled from 'styled-components';
import Masonry from "react-masonry-component";
import Post from './Post';


// 이 컴포넌트에서는 position: relative 속성을 주는것이 중요합니다. 
// 그 이유는 Post 컴포넌트의 사이즈가 이 컴포넌트의 너비와 비례하여 만들어지기 때문입니다.
const Wrapper = styled.div`
  position : relative;
  margin-top : 1rem;
`;

const PostList = () => (
    <Wrapper>
      <Masonry otpions={{gutter:16}}>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </Masonry>
    </Wrapper>
);

export default PostList;