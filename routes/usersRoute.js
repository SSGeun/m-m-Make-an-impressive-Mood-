var express = require('express');
var router = express.Router();

var user = require('../controllers/userController');

// 사용자 등록
router.post('/users/signUp', user.singUp);

// 로그인
router.post('/users/login', user.login);

// isLogin
router.post('/users/isLogin', user.isLogin);

// userInfo
router.post('/users/userInfo', user.userInfo);

// 회원정보 수정
router.post('/users/update', user.updateUser);

// 회원 탈퇴
router.post('/users/delete', user.deleteUser);

// 프로필 사진 등록
router.post('/users/profile', user.profileImage);

// user Text
router.post('/users/userText', user.userText);

// user data load
router.get('/users/load', user.userDataLoad);

// Login User Data Load
router.post('/users/loginUserDataLoad', user.loginUserDataLoad);

// 팔로우 푸시 알림
router.post('/users/followPushMessage', user.followPushMessage);

// Follow
router.post('/users/follow', user.follow);

// Follow Cancel
router.post('/users/followCancel', user.followCancel);

module.exports = router;