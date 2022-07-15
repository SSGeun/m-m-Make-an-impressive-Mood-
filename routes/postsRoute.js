var express = require('express');
var router = express.Router();

var post = require('../controllers/postController');

// 게시물 등록
router.post('/posts/register', post.registerPost);

// 게시물 수정
router.post('/posts/update', post.updatePost);

// 게시물 삭제
router.post('/posts/delete', post.deletePost);

// Post Data Load
router.get('/posts/load', post.postDataLoad);

// User Feed Load
router.post('/posts/userFeedLoad', post.userFeedLoad);

// 게시물 좋아요
router.post('/posts/likingPost', post.postLiking);

// 게시물 좋아요 취소
router.post('/posts/likingCancelPost', post.postLikingCancel);

// 인기순 게시물 조회
router.get('/posts/popularPostSort', post.popularPostSort);

// 사용자 ID, 태그 검색
router.post('/posts/userIDORTagSearch', post.userIDORTagSearch);

// 인기 태그 Top4
router.get('/posts/popularTagTog4', post.popularTagTog4);

// 인기 태그 게시물 조회
router.post('/posts/clickTagPost', post.clickTagPost);

module.exports = router;