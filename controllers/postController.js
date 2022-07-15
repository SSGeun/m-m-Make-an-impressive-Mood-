var Post = require("../models/Post");
var Filter = require("../models/Filter");

var fs = require('fs-extra'); // 파일을 복사하거나 디렉토리 복사하는 모듈
var formidable = require('formidable'); // form 태그 데이터들을 가져오는 모듈
var mongodb = require('mongodb');

var postController = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function postSuccess(res, post) {

  console.log(post);
  res.json(post);
}

function fail(res, err, errorcode) {

  res.json({

    resultCode: errorcode,
    err: err
  });
}

// 게시물 삭제 메시지
function deletePostMessage(res, deletePostCode) {

  res.json({

    deletePostCode: deletePostCode
  });
}

// 게시물 수정 메시지
function updatePostMessage(res, updatePostCode) {

  res.json({

    updatePostCode: updatePostCode
  });
}

// 게시물 좋아요 메시지
function postLikingMessage(res, postLikingResultCode) {

  res.json({

    postLikingResultCode: postLikingResultCode
  })
}

// 게시물 좋아요 취소 메시지
function postLikingCancelMessage(res, postLikingCancelResultCode) {

  res.json({

    postLikingCancelResultCode: postLikingCancelResultCode
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// User Feed load
postController.userFeedLoad = function (req, res) {

  console.log("\n사용자 피드 로드(User Feed Load) ==============================================================================\n");

  var userID = req.body.userID;

  console.log(userID);

  Post.find({ 'userID': userID }, function (err, posts) {

    if (err) {
      console.log(err);
    }

    console.log(posts);
    postSuccess(res, posts);
  });
};

// 게시물 등록
postController.registerPost = function (req, res) {

  console.log("\n게시물 등록(Post Register) ====================================================================================\n");

  var userID = "";
  var filterID = "";
  var postDate = "";

  var tag1 = "";
  var tag2 = "";
  var tag3 = "";
  var tag4 = "";
  var tag5 = "";

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {

    userID = fields.userID;
    filterID = fields.filterID;
    postDate = fields.postDate;
    tag1 = fields.tag1;
    tag2 = fields.tag2;
    tag3 = fields.tag3;
    tag4 = fields.tag4;
    tag5 = fields.tag5;
  });


  form.on('end', function (fields, files) {

    for (var i = 0; i < this.openedFiles.length; i++) {

      var temp_path = this.openedFiles[i].path;

      var file_name = this.openedFiles[i].name;

      var new_location = 'public/resources/images/' + userID + '/';

      var photoFilePath = '/resources/images/' + userID + '/' + file_name;

      console.log(photoFilePath);

      fs.copy(temp_path, new_location + file_name, function (err) { // 이미지 파일 저장하는 부분임

        if (err) {

          console.error(err);
        }
      });

      // 데이터 저장을 위한 Post 모델 인스턴스 생성
      var post = new Post({ 'userID': userID, 'photoFilePath': photoFilePath, 'filterID': filterID, 'postDate': postDate, 'tag1': tag1, 'tag2': tag2, 'tag3': tag3, 'tag4': tag4, 'tag5': tag5 });

      console.log(`userID: ${userID}`);
      console.log(`photoFilePath: ${photoFilePath}`);
      console.log(`filterID: ${filterID}`);
      console.log(`postDate: ${postDate}`);
      console.log('');

      console.log(`tag1: ${tag1}`);
      console.log(`tag2: ${tag2}`);
      console.log(`tag3: ${tag3}`);
      console.log(`tag4: ${tag4}`);
      console.log(`tag5: ${tag5}`);

      // save()로 게시물 저장
      post.save(function (err) {
        var errorCode = 0;

        // 게시물 등록 실패..
        if (err) {
          console.log(err);
          fail(res, err, errorCode);
          return;
        }

        postSuccess(res, post);
      });
    }

  });
};

// Post Data Load
postController.postDataLoad = function (req, res) {

  console.log("\n게시물 데이터 로드(Post Data Load) ============================================================================\n")


  Post.find(function (err, posts) {

    console.log(posts);
    postSuccess(res, posts);
  });
};

// 게시물 삭제
postController.deletePost = function (req, res) {

  console.log("\n게시물 삭제(Delete Post) =======================================================================================\n");

  var _id = req.body._id;
  var photoFilePath = req.body.photoFilePath;

  var temp = "public/" + photoFilePath;
  console.log(temp);
  console.log(photoFilePath);

  var deletePostCode = 0;

  fs.unlink(temp, function (err) {

    if (err) {

      console.log(err);
    }
  });

  Post.remove({ '_id': new mongodb.ObjectID(_id) }, function (err) {

    if (err) {
      console.log(err);

      errorCode = 0;
      fail(res, err, errorCode);
    }
  });

  deletePostMessage(res, deletePostCode);

};

// 게시물 수정
postController.updatePost = function (req, res) {

  console.log("\n게시물 수정(Update Post) =======================================================================================\n");

  var _id = req.body._id;
  var postDate = req.body.postDate;
  var tag1 = req.body.tag1;
  var tag2 = req.body.tag2;
  var tag3 = req.body.tag3;
  var tag4 = req.body.tag4;
  var tag5 = req.body.tag5;

  var updatePostCode = 0;

  Post.updateOne({ '_id': new mongodb.ObjectID(_id) }, { $set: { 'postDate': postDate, 'tag1': tag1, 'tag2': tag2, 'tag3': tag3, 'tag4': tag4, 'tag5': tag5 } }, function (err) {

    if (err) {

      console.log(err);
    }

    updatePostMessage(res, updatePostCode);
  });
};

// 게시물 좋아요
postController.postLiking = function (req, res) {

  console.log("\n게시물 좋아요 (Liking Post) ====================================================================================\n");

  var _id = req.body._id;

  Post.updateOne({ '_id': new mongodb.ObjectID(_id) }, { $inc: { 'likingNum': 1 } }, function (err) {

    if (err) {

      console.log(err);
    }

    Post.findOne({ '_id': _id }, function (err, post) {

      if (err) {

        console.log(err);
      }

      postSuccess(res, post);
    });
  });
};

// 게시물 좋아요 취소
postController.postLikingCancel = function (req, res) {

  console.log("\n게시물 좋아요 취소 (Liking Cancel Post) ========================================================================\n");

  var _id = req.body._id;

  Post.updateOne({ '_id': new mongodb.ObjectID(_id) }, { $inc: { 'likingNum': -1 } }, function (err, post) {

    if (err) {

      console.log(err);
    }   
    
    Post.findOne({ '_id': _id }, function (err, post) {

      if (err) {

        console.log(err);
      }

      postSuccess(res, post);
    });
  });
};

// 게시물 인기순 정렬
postController.popularPostSort = function (req, res) {

  console.log("\n인기순 게시물 조회 (Popular Post Sort) =========================================================================\n");

  Post.find().sort({ 'likingNum': -1 }).exec(function (err, posts) {

    if (err) {

      console.log(err);
    }

    console.log(posts);
    postSuccess(res, posts);
  });
};

// UserID, Tag 검색
postController.userIDORTagSearch = function (req, res) {

  console.log("\nuserID OR Tag 검색 (userID OR Tag Search) =====================================================================\n");

  var searchWord = req.body.searchWord;

  Post.find({ $or: [{ 'userID': { $regex: searchWord } }, { 'tag1': { $regex: searchWord } }, { 'tag2': { $regex: searchWord } }, { 'tag3': { $regex: searchWord } }, { 'tag4': { $regex: searchWord } }, { 'tag5': { $regex: searchWord } }] }, function (err, posts) {

    if (err) {

      console.log(err);
    }

    postSuccess(res, posts);
  });
};

// 인기 태그 Top 4
postController.popularTagTog4 = function (req, res) {

  console.log("\n인기 태그 Top 4 (Popular Tag Top 4) ===========================================================================\n");

  Post.find().sort({ 'likingNum': -1 }).limit(4).exec(function (err, posts) {

    if (err) {

      console.log(err);
    }

    postSuccess(res, posts);
  });
};

// 클릭 태그 게시물 조회
postController.clickTagPost = function (req, res) {

  console.log("\n인기 태그 게시물 조회 (Popular Tag Post Search) ================================================================\n");

  var clickTag = req.body.clickTag;

  Post.find({ $or: [{ 'tag1': clickTag }, { 'tag2': clickTag }, { 'tag3': clickTag }, { 'tag4': clickTag }, { 'tag5': clickTag }] }).sort({ 'likingNum': -1 }).exec(function (err, posts) {

    if (err) {

      console.log(err);
    }

    postSuccess(res, posts);
  });
}



module.exports = postController;