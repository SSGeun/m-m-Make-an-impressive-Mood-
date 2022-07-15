var User = require("../models/User");
var Follow = require("../models/Follow");
var userController = {};

var fs = require('fs-extra'); // 파일을 복사하거나 디렉토리 복사하는 모듈
var formidable = require('formidable'); // form 태그 데이터들을 가져오는 모듈

var crypto = require('crypto');   // userPW 암호화를 위해 crypto 내장 모듈 사용

var FCM = require('fcm-node');
var serverKEY = 'AAAA3_fNNWo:APA91bHAbuComfhv1otuvUo0zdd8Va6YFQAqwraCH5zIqvPxBSgU7f15qa8fBUgnfsMc1jzLtIUpcs29wHkCBVqWisKYy8IPAFlARxESAmH5fNpWYVi4HMwTtTVevYW_ZKYHS6qSgnqC';
var fcm = new FCM(serverKEY);


function success(res, user) {
  res.json(user);
}

function userSuccess(res, user) {

  res.json(user);
}

function fail(res, err, errorcode) {
  res.json({
    resultCode: errorcode,
    err: err
  });
}

// 로그아웃 메시지
function logoutMessage(res, logoutCode) {
  res.json({
    logoutCode: logoutCode
  });
}

function loginCheck(res, isLogin) {

  res.json({
    isLogin: isLogin
  });
}

function imageSaveSuccess(res, filePath) {

  res.json({
    filePath: filePath
  });
}

function followMessage(res, followCode) {

  res.json({
    followCode: followCode
  })
}

function followCancelMessage(res, followCancelCode) {

  res.json({
    followCancelCode: followCancelCode
  })
}

// 로그인 세션 확인
userController.isLogin = function (req, res) {

  console.log("\n세션 확인(isLogin) ============================================================================================\n");

  var userID = req.body.userID;

  console.log(userID);
  var isLogin = false;

  User.find({}, function (err, users) {

    if (err) {

      console.log(err);

      errorCode = 0;
      fail(res, err, errorCode);
      return;
    }

    else {

      for (var i = 0; i < users.length; i++) {

        if (users[i].userID == userID) {

          isLogin = true;
          loginCheck(res, isLogin);
        }
      }
    }
  });
};

// userInfo 
userController.userInfo = function (req, res) {

  console.log("\n사용자 정보(User Info) ======================================================================================\n");

  var userID = req.body.userID;

  User.find({}, function (err, users) {

    if (err) {

      console.log(err);

      errorCode = 0;
      fail(res, err, errorCode);
      return;
    }

    else {

      for (var i = 0; i < users.length; i++) {

        if (users[i].userID == userID) {

          success(res, users[i]);
        }
      }
    }
  });
};

// 사용자 등록. 회원가입
userController.singUp = function (req, res) {

  console.log("\n사용자 등록(User Register) ====================================================================================\n");

  var userID = req.body.userID; // 입력받은 사용자 ID
  var userPW = req.body.userPW; // 입력받은 사용자 PW
  var userName = req.body.userName; // 입력받은 사용자 Name

  // 현재 시간에 랜덤 값을 곱해서 문자열 생성
  var salt = Math.round((new Date().valueOf * Math.random())) + "";

  // sha512 알고리즘 사용
  // update: 인자로 평문 비밀번호에 salt를 더한 값을 넘긴다.
  // digest: 인코딩 방식
  var hashPW = crypto.createHash('sha512').update(userPW + salt).digest("hex");

  // 데이터 저장을 위한 User 모델 인스턴스 생성
  var user = new User({ 'userID': userID, 'userPW': hashPW, 'userName': userName, 'salt': salt });

  console.log(`userID: ${userID}`);
  console.log(`userPW: ${userPW}`);
  console.log(`hashPW: ${hashPW}}}`);
  console.log(`userName: ${userName}`);

  // save()로 저장
  user.save(function (err) {
    var errorCode = 0;

    // 회원가입 실패....
    if (err) {
      console.log(err);
      fail(res, err, errorCode);
      return;
    }

    // 회원가입 성공!
    else {
      console.log("회원가입 성공!");
      success(res, user);
    }
  });
};

// 사용자 인증. (로그인 시) 입력받은 ID, PW 확인
userController.login = function (req, res) {

  console.log("\n사용자 인증(User Authentication) ==============================================================================\n");

  var userID = req.body.userID; // 입력받은 사용자 ID 
  var userPW = req.body.userPW; // 입력받은 사용자 PW
  var token = req.body.token; // 사용자 Token

  var errorCode = 0;  //  0: 로그인 성공
  // -1: 그 외.. 에러..
  // -2: 없는 아이디
  // -3: 아이디 OK, 비밀번호 X

  User.find({}, function (err, users) {

    if (err) {

      console.log(err);

      errorCode = -1;
      fail(res, err, errorCode);
      return;
    }

    else {

      var checkNum = 0;

      for (var i = 0; i < users.length; i++) {

        if (users[i].userID == userID) {

          var salt = users[i].salt;
          var hashPW = crypto.createHash('sha512').update(userPW + salt).digest("hex");

          checkNum = 1;

          // ID, PW Perfect!!
          if (users[i].userPW == hashPW) {

            User.update({ 'userID': userID }, { $set: { 'token': token } }, function (err) {

              if (err) {

                console.log(err);
              }
            });

            console.log(userID + "로그인 성공!!");

            success(res, users[i]);
          }

          // ID OK!! PW... X....
          else {
            console.log("비밀번호 틀렸습니다....");

            errorCode = -3;
            fail(res, err, errorCode);
            return;
          }
        }
      }

      // ID X......
      if (checkNum == 0) {
        console.log("존재하지 않는 아이디....");

        errorCode = -2;
        fail(res, err, errorCode);
        return;
      }
    }
  });
};

// 회원정보 수정
userController.updateUser = function (req, res) {

  console.log("\n회원정보 수정(Update User) ====================================================================================\n");

  var userID = req.body.userID;
  var userName = req.body.userName;
  var userPW = req.body.userPW;
  var basicUserPW = req.body.basicUserPW;

  var errorCode = 0;  // -1: 기존 비밀번호 잘못 입력.
  // 0: 그 외...

  User.find({}, function (err, users) {

    if (err) {

      console.log(err);

      errorCode = 0;
      fail(res, err, errorCode);
      return;
    }

    else {

      for (var i = 0; i < users.length; i++) {

        if (users[i].userID == userID) {

          var salt = users[i].salt;
          var hashPW = crypto.createHash('sha512').update(basicUserPW + salt).digest("hex");

          // ID, PW Perfect!!
          if (users[i].userPW == hashPW) {

            var hashPW = crypto.createHash('sha512').update(userPW + salt).digest("hex");

            User.update({ 'userID': userID }, { $set: { 'userName': userName, 'userPW': hashPW } }, function (err) {

              if (err) {
                console.log(err);

                errorCode = 0;
                fail(res, err, errorCode);
              }
            });

            success(res, users[i]);
          }

          // ID OK!! PW... X....
          else {
            console.log("기존 비밀번호 틀렸습니다......");

            errorCode = -1;
            fail(res, err, errorCode);
            return;
          }
        }
      }
    }
  });
};

// 회원 탈퇴
userController.deleteUser = function (req, res) {

  console.log("\n회원 탈퇴(Delete User) =======================================================================================\n");

  var userID = req.body.userID;

  var logoutCode = 0;

  User.remove({ 'userID': userID }, function (err) {

    if (err) {
      console.log(err);

      errorCode = 0;
      fail(res, err, errorCode);
    }
  });

  console.log("userID: " + userID + " Deleted User");
  logoutMessage(res, logoutCode);
};

// 프로필 사진 등록
userController.profileImage = function (req, res) {

  console.log("\n프로필 사진 등록(Register User Profile Image) =================================================================\n");

  var name = "";

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {

    name = fields.name;
  });


  form.on('end', function (fields, files) {

    for (var i = 0; i < this.openedFiles.length; i++) {

      var temp_path = this.openedFiles[i].path;

      var file_name = this.openedFiles[i].name;

      var new_location = 'public/resources/userProfiles/' + name + '/';

      var photoFilePath = '/resources/userProfiles/' + name + '/' + file_name;

      console.log(photoFilePath);

      fs.unlink(photoFilePath, function (err) {

        if (err) {

          console.log(err);
        }
      })

      fs.copy(temp_path, new_location + file_name, function (err) { // 이미지 파일 저장하는 부분임

        if (err) {

          console.error(err);
        }

        User.update({ 'userID': name }, { $set: { 'profileImage': photoFilePath } }, function (err) {

          if (err) {
            console.log(err);

            errorCode = -1;
            fail(res, err, errorCode);
          }

          imageSaveSuccess(res, photoFilePath);
        });
      });
    }
  });
};

// user Text
userController.userText = function (req, res) {

  console.log("\n사용자 소개글(User Text) =====================================================================================\n");

  var userID = req.body.userID;
  var userText = req.body.userText;

  console.log(userID + ": " + userText);

  User.update({ 'userID': userID }, { $set: { 'userText': userText } }, function (err) {

    if (err) {
      console.log(err);

      errorCode = -1;
      fail(res, err, errorCode);
    }
  });
};

// User Data Load
userController.userDataLoad = function (req, res) {

  console.log("\n사용자 데이터 로드(User Data Load) ============================================================================\n")


  User.find(function (err, users) {

    console.log(users);
    userSuccess(res, users);
  });
};

// One User Data Load
userController.loginUserDataLoad = function (req, res) {

  console.log("\n로그인 사용자 데이터 로드(Login User Data Load) ===============================================================\n")

  var userID = req.body.userID;

  User.findOne({ 'userID': userID }, function (err, user) {

    if (err) {
      console.log(err)
    }

    console.log(user);
    userSuccess(res, user);
  });
};

// 팔로우 푸시 알림
userController.followPushMessage = function (req, res) {

  var followID = req.body.followID;

  var title = "m:m(밈)";
  var body = followID + "님이 새로운 사진을 추가했습니다.";

  Follow.find({ 'followID': followID }, function (err, follows) {

    for (var i = 0; i < follows.length; i++) {

      // 메시지 작성
      var message = {
        "to": follows[i].followerToken,
        "notification": {
          "body": body,
          "title": title
        },
        "data": {
          "name": title,
          "body": body
        }
      };

      // 메시지 전송
      fcm.send(message, function (err) {

        if (err) {
    
          console.log(err);
        }
      });
    }
  });
};

// 팔로우
userController.follow = function (req, res) {
  
  var followID = req.body.followID;
  var followerToken = req.body.followerToken;

  var followCode = 0;

  var follow = new Follow({ 'followID': followID, 'followerToken': followerToken });

  follow.save(function (err) {

    console.log(followID);
    console.log(followerToken);

    if (err) {

      console.log(err);
    }

    User.updateOne({ 'userID': followID }, { $inc: { 'followNum': 1 } }, function (err) {

      if (err) {

        console.log(err);
      }

      followMessage(res, followCode);
    });
  });
};

// 팔로우 취소
userController.followCancel = function (req, res) {
  
  var followID = req.body.followID;
  var followerToken = req.body.followerToken;

  var followCancelCode = 0;

  var follow = new Follow({ 'followID': followID, 'followerToken': followerToken });

  follow.remove(function (err) {

    if (err) {

      console.log(err);
    }

    User.updateOne({ 'userID': followID }, { $inc: { 'followNum': -1 } }, function (err) {

      if (err) {

        console.log(err);
      }

      followCancelMessage(res, followCancelCode);
    });
  });
};

module.exports = userController;
