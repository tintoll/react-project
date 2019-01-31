import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as baseActions from 'redux/modules/base';
import { dispatch } from 'rxjs/internal/observable/pairs';


class Auth extends Component {
  // 페이지 진입할 때 헤더를 비활성화 
  componentWillMount() {
    this.props.BaseActions.setHeaderVisibility(false);
  }
  
  // 페이지에서 벗어 날때 다시 활성화 
  componentWillUnmount() {
    this.props.BaseActions.setHeaderVisibility(true);
  }
  
  render() {
    return (
      <div>
        Auth1
      </div>
    );
  }
}

export default connect(
  (state) => ({

  }),
  (dispatch) => ({
    BaseActions : bindActionCreators(baseActions, dispatch)
  })
)(Auth);