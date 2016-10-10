var app = getApp()
Page({
  data: {
    userphoto: "../imgs/icon64_appwx_logo.png",
    dreamimage: "../imgs/icon64_appwx_logo.png",
    setMenuimage: "../imgs/icon64_appwx_logo.png",
    userInfo:{}
  },
  onLoad: function(options) {
    
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
  // Event handler.
  viewTap: function() {
    this.setData({
      text: 'Set some data for updating view.'
    })
  }
})