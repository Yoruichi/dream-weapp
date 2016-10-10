var app = getApp()
var util = require('../../../../utils/util.js')
Page({
  data: {
    lastFlush:0,
    text: "This is page data.",
    toastStatus: true,
    toasContent:"默认",
    page: 0,
    limit: 4,
    dreamsList:new Array(),
    scrollTop:1
  },
  back:function() {
    if(this.data.scrollTop == 0) {
      this.setData({scrollTop:1})
    } else {
      this.setData({scrollTop:0})
    }
  },
  onLoad: function(options) {
    console.log('dreams is on load now')
    if(app.globalData.isLogin) {
      this.init()
    }
  },
  getDreams:function(p, cb) {
    var that = this
    app.request({
      url:'op/messageView/check',
      data:'limit=' + p.limit + '&index=' + p.page * p.limit,
      succ:function(data){
        if(data && data.succ) {
          data.obj.forEach(function(e){
            e.dreamMessageView.timeshow = util.timeInterval(e.dreamMessageView.messageCreateTime)
            e.dreamMessageView.imageList = e.dreamMessageView.image_url ? e.dreamMessageView.image_url.split(',') : []
            p.dreamsList.push(e.dreamMessageView)
          })
          p.page = p.page + 1
          p.lastFlush = new Date().getTime()
          that.setData(p)
        }else{
          console.log(data ? data.message : 'not login')
        }
        if(cb && typeof cb == 'function') {
          cb()
        }
      }
    })
  },
  init: function(cb){
    //TOOD 请求梦的数据，0页清空，添加，其他追加内容
    this.back()
    var newData = this.data
    newData.dreamsList = new Array()
    newData.page = 0
    newData.scrollTop = 1
    this.getDreams(newData, cb)
  },
  onReady: function() {
    console.log("dreams page on ready now")
  },
  onShow: function() {
    console.log("dreams page on show now this.data.lastFlush time is " + this.data.lastFlush)
    app.setPreview({url:'/pages/src/html_main/html_showdreams/showdreams'})
    if(app.globalData.isLogin) {
      if(this.data.lastFlush == 0 || (new Date().getTime() - this.data.lastFlush) > 5 * 1000) {
        this.init()
      }
    } else {
      wx.navigateTo({url:'../../../index/index'})
    }
  },
  onHide: function() {
    console.log("dreams page on hide now")
  },
  onUnload: function() {
    // Do something when page close.
  },
  //下拉刷新
  onPullDownRefresh: function() {
    this.init(wx.stopPullDownRefresh());
  },
  pullUpLoad: function( e ) {
    console.log( "上拉拉加载更多...." + this.data.scrollTop )
    var newData = this.data
    this.getDreams(newData)
  },
  // Event handler.
  showContent: function(obj) {
      console.log("内容展开伸缩");
  },
  do_well: function(dreamer_id){
      this.openToast("点赞成功");
  },
  do_share: function(dreamer_id){
      this.openToast("分享成功");
  },
  do_reply: function(dreamer_id){
      this.openToast("内容回复成功");
  },
  openToast: function(content){
      var obj = {};
      obj["toasContent"] = content;
      obj["toastStatus"] = false;
      this.setData(obj);
  },
  toastChange: function(){
      var obj = {};
      obj["toastStatus"] = true;
      this.setData(obj);
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current:current,
      urls:[current]
    })
  }
})