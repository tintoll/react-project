import React from "react";
import styled from "styled-components";
import oc from "open-color";
import { shadow, media } from "lib/styleUtils";
import Textarea from "react-textarea-autosize";
import Progress from "./Progress";

const Wrapper = styled.div`
  width: 768px;
  margin: 0 auto;
  padding: 1rem;
  background: ${oc.gray[7]};
  ${shadow(1)}
  position : relative;

  ${media.desktop`
    width : 736px;
  `}

  ${media.tablet`
    width : 100%;
  `}
`;

// ::placeholder 부분은 아무것도 입력 되지 않은 상태 일 때 폰트색을 정해줍니다.
const StyledTextarea = styled(Textarea)`
  width: 100%;
  background: transparent;
  border: none;
  resize: none;
  outline: none;
  font-size: 1.5rem;
  color: white;
  ::placeholder {
    color: ${oc.gray[3]};
  }
  ${media.tablet`
    font-size : 1rem;
  `}
`;

// react-textarea-autosize 에서는, 컴포넌트 내부의 인풋에 ref 를 달아 줄 때 inputRef 라는 props 를 사용합니다.
const WritePost = ({ onChange, onPost, value, inputRef }) => (
  <Wrapper>
    <StyledTextarea
      onChange={onChange}
      minRows={3}
      maxRows={10}
      placeholder={`의식의 흐름대로 당신의 생각을 적어보세요.\n5초이상 아무것도 입력하지 않으면 자동으로 포스팅됩니다.`}
      onPaste={e => e.preventDefault()}
      inputRef={inputRef}
    />
    <Progress onPost={onPost} value={value} />
  </Wrapper>
);

export default WritePost;
