//app.js
App({
  request:function(o) {
    var url = this.globalData.globalUrlHeader + o.url
    var data = o.data
    var session = this.globalData.jSessionId
    console.log('will request for url ' + o.url)
    wx.request({
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'Cookie':session
      },
      method:'POST',
      url:url,
      data:data,
      success:function(res) {
        console.log('got response for url ' + o.url)
        if(o.succ) {o.succ(res.data)}
      },
      fail:function(res) {
        console.log('request to ' + url + ' failed.')
        if(o.fail){o.fail(res.data)}
      },
      complete:function() {
        if(o.complete && typeof o.complete == 'function') o.complete()
      }
    })
  },
  checkLoginReq: function(o) {
    var that = this
    console.log('will check login')
    this.request({
        url:'op/dreamer/checkLogin',
        succ:function(data){
          console.log('got response for check login.')
          console.log('app got login dreamer info >>> ' + that.globalData.userInfo.nickName)
          if(data && data.succ) {
            that.globalData.userInfo=data.obj.dreamer
            if(o) that.request(o)
          }else{
            console.log('try login again')
            wx.navigateTo({url:'/pages/index/index'})
          }
        },
        fail:function(){
          wx.navigateTo({url:'/pages/index/index'})
        },
        complete:function(){
          if(o.complete && typeof o.complete == 'function') o.complete()
        }
      })
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var sid = wx.getStorageSync('sessionId')
    console.log('got sid from storage is ' + sid)
    if(sid) {
      var that = this
      this.globalData.jSessionId=sid
    } else {
      console.log('not got sid from storge')
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
    globalUrlHeader:'https://wechat.redtea.io/',
    //globalUrlHeader:'http://localhost:8443/',    
    jSessionId:'lalal',
    userInfo:{}
  }
})