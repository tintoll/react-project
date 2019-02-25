import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';

const Wrapper = styled.div`
  display : flex;
  align-items : center;
  flex-direction : column;
`;

const Thumbnail = styled.div`
  background-image : url(${prpos => prpos.image});
  background-size : cover;
  background-position : center;
  background-repeat : no-repeat;
  width : 100px;
  height : 100px;
  border-radius : 50%;
`;

const Username = styled.div`
  margin-top : 0.5rem;
  font-size : 1.5rem;
  font-weight : 800;
  color : ${oc.gray[8]};
`;

const Count = styled.div`
  margin-top : 0.25rem;
  font-weight : 300;
  color : ${oc.gray[6]};
  b {
    font-weight : 500;
  }
`;

const UserHead = ({image="/static/images/default_thumbnail.png", username="username", thoughtCount=150}) => (
    <Wrapper>
      <Thumbnail image={image}/>
      <Username>{username}</Username>
      <Count>흐른 생각 <b>{thoughtCount}개</b></Count>
    </Wrapper>
);

export default UserHead;