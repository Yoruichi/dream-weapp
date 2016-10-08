//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    testInfo:{},
  },
  //事件处理函数
  bindViewTap: function() {
    wx.redirectTo({
      url: '../src/html_main/html_showdreams/showdreams'
    })
  },
  testName: function(){
    console.log("testName on click");
  },
  onLoad: function () {
    var that = this
    //wx.getStorage()
    wx.request({
      url:app.globalData.globalUrlHeader + "dreamer/login/phone",
      header: {
        'content-type':'application/x-www-form-urlencoded'
      },
      data:'phone=15210890151&password=hhhh',
      method:'POST',
      success:function(res) {
        app.globalData = {jSessionId:res.data.message, globalUrlHeader:'http://localhost:8079/',}
      }
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
