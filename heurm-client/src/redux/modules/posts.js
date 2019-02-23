import { createAction, handleActions } from "redux-actions";

import { Map, List, fromJS } from "immutable";
import * as PostAPI from "lib/api/posts";
import { pender } from "redux-pender";

const LOAD_POST = "posts/LOAD_POST"; // 포스트 리스트 초기 로딩
const PREFETCH_POST = "post/PREFETCH_POST"; // 포스트 미리 로딩
const SHOW_PREFETCHED_POST = "post/SHOW_PREFETCHED_POST"; // 미리 로딩된 포스트 화면에 보여주기
// 웹소켓에서 store 에 직접 dispatch 하는 것 이기 때문에 액션 생성자를 따로 만들 필요 없습니다.
const RECEIVE_NEW_POST = "posts/RECEIVE_NEW_POST"; // 새 데이터 수신

const LIKE_POST = "posts/LIKE_POST";
const UNLIKE_POST = "posts/UNLIKE_POST";

export const loadPost = createAction(LOAD_POST, PostAPI.list);
export const prefetchPost = createAction(PREFETCH_POST, PostAPI.next); //url
export const showPrefetchedPost = createAction(SHOW_PREFETCHED_POST);

// 두번쨰 파라미터는 metaCreator 값인데요, 여기에서는 payload 의 값에 따라서 액션 객체의 meta 값을 설정해줍니다.
export const likePost = createAction(
  LIKE_POST,
  PostAPI.like,
  payload => payload
); // postId를 meta값으로 설정
export const unlikePost = createAction(
  UNLIKE_POST,
  PostAPI.unlike,
  payload => payload
); // postId를 meta값으로 설정

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
    },

    ...pender({
      type: LIKE_POST,
      onPending: (state, action) => {
        const index = state
          .get("data")
          .findIndex(post => post.get("_id") === action.meta);
        return state.updateIn(
          ["data", index],
          post =>
            post
              .set("liked", true) // liked 값을 true로 바꾸고
              .update("likedCount", count => count + 1) // likedCount 값을 1더함
        );
      },
      //요청이 끝나면 실 서버값으로 설정
      onSuccess: (state, action) => {
        const index = state
          .get("data")
          .findIndex(post => post.get("_id") === action.meta);
        return state.setIn(
          ["data", index, "likesCount"],
          action.payload.data.likesCount
        );
      }
    }),
    ...pender({
      type: UNLIKE_POST,
      onPending: (state, action) => {
        const index = state
          .get("data")
          .findIndex(post => post.get("_id") === action.meta);
        return state.updateIn(
          ["data", index],
          post =>
            post
              .set("liked", false) // liked 값을 true로 바꾸고
              .update("likedCount", count => count - 1) // likedCount 값을 1더함
        );
      },
      //요청이 끝나면 실 서버값으로 설정
      onSuccess: (state, action) => {
        const index = state
          .get("data")
          .findIndex(post => post.get("_id") === action.meta);
        return state.setIn(
          ["data", index, "likesCount"],
          action.payload.data.likesCount
        );
      }
    })
  },
  initialState
);
