//app.js
App({
  sendRequest:function(o) {
    var url = this.globalData.globalUrlHeader + o.url
    var data = o.data
    var session = this.globalData.jSessionId
    wx.request({
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'Cookie':session
      },
      method:'POST',
      url:url,
      data:data,
      success:function(res) {
        o.succ(res.data)
      },
      fail:function(res) {
        console.log('request to ' + url + ' failed.')
      }
    })
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:{},
    globalUrlHeader:'http://localhost:8079/',
    jSessionId:'lalal'
  }
})