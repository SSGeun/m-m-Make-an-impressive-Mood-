var express = require('express');
var router = express.Router();

var filter = require('../controllers/filterController');

// 필터 백업
router.post('/filters/backUp', filter.filterBackUp);

// 필터 정보 get
router.post('/filters/filterInfo', filter.filterInfo);

module.exports = router;