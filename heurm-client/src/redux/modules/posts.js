import { createAction, handleActions } from "redux-actions";

import { Map, List, fromJS } from "immutable";
import * as PostAPI from "lib/api/posts";
import { pender } from "redux-pender";

const LOAD_POST = "posts/LOAD_POST"; // 포스트 리스트 초기 로딩
const PREFETCH_POST = "post/PREFETCH_POST"; // 포스트 미리 로딩
const SHOW_PREFETCHED_POST = "post/SHOW_PREFETCHED_POST"; // 미리 로딩된 포스트 화면에 보여주기
// 웹소켓에서 store 에 직접 dispatch 하는 것 이기 때문에 액션 생성자를 따로 만들 필요 없습니다.
const RECEIVE_NEW_POST = "posts/RECEIVE_NEW_POST"; // 새 데이터 수신

export const loadPost = createAction(LOAD_POST, PostAPI.list);
export const prefetchPost = createAction(PREFETCH_POST, PostAPI.next); //url
export const showPrefetchedPost = createAction(SHOW_PREFETCHED_POST);

const initialState = Map({
  next: "",
  data: List(),
  nextData: List()
});

export default handleActions(
  {
    ...pender({
      type: LOAD_POST,
      onSuccess: (state, action) => {
        const { next, data } = action.payload.data;
        return state.set("next", next).set("data", fromJS(data));
      }
    }),
    ...pender({
      type: PREFETCH_POST,
      onSuccess: (state, action) => {
        // nextData에 결과를 담아둡니다.
        const { next, data } = action.payload.data;
        return state.set("next", next).set("nextData", fromJS(data));
      }
    }),
    [SHOW_PREFETCHED_POST]: (state, action) => {
      const nextData = state.get("nextData");
      return state
        .update("data", data => data.concat(nextData))
        .set("nextData", List());
    },
    [RECEIVE_NEW_POST]: (state, action) => {
      // 전달 받은 포스트를 데이터의 앞부분에 넣어줍니다.
      return state.update("data", data => data.unshift(fromJS(action.payload)));
    }
  },
  initialState
);
