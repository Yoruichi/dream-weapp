//app.js
App({
  request:function(o) {
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
    var sid = wx.getStorageSync('sessionId')
    if(sid) {
      this.globalData = {isLogin:true,
        globalUrlHeader:'http://localhost:8079/',
        jSessionId:sid,preview:{}}
    }
  },
  preview:{},
  getPreview:function() {
    return this.preview
  },
  setPreview:function(p) {
    this.preview = p
  },
  globalData:{
    isLogin:false,
    globalUrlHeader:'http://localhost:8079/',
    jSessionId:'lalal'
  }
})