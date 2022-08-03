import axios from "axios";

//Login User
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: "LoginRequest",
    });

    const { data } = await axios.post(
      "/api/v1/login",
      { email, password },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    dispatch({
      type: "LoginSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoginFailure",
      payload: error.response.data.message,
    });
  }
};

//Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });

    const { data } = await axios.get("/api/v1/me");
    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFailure",
      payload: error.response.data.message,
    });
  }
};

//Post of following
export const getFollowingPost = () => async (dispatch) => {
  try {
    dispatch({
      type: "postofFollowingRequest",
    });

    const { data } = await axios.get("/api/v1/timeLine");

    dispatch({
      type: "postofFollowingSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "postofFollowingFailure",
      payload: error.response.data.message,
    });
  }
};

//getAllUsers
export const getAllUsers =
  (name = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: "allUsersRequest",
      });

      const { data } = await axios.get(`/api/v1/users?name=${name}`);

      dispatch({
        type: "allUsersSuccess",
        payload: data.users,
      });
    } catch (error) {
      dispatch({
        type: "allUsersFailure",
        payload: error.response.data.message,
      });
    }
  };

//Get My Posts
export const getMyPosts = () => async (dispatch) => {
  try {
    dispatch({
      type: "myPostRequest",
    });

    const { data } = await axios.get("/api/v1/my/posts");

    dispatch({
      type: "myPostSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "myPostFailure",
      payload: error.response.data.message,
    });
  }
};

//Logout User
export const logOutUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LogOutUserRequest",
    });

    await axios.get("/api/v1/loggedOut");

    dispatch({
      type: "LogOutUserSuccess",
    });
  } catch (error) {
    dispatch({
      type: "LogOutUserFailure",
      payload: error.response.data.message,
    });
  }
};

//Register User
export const registerUser =
  (name, email, password, avatar) => async (dispatch) => {
    try {
      dispatch({
        type: "RegisterRequest",
      });

      const { data } = await axios.post(
        "/api/v1/register",
        { name, email, password, avatar },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      dispatch({
        type: "RegisterSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "RegisterFailure",
        payload: error.response.data.message,
      });
    }
  };

//Update Profile
export const updateProfile = (name, email, avatar) => async (dispatch) => {
  try {
    dispatch({
      type: "UpdateProfileRequest",
    });

    const { data } = await axios.put(
      "/api/v1/update/profile",
      { name, email, avatar },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    dispatch({
      type: "UpdateProfileSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "UpdateProfileFailure",
      payload: error.response.data.message,
    });
  }
};

//Update Password
export const updatePassword =
  (oldPassword, newPassword) => async (dispatch) => {
    try {
      dispatch({
        type: "UpdatePasswordRequest",
      });

      const { data } = await axios.put(
        "/api/v1/update/password",
        { oldPassword, newPassword },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      dispatch({
        type: "UpdatePasswordSuccess",
        payload: data.message,
      });
    } catch (error) {
      dispatch({
        type: "UpdatePasswordFailure",
        payload: error.response.data.message,
      });
    }
  };

//Delete My Profile
export const deleteMyProfile = () => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProfileRequest",
    });

    const { data } = await axios.delete("/api/v1/delete/me");
    dispatch({
      type: "deleteProfileSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteProfileFailure",
      payload: error.response.data.message,
    });
  }
};

//Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({
      type: "forgotPasswordRequest",
    });

    const { data } = await axios.post(
      "/api/v1/forgot/password",
      {
        email,
      },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    dispatch({
      type: "forgotPasswordSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "forgotPasswordFailure",
      payload: error.response.data.message,
    });
  }
};

//Reset Password
export const resetPassword = (token, password) => async (dispatch) => {
  try {
    dispatch({
      type: "resetPasswordRequest",
    });

    const { data } = await axios.put(
      `/api/v1/password/reset/${token}`,
      {
        password,
      },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    dispatch({
      type: "resetPasswordSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "resetPasswordFailure",
      payload: error.response.data.message,
    });
  }
};

//Get User Posts
export const getUserPosts = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "userPostRequest",
    });

    const { data } = await axios.get(`/api/v1/userPosts/${id}`);

    dispatch({
      type: "userPostSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "userPostFailure",
      payload: error.response.data.message,
    });
  }
};

//Get User Profile
export const getUserProfile = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "userProfileRequest",
    });

    const { data } = await axios.get(`/api/v1/user/${id}`);

    dispatch({
      type: "userProfileSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "userProfileFailure",
      payload: error.response.data.message,
    });
  }
};

//Get User Profile
export const followAndUnfollowUser = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "followUserRequest",
    });

    const { data } = await axios.get(`/api/v1/follow/${id}`);

    dispatch({
      type: "followUserSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "followUserFailure",
      payload: error.response.data.message,
    });
  }
};
