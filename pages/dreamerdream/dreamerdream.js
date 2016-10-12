Page({
  data: {
    text: "This is page data.",
    toastStatus: true,
    toasContent:"默认",
    nowpage: 0,
    ismyself: false,
    dreamsList:[{
      content:"又做了一个稀里糊涂的梦，啥玩意",
      imageList:["../../imgs/icon64_appwx_logo.png"]
    },{
      content:"又做了一个稀里糊涂的梦，啥玩意，哎呦喂，来吧。。。。",
      imageList:[]
    }]
  },
  onLoad: function(options) {
    //this.init();
  },
  init: function(){
      //TOOD 请求梦的数据，0页清空，添加，其他追加内容
      var newData = this.data;
      var page = newData.nowpage;
      page = page == undefined ? 0 : page;
      if(page == 0){
        newData.dreamsList = [];

      }else{
        //请求分页数据
      }
      page++;
      newData.nowpage = page;
      this.setData(newData);
  },
  onReady: function() {
    // Do something when page ready.
  },
  onShow: function() {
      var that = this;
      wx.getStorage({
          key: "ismyself",
          function(ret){
            var isMy = res.data;
            var obj = {
                ismyself: isMy
            }
            that.setData(obj);
          }
      })
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
    var obj = {nowpage: 0};
    this.setData(obj);
    this.init();
  },
  // Event handler.
  showContent: function(obj) {
      console.log("内容展开伸缩");
  },
  do_del: function(dreamer_id){
      this.openToast("删除成功");
  },
  do_share: function(dreamer_id){
      this.openToast("分享成功");
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