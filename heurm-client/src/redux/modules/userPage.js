import { createAction, handleActions } from "redux-actions";

import { Map, fromJS } from "immutable";
import { pender } from "redux-pender";
import * as UserAPI from 'lib/api/users';

const GET_USER_INFO = 'user/GET_USER_INFO';

export const getUserInfo = createAction(GET_USER_INFO, UserAPI.getUserInfo);

const initialState = Map({
  info : Map({
    profile : Map({
      thumbnail : null,
      username : null
    }),
    thoughtCount : null
  })
});

export default handleActions({
  ...pender({
    type : GET_USER_INFO,
    onSuccess : (state, action) => state.set('info', fromJS(action.payload.data))
  })
}, initialState);