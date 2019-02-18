import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';

// Timeago 라이브러리
import TimeAgo from 'react-timeago';
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

import { media, shadow } from "lib/styleUtils";

const formatter = buildFormatter(koreanStrings); //  한글 형식으로 보여주기 

const Wrapper = styled.div`
  width : calc((100% - 32px) / 3);
  ${media.desktop`
    width : calc((100% - 16px) / 2);
  `}
  ${media.tablet`
    width : 100%;
  `}
  height : 400px;
  margin-bottom : 1rem;
  background : white;
  ${shadow(1)}

`;

// 포스트 상단 썸네일, 생각번호, 시간을 래핑
// 자식들을 한줄로 나열 시켜줍니다.
const PostHead = styled.div`
  padding : 1rem;
  display : flex;
  flex-direction : row;
  align-items : center;
  border-bottom : 1px solid ${oc.gray[2]};
`;

// images props 로 전달받은 썸네일을 32*32 사이즈로 보여줍니다.
const UserThumbnail = styled.div`
  background : ${oc.gray[2]};
  background-image : url(${props => props.image});
  background-size : cover;
  background-position : center;
  background-repeat : no-repeat;
  width : 32px;
  height : 32px;
  border-radius : 50%;
`;

// 유저네임을 띄워줍니다.
const Username = styled.div`
  font-weight : 500;
  margin-left : 0.3rem;
  font-size : 0.9rem;
`;

// 몇번째 생각이닞 알려줍니다. 
const Count = styled.div`
  color : ${oc.gray[6]};
  margin-left : 0.3rem;
  font-size : 0.8rem;
`;

// 얼마나 전에 작성됐는지 알려줍니다.
const Time = styled.div`
  color : ${oc.gray[4]};
  font-size : 0.8rem;
  margin-left : auto;
`;

// 포스트 내용을 보여줍니다. 
const Content = styled.div`
  font-size : 1.25rem;
  color : ${oc.gray[8]};
  font-weight : 300;
  padding : 1rem;
  word-break : break-all;
  white-space : pre-wrap;
`;



const Post = () => (
    <Wrapper>
      <PostHead>
      <UserThumbnail image={`/api/users/blue1/thumbnail`}/>
        <Username>tintoll</Username>
        <Count>#1번째 생각</Count>
        <Time><TimeAgo date={new Date()} formatter={formatter}/></Time>
      </PostHead>
      <Content>
        내용내용 
      </Content>
    </Wrapper>
);

export default Post;