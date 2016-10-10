var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    actionSheetHidden:false,
    actionSheedItems:[{s:'公开的', v:'PUBLIC'}, {s:'私密的', v:'PRIVATE'}],
    toastStatus: true,
    toasContent:"默认",
    dreamTime:'',
    dreamTypeContent:'',
    dreamLocationContent:'',
    content:'',
    dreamTypeContentHolder:'慵懒',
    dreamLocationContentHolder:'柔软的沙发上',
    contentHolder:'我化身成了一只猫，你呢？',
    type:'PUBLIC',
    imageCount:1,
    imageList:[]
  },
  bindItemTap:function(e) {
     this.setData({type:e.currentTarget.dataset.name,actionSheetHidden:true})
  },
  onLoad: function(options) {
    var dtch = wx.getStorageSync('dreamTypeContentHolder')
    var dlch = wx.getStorageSync('dreamLocationContentHolder')
    var ch = wx.getStorageSync('contentHolder')
    this.setData({dreamTime:util.dateFormat(new Date(),'dd/MM/yyyy hh')})
    if(dtch && dlch && ch) {
      this.setData({contentHolder:ch,dreamTypeContentHolder:dtch,dreamLocationContentHolder:dlch})
    }
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
  setDreamTypeContent:function(e) {
    this.setData({dreamTypeContent:e.detail.value})
  },
  setDreamLocationContent:function(e) {
    this.setData({dreamLocationContent:e.detail.value})
  },
  setContent:function(e) {
    this.setData({content:e.detail.value})
  },
  setLoading: function(){
    var that = this
      app.request({
        url:'op/dreamMessage/send',
        data:'dreamTypeContent=' + this.data.dreamTypeContent + '&dreamTime=' + this.data.dreamTime + '&dreamLocationContent=' + 
        this.data.dreamLocationContent + '&content=' + this.data.content + '&type=' + this.data.type +(this.data.imageList.length > 0?'&imageUrl=' + this.data.imageList.join():''),
        succ:function(data) {
          if(data.succ) {
            wx.setStorageSync('dreamTypeContentHolder', that.data.dreamTypeContent)
            wx.setStorageSync('dreamLocationContentHolder', that.data.dreamLocationContent)
            wx.setStorageSync('contentHolder', that.data.content)
            that.openToast("发布成功")
            that.updatePlaceHolder()
            // wx.redirectTo({
            //   url: app.getPreview().url
            // })
          }else{
            console.log(data.message)
          }
        }
      })
  },
  updatePlaceHolder:function() {
    this.setData({
      dreamTime:util.dateFormat(new Date(),'dd/MM/yyyy hh'),
      dreamTypeContent:'',
      dreamLocationContent:'',
      content:'',
      dreamTypeContentHolder:this.data.dreamTypeContent,
      dreamLocationContentHolder:this.data.dreamLocationContent,
      contentHolder:this.data.content
    })
  },
  openToast: function(content){
      var obj = {};
      obj["toasContent"] = content;
      obj["toastStatus"] = false;
      this.setData(obj);
  },
  toastChange: function() {
    this.setData({toastStatus:true})
  },
  chooseImage: function () {
    if(this.data.imageList.length >= 1) {
      this.openToast('只能上传一张图片')
    } else {
      var that = this
      wx.chooseImage({
        count:this.data.count,
        sizeType:'original',
        success: function (res) {
          //TODO 使用第三方存储（比如七牛）在客户端直接上传图片，把callback的url放在这里
          var list = that.data.imageList;
          list.push(res.tempFilePaths);
          that.setData({
            imageList: list
          })
        }
      })
    }
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  }
})