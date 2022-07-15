var mongoose = require('mongoose');

// Filter 스키마 정의
// type: 자료형, required: 필수여부, unique: 고유한 값
var FilterSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  filterName: { type: String, required: true },
  brightness: { type: Number, default: 0 },
  saturation: { type: Number, default: 1 },
  contrast: { type: Number, default: 1 },
  vignette: { type: Number, default: 0 },
  noise: { type: Number, default: 0 },
  filmburn: { type: Number, default: 0 },
  rCode: { type: Number, default: 0 },
  gCode: { type: Number, default: 0 },
  bCode: { type: Number, default: 0 }
});

// Filter 모델 정의
module.exports = mongoose.model('Filter', FilterSchema);