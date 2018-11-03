/**
 * 用户相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');

/**
 * 调用微信登录
 */
function loginByWeixin() {

  let code = null;
  let userInfo = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      console.log("######################## wx login, get code")
      code = res.code;
      return util.getUserInfo();
    }).then((res) => {
      console.log("######################## get user info")
      console.log(res)
      userInfo = res.userInfo
      return util.getOpenId(code);
    }).then((res)=>{
      console.log("######################## get open id")
      console.log(res)
      if (res.data.openid) {
        var body = {};
        userInfo.openid = res.data.openid;
        userInfo.session_key = res.data.session_key;
        userInfo.code = code;
        body.ThirdPartyInfo = {
          "CustomerTypeCodeId": 2,
          "ThirdPartyId": res.data.openid,
          "NickName": userInfo.nickName,
          "AvatarUrl": userInfo.avatarUrl,
          "Gender": userInfo.gender
        };
        return util.loginToANT(body);
      }
    }).then((res)=>{
      console.log("######################### login ")
      console.log(res);
      if (res.data && res.data.Token){
        wx.setStorageSync('userInfo', userInfo);
        wx.setStorageSync('token', res.data.Token);
        console.log("######################### login dd ")
        res.data.userInfo = userInfo;
        resolve(res);


      }else{
        reject();
      }
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {

      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });

    } else {
      reject(false);
    }
  });
}


module.exports = {
  loginByWeixin,
  checkLogin,
};











