//index.js
//获取应用实例
var app = getApp()
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
          if(data.succ) {
            app.globalData = {jSessionId:data.message, globalUrlHeader:'http://localhost:8079/',isLogin:true}
            wx.setStorageSync('sessionId', data.message)
            wx.navigateBack()
            console.log('login succ, will be back to preview page...')
          }
        }
      })
  }
})
