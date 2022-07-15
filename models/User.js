var mongoose = require('mongoose');

// User 스키마 정의
// type: 자료형, required: 필수여부, unique: 고유한 값
var UserSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true }, // 사용자 아이디
  userPW: { type: String, required: true }, // 사용자 비밀번호
  userName: { type: String, required: true }, // 사용자 이름
  salt: { type: String, required: true }, // 난수
  profileImage: { type: String, default: '' },  // 사용자 프로필 사진
  userText: { type: String, default: '' },  // 사용자 프로필 텍스트
  token: { type: String, default: '' },    // 사용자 토큰
  followNum: { type: Number, default: 0 } // 팔로우 수
});

// User 모델 정의
module.exports = mongoose.model('User', UserSchema);
