//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
  },
  onLoad: function () {
    var that = this
    //wx.getStorage()
     app.request({
        url:'dreamer/login/phone',
        data:'phone=15210890151&password=hhhh',
        succ:function(data) {
          if(data && data.succ) {
            app.globalData = {jSessionId:data.message, globalUrlHeader:'http://localhost:8079/',isLogin:true}
            wx.setStorageSync('sessionId', data.message)
            util.sleep(1000)
            wx.navigateBack()
            console.log('login succ, will be back to preview page...')
          } else {
            console.log('login failed.')
          }
        }
      })
  },
  onShow: function () {
    console.log('index is on show')
  },
  onUnload: function() {
    console.log('index is on unload')
  }
})
