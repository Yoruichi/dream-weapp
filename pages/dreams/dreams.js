var app = getApp()
var util = require('../../utils/util.js')
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
    opReply:false,
    reply:{content:''},
    replyToDreamer:0,
    replyPlaceHolder:'说点儿什么',
    scrollTop:0
  },
  scroll:function(e){
    //console.log(util.writeObj(e))
    this.setData({scrollTop:e.detail.scrollTop})
  },
  cancelReply: function(e) {
    this.setData({
      opReply: false
    })
  },
  replyToSomeone: function(e) {
    this.setData({
      opReply: true,
      reply:{
        replyToDreamer: e.currentTarget.dataset.did,
        replyTo:e.currentTarget.dataset.mid,
        replyToDreamerNickName:e.currentTarget.dataset.dna
      }, 
      replyPlaceHolder: '回复 ' + e.currentTarget.dataset.dna
    })
  },
  back:function() {
    this.setData({scrollTop:0})
  },
  loadingChange:function(){
    this.setData({'noLoading':true})
  },
  onLoad: function(options) {
    console.log('dreams is on load now')
  },
  getDreams:function(p, cb) {
    var that = this
    console.log('will get dreams.')
    app.checkLoginReq({
      url:'op/messageView/check',
      data:'limit=' + p.limit + '&index=' + p.page * p.limit,
      succ:function(data){
        console.log('get dreams got response.' + data.succ)
        if(data && data.succ) {
          console.log('will render dreams for each' + util.writeObj(data.obj))
          // data.obj.forEach(function(e){
          //   var f = e.greaterList.find(function(g){return g.dreamerId == app.globalData.userInfo.id})
          // if(f){e.isGreated = true} else {e.isGreated = false}
          //   e.dreamMessageView.timeshow = util.timeInterval(e.dreamMessageView.messageCreateTime)
          //   e.dreamMessageView.imageList = e.dreamMessageView.image_url ? e.dreamMessageView.image_url.split(',') : []
          //   p.dreamsList.push(e)
          // })
          
          p.dreamsList = p.dreamsList.concat(data.obj)
          console.log('end for each and will render page')
          p.page = p.page + 1
          p.lastFlush = new Date().getTime()
          p.noLoading = true
          that.setData(p)
          console.log('get dreams from remote server succ.')
        }else{
          console.log('get dreams failed. Caused by:' + data ? data.message : 'not login')
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
    console.log('will init to get dreams.')
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
    // console.log('check dreamer info for dreamer by id ' + util.writeObj(e))
    console.log('check dreamer info for dreamer by id ' + e.currentTarget.dataset.did)
    wx.navigateTo({url:'/pages/dreamerdream/dreamerdream?did=' + e.currentTarget.dataset.did})
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
          for(var i=0;i<ds.length;i++) {
            if(ds[i].dreamMessageView.messageId == mid) {
              ds[i].greated = true
              ds[i].greaterList.push({dreamerId:app.globalData.userInfo.id,greaterId:data.obj.id})
            }
          }
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
          for(var i=0;i<ds.length;i++) {
            if(ds[i].dreamMessageView.messageId == mid) {
              ds[i].greated = false
              for(var j=0; j<ds[i].greaterList.length; j++) {
                if(ds[i].dreamerId == app.globalData.userInfo.id) {
                  ds[i].greaterList.splice(j, 1)
                }
              }
            }
          }
          that.setData({dreamsList:ds})
        } else {
          that.openToast("开了个小差");
        }
      }
    })
  },
  do_share: function(dreamer_id) {
      this.openToast("分享成功");
  },
  opReply:function(e) {
    this.setData({opReply:true, reply:{replyTo:e.currentTarget.dataset.mid}})
  },
  setReply:function(e) {
    var rep = this.data.reply
    rep.content = e.detail.value
    console.log('reply ' + e.detail.value + ' to message id ' + rep.replyTo)
    this.setData({reply:rep})
  },
  do_reply: function(e) {
    var that = this
    console.log('current reply ' + that.data.reply.content + ' to message id ' + that.data.reply.replyTo + ' to dreamer id ' + that.data.reply.replyToDreamer)

    if(!that.data.reply.content || that.data.reply.content.length == 0) {this.openToast('追梦怎能无言')}
    else if(!that.data.reply.replyToDreamer) {
      app.checkLoginReq({
        url:'op/reply/message',
        data:'messageId=' + that.data.reply.replyTo + '&content=' + that.data.reply.content,
        succ:function(data) {
          if(data.succ){
            var ds = that.data.dreamsList
            for(var i=0;i<ds.length; i++) {
              if(ds[i].dreamMessageView.messageId == that.data.reply.replyTo) {
                ds[i].replyList.splice(0,0,{
                  messageId:that.data.reply.replyTo,
                  dreamerId:app.globalData.userInfo.id,
                  nickName:app.globalData.userInfo.nickName,
                  avatarUrl:app.globalData.userInfo.avatarUrl,
                  content:that.data.reply.content,
                  replyDreamerId:that.data.reply.replyToDreamer,
                  replyNickName:that.data.reply.replyToDreamerNickName                
                })
              }
            }
            that.setData({opReply:false, reply:{content:''}, replyPlaceHolder:'说点儿什么', dreamsList:ds})
            that.openToast("已留下你的梦迹")
          } else {
            that.openToast("梦迹略重啊")
          }
        }
      })
    } else {
      app.checkLoginReq({
        url:'op/reply/dreamer',
        data:'messageId=' + that.data.reply.replyTo + '&content=' + that.data.reply.content + '&replyDreamerId=' + that.data.reply.replyToDreamer,
        succ:function(data) {
          if(data.succ){
            var ds = that.data.dreamsList
            for(var i=0;i<ds.length; i++) {
              if(ds[i].dreamMessageView.messageId == that.data.reply.replyTo) {
                ds[i].replyList.splice(0,0,{
                  messageId:that.data.reply.replyTo,
                  dreamerId:app.globalData.userInfo.id,
                  nickName:app.globalData.userInfo.nickName,
                  avatarUrl:app.globalData.userInfo.avatarUrl,
                  content:that.data.reply.content,
                  replyDreamerId:that.data.reply.replyToDreamer,
                  replyNickName:that.data.reply.replyToDreamerNickName                
                })
              }
            }
            that.setData({opReply:false, reply:{content:''}, replyPlaceHolder:'说点儿什么', dreamsList:ds})
            that.openToast("已留下你的梦迹")
          } else {
            that.openToast("梦迹略重啊")
          }
        }
      })
    }
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