var app = getApp()
var util = require('../../../../utils/util.js')
Page({
  data: {
    text: "This is page data.",
    toastStatus: true,
    toasContent:"默认",
    nowpage: 0,
    limit:10,
    dreamsList:new Array()
  },
  onLoad: function(options) {
    this.init();
    //console.log('show dreams is onload')
  },
  init: function(){
      //TOOD 请求梦的数据，0页清空，添加，其他追加内容
      var newData = this.data
      var page = newData.nowpage
      page = page == undefined ? 0 : page
      app.sendRequest({
        url:'op/messageView/check',
        data:'limit='+newData.limit+'&index='+newData.nowpage * newData.limit,
        succ:function(data){
            data.obj.forEach(function(e){
              e.dreamMessageView.timeshow = util.timeInterval(e.dreamMessageView.messageCreateTime)
              newData.dreamsList.push(e)
            })
        }
      })
      page++
      newData.nowpage = page
      this.setData(newData)
  },
  onReady: function() {
    // Do something when page ready.
  },
  onShow: function() {
    // Do something when page show.
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  //下拉刷新
  onPullDownRefresh: function() {
    var obj = {nowpage: 0, limit:10};
    this.setData(obj);
    this.init();
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
      current: current,
      urls: this.data.imageList
    })
  }
})