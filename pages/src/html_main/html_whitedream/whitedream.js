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
    type:'PUBLIC',
    imageList:[]
  },
  bindItemTap:function(e) {
     this.setData({type:e.currentTarget.dataset.name,actionSheetHidden:true})
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
      //this.openToast("发布成功");
      console.log('this.data.content = ' + this.data.content)
      app.sendRequest({
        url:'op/dreamMessage/send',
        data:'dreamTypeContent=' + this.data.dreamTypeContent + '&dreamTime=' + this.data.dreamTime + '&dreamLocationContent=' + 
        this.data.dreamLocationContent + '&content=' + this.data.content + '&type=' + this.data.type,
        succ:function(data) {
          wx.redirectTo({
            url: '../html_showdreams/showdreams'
          })
        }
      })
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
  }
})