var mongoose = require('mongoose');

// Follow 스키마 정의
// type: 자료형, required: 필수여부, unique: 고유한 값
var FollowSchema = new mongoose.Schema({
  followID: { type: String, required: true },   
  followerToken: { type: String, required: true }
});

// Follow 모델 정의
module.exports = mongoose.model('Follow', FollowSchema);