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
        if(o.succ) {o.succ(res.data)}
      },
      fail:function(res) {
        console.log('request to ' + url + ' failed.')
        if(o.fail){o.fail(res.data)}
      }
    })
  },
  checkLoginReq: function(o) {
    var that = this
    this.request({
        url:'op/dreamer/checkLogin',
        succ:function(data){
          if(data && data.succ) {
            that.globalData.userInfo=data.obj.dreamer
            //if(o.succ) o.succ(o.succParams)
            that.request(o)
          }else{
            console.log('try login again')
            //if(o.fail) o.fail(o.failParams)
            wx.navigateTo({url:'/pages/index/index'})
          }
        },
        fail:function(){
          //if(o.fail) o.fail(o.failParams)
          wx.navigateTo({url:'/pages/index/index'})
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
      //this.checkLogin()
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
    globalUrlHeader:'http://localhost:8079/',
    jSessionId:'lalal',
    userInfo:{}
  }
})