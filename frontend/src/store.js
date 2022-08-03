import { configureStore } from "@reduxjs/toolkit";
import { likeReducer, myPostReducer, userPostReducer } from "./Reducers/Post";
import {
  allUsersReducer,
  postofFollowingReducer,
  userProfileReducer,
  userReducer,
} from "./Reducers/User";

const store = configureStore({
  reducer: {
    user: userReducer,
    postofFollowing: postofFollowingReducer,
    allUsers: allUsersReducer,
    like: likeReducer,
    myPosts: myPostReducer,
    userProfile: userProfileReducer,
    userPost: userPostReducer,
  },
});

export default store;
