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
    console.log('index is on load')
  },
  onShow: function () {
    console.log('index is on show')
    var that = this
    app.request({
      url:'dreamer/login/phone',
      data:'phone=15210890151&password=hhhh',
      succ:function(data) {
        if(data && data.succ) {
          app.globalData.jSessionId = data.message
          app.globalData.userInfo = data.obj
          wx.setStorageSync('sessionId', data.message)
          util.sleep(5000)
          console.log('login succ, will be back to preview page...')
          //wx.navigateBack()
        } else {
          console.log('login failed.')
        }
      }
    })
  },
  onUnload: function() {
    console.log('index is on unload')
  }
})
