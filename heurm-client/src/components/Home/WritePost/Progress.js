import React, { Component } from 'react';
import styled from 'styled-components';
import oc from "open-color";

const Wrapper = styled.div`
  background : ${oc.cyan[4]};
  height : 4px;
  position : absolute;
  left : 0px;
  bottom : 0px;
  width : ${props => props.percentage + '%'};
  ${props => props.percentage !== 0 && `transition: all 1s ease-in-out;`}

`;



class Progress extends Component {
  state = {
    percentage : 0
  }

  timeoutId = null;

  handlePost = () => {
    const { onPost }= this.props;
    onPost(); //props로 받은 onPost를 호출합니다.
  }

  componentWillReceiveProps(nextProps) {
    // props가 변할때 마다 

    clearTimeout(this.timeoutId); //기존의 타임아웃을 중지시킨다.
    this.setState({
      percentage : 0
    });

    if(nextProps.value === '') {
      // 내용이 비어있으면 작업을 중단 
      return;
    }

    // 상태를 100으로 변경한다. 하나의 이벤트 루프에서 setState가 두번 호출되면
    // setState를 한번에 하게 되므로 setTimeout으로 감싸줍니다.
    setTimeout(() => {
      this.setState({
        percentage : 100
      })
    }, 0);

    // 나중에 취소할수 있도록 this.timeoutId에 setTiemout의 결과를 담는다. 
    this.timeoutId = setTimeout(this.handlePost, 1000);
  }

  render() {
    const {percentage} = this.state;
    return (
      <Wrapper percentage={percentage} />
    );
  }
}


export default Progress;