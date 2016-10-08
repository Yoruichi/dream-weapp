var util = require('../../../../utils/util.js')
Page({
  data: {
    toastStatus: true,
    toasContent:"默认",
    dreamTime:'',
    imageList:[]
  },
  onLoad: function(options) {
    this.setData({dreamTime:util.dateFormat(new Date(),'dd/MM/yyyy hh')})
    // Do some initialize when page load.
  },
  onReady: function() {
    // Do something when page ready.
  },
  onShow: function() {
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  onPullDownRefresh: function() {
    // Do something when pull down
  },
  setLoading: function(){
      this.openToast("发布成功");
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      success: function (res) {
        console.log(res)
        var list = that.data.imageList;
        list.push(res.tempFilePaths);
        that.setData({
          imageList: list
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
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
  }
})