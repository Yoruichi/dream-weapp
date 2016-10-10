var app = getApp()
var util = require('../../../../utils/util.js')
Page({
  data: {
    lastFlush:new Date().getTime(),
    lastFlushSucc:false,
    text: "This is page data.",
    toastStatus: true,
    toasContent:"默认",
    page: 0,
    limit:4,
    dreamsList:new Array()
  },
  onLoad: function(options) {
    app.setPreview({url:'/pages/src/html_main/html_showdreams/showdreams'})
    if(app.globalData.isLogin) {
        this.setData(this.init())
      } else {
        wx.navigateTo({url:'../../../index/index'})
    }
  },
  getDreams:function(p, cb) {
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
    var newData = this.data
    newData.dreamsList = new Array()
    newData.page = 0
    this.getDreams(newData, cb)
    newData.page = newData.page + 1
    newData.lastFlushSucc = true
    return newData
  },
  onReady: function() {
    console.log("dreams page on ready now")
  },
  onShow: function() {
    if(this.data.lastFlushSucc && (new Date().getTime() - this.data.lastFlush) > 5 * 1000) {
      this.setData(this.init())
    }
    console.log("dreams page on show now this.data.dreamList length is " + this.data.dreamsList.length)
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
    console.log( "上拉拉加载更多...." + this.data.page )
    var newData = this.data
    this.getDreams(newData)
    newData.page = newData.page + 1
    this.setData(newData)
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