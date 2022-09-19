const Post = require("../models/Post");
const User = require("../models/User");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists" });
    }

    if (avatar) {
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });

      user = await User.create({
        name,
        email,
        password,
        avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
      });
    } else {
      user = await User.create({
        name,
        email,
        password,
        avatar: {
          public_id: "avatars/ky3dlju7njtxfgwgcqja",
          url: "https://res.cloudinary.com/dpbtri3o8/image/upload/v1659418572/avatars/ky3dlju7njtxfgwgcqja.jpg",
        },
      });
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 30 * 1000),
      httpOnly: true,
    };

    var otp = Math.floor(1000 + Math.random() * 9000);
    const message = `Your OTP is: \n\n ${otp} \n `;

    sendEmail({
      email: user.email,
      subject: "OTP Verification",
      message,
    });

    res
      .status(201)
      .cookie("token", token, options)
      .json({
        success: true,
        user,
        token,
        message: `Email sent to ${user.email}`,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password")
      .populate("posts followers following");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    user.loginStatus = true;

    await user.save();

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 30 * 1000),
      httpOnly: true,
    };

    var otp = Math.floor(1000 + Math.random() * 9000);
    const message = `Your OTP is: \n\n ${otp} \n `;

    sendEmail({
      email: user.email,
      subject: "OTP Verification",
      message,
    });

    res
      .status(200)
      .cookie("token", token, options)
      .json({
        success: true,
        user,
        token,
        message: `Email sent to ${user.email}`,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Log Out
exports.loggedOut = async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User does not exist",
        });
      }

      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Incorrect Password",
        });
      }
    if(user.loginStatus == true){
      user.loginStatus = false;
      await user.save();
      res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logged Out",
      });
    }else{
      return res.status(400).json({
        success: false,
        message: "You are Already Logged Out..",
      });
    }
    } else {
      return res.status(400).json({
        success: false,
        message: "Email & Password required..",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Update Password
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { oldPassword, newPassword } = req.body;

    const isMatch = await user.matchPassword(oldPassword);

    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Please Provide Old & New Password",
      });
    }

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { name, email, avatar } = req.body;
    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (avatar) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      user.avatar.public_id = myCloud.public_id;
      user.avatar.url = myCloud.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Follow User
exports.followUser = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id);
    const userToFollow = await User.findById(req.params.id);

    if (req.params.id.toString() == req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Action Blocked",
      });
    }

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (loggedInUser.following.includes(req.params.id)) {
      const indexLoggedInUser = loggedInUser.following.indexOf(req.params.id);
      const indexToFollowUser = userToFollow.followers.indexOf(req.user._id);

      loggedInUser.following.splice(indexLoggedInUser, 1);
      userToFollow.followers.splice(indexToFollowUser, 1);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User Followed",
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

//Remove Follower
exports.removeFollower = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id);
    const followerToRemove = await User.findById(req.params.id);

    if (req.params.id.toString() == req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Action Blocked",
      });
    }

    if (!followerToRemove) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (loggedInUser.followers.includes(req.params.id)) {
      const indexLoggedInUser = loggedInUser.followers.indexOf(req.params.id);
      const indexRemoveFollower = loggedInUser.followers.indexOf(req.user._id);

      loggedInUser.followers.splice(indexLoggedInUser, 1);
      followerToRemove.following.splice(indexRemoveFollower, 1);

      await loggedInUser.save();
      await followerToRemove.save();

      res.status(200).json({
        success: true,
        message: "Follower removed",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Follower not found",
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

//Delete My Profile
exports.deleteMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const userId = user._id;

    // Removing Avatar from cloudinary
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    await user.remove();

    // Logout user after deleting profile

    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    // Delete all posts of the user
    for (let i = 0; i < posts.length; i++) {
      const post = await Post.findById(posts[i]);
      await cloudinary.v2.uploader.destroy(post.image.public_id);
      await post.remove();
    }

    // Removing User from Followers Following
    for (let i = 0; i < followers.length; i++) {
      const follower = await User.findById(followers[i]);

      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);
      await follower.save();
    }

    // Removing User from Following's Followers
    for (let i = 0; i < following.length; i++) {
      const follows = await User.findById(following[i]);

      const index = follows.followers.indexOf(userId);
      follows.followers.splice(index, 1);
      await follows.save();
    }

    // removing all comments of the user from all posts
    const allPosts = await Post.find();

    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.findById(allPosts[i]._id);

      for (let j = 0; j < post.comments.length; j++) {
        if (post.comments[j].user === userId) {
          post.comments.splice(j, 1);
        }
      }
      await post.save();
    }
    // removing all likes of the user from all posts

    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.findById(allPosts[i]._id);

      for (let j = 0; j < post.likes.length; j++) {
        if (post.likes[j] === userId) {
          post.likes.splice(j, 1);
        }
      }
      await post.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//My Profile
exports.myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "posts followers following"
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "posts followers following"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      name: { $regex: req.query.name, $options: "i" },
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get My Posts
exports.getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = [];

    for (i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i]).populate(
        "owner likes comments.user"
      );
      posts.push(post);
    }

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get User Posts
exports.getUserPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const posts = [];

    for (i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i]).populate(
        "owner likes comments.user"
      );
      posts.push(post);
    }

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetPasswordToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetPasswordToken}`;

    const message = `Reset your password by clicking on link: \n\n ${resetUrl} \n Valid for 10 min`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset Password",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is Invalid or Expired",
      });
    }

    user.password = req.body.password;

    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Reset successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
