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
    noLoading:false,
    scrollTop:1
  },
  back:function() {
    if(this.data.scrollTop == 0) {
      this.setData({scrollTop:1})
    } else {
      this.setData({scrollTop:0})
    }
  },
  loadingChange:function(){
    this.setData({'noLoading':true})
  },
  onLoad: function(options) {
    console.log('dreams is on load now')
  },
  getDreams:function(p, cb) {
    var that = this
    app.checkLoginReq({
      url:'op/messageView/check',
      data:'limit=' + p.limit + '&index=' + p.page * p.limit,
      succ:function(data){
        if(data && data.succ) {
          data.obj.forEach(function(e){
            var f = e.greaterList.find(function(g){return g.dreamerId == app.globalData.userInfo.id})
            if(f){e.isGreated = true} else {e.isGreated = false}
            e.dreamMessageView.timeshow = util.timeInterval(e.dreamMessageView.messageCreateTime)
            e.dreamMessageView.imageList = e.dreamMessageView.image_url ? e.dreamMessageView.image_url.split(',') : []
            p.dreamsList.push(e)
          })
          p.page = p.page + 1
          p.lastFlush = new Date().getTime()
          p.noLoading = true
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
    this.setData({noLoading:false})
    this.back()
    var newData = this.data
    newData.dreamsList = new Array()
    newData.page = 0
    //app.checkLoginReq({succ:this.getDreams, succParams:{newData, cb}, fail:wx.navigateTo, failParams:{url:'/pages/index/index'}})
    this.getDreams(newData, cb)
  },
  onReady: function() {
    console.log("dreams page on ready now")
  },
  onShow: function() {
    console.log("dreams page on show now this.data.lastFlush time is " + this.data.lastFlush)
    app.setPreview({url:'/pages/src/html_main/html_showdreams/showdreams'})
    if((new Date().getTime() - this.data.lastFlush) > 5 * 1000) {
      this.init()
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
  checkDreamer: function(e) {
    console.log('check dreamer info for dreamer by id ' + util.writeObj(e))
    console.log('check dreamer info for dreamer by id ' + e.currentTarget.dataset.did)
  },
  do_well: function(e){
    var mid = e.currentTarget.dataset.mid
    var that = this
    app.checkLoginReq({
      url:'op/greater/like',
      data:'messageId=' + mid,
      succ:function(data) {
        if(data.succ) {
          that.openToast("点赞成功");
          var ds = that.data.dreamsList
          var dmv = ds.find(function(d){return d.dreamMessageView.messageId == mid})
          dmv.isGreated = true
          dmv.greaterList.push({dreamerId:app.globalData.userInfo.id,greaterId:data.obj.id})
          that.setData({dreamsList:ds})
        } else {
          that.openToast("开了个小差");
        }
      }
    })
  },
  undo_well: function(e){
     var mid = e.currentTarget.dataset.mid
    var that = this
    app.checkLoginReq({
      url:'op/greater/unlike',
      data:'messageId=' + mid,
      succ:function(data) {
        if(data.succ) {
          that.openToast("取消成功");
          var ds = that.data.dreamsList
          var dmv = ds.find(function(d){return d.dreamMessageView.messageId == mid})
          dmv.isGreated = false
          util.remove(dmv.greaterList,function(d){return d.dreamerId == app.globalData.userInfo.id})
          that.setData({dreamsList:ds})
        } else {
          that.openToast("开了个小差");
        }
      }
    })
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