var mongoose = require('mongoose');

// Post 스키마 정의
// type: 자료형, required: 필수여부, unique: 고유한 값
var PostSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  photoFilePath: { type: String, required: true },
  filterID: { type: String },
  postDate: { type: String, required: true },
  tag1: { type: String },
  tag2: { type: String },
  tag3: { type: String },
  tag4: { type: String },
  tag5: { type: String },
  likingNum: { type: Number, default: 0 }
});

// Post 모델 정의
module.exports = mongoose.model('Post', PostSchema);