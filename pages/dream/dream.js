var app = getApp()
var util = require('../../utils/util.js')
Page({
  data:{
    dream:{},
    messageId:{},
    lastFlush:0,
    toastStatus: true,
    toasContent:"默认",
    page: 0,
    limit: 13,
    replyList:new Array(),
    noLoading:false,
    opReply:false,
    reply:{content:''},
    replyToDreamer:0,
    replyPlaceHolder:'说点儿什么',
    scrollTop:0,
    isloading:false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    var messageId = options.d
    console.log('got parameter from preview page >>> ' + messageId)
    this.setData({messageId:messageId})
    app.checkLoginReq({
        url:'op/messageView/check/one',
        data:'messageId=' + messageId,
        succ:function(data) {
            console.log('get dreams got response.' + data.succ)
            if(data && data.succ && data.obj && data.obj.length > 0) {
                that.setData({dream:data.obj[0]})
            }
        }
    })
  },
  onShow:function(){
      this.init()
  },
  scroll:function(e){
    console.log(util.writeObj(e))
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
  init: function(cb){
    this.setData({noLoading:false})
    this.back()
    var newData = this.data
    newData.replyList = new Array()
    newData.page = 0
    console.log('will init to get replys.')
    this.getReplys(newData, cb)
  },
  getReplys:function(p, cb) {
    if(!this.data.isLoading) {
      this.setData({isLoading:true})
      var that = this
      console.log('will get replys.')
      app.checkLoginReq({
        url:'op/reply/check/message',
        data:'limit=' + p.limit + '&index=' + p.page * p.limit + '&messageId=' + p.messageId,
        succ:function(data){
          console.log('get replys got response.' + data.succ)
          p.noLoading = true
          p.isLoading = false
          that.setData(p)
          if(data && data.succ) {
            // console.log('will render dreams for each' + util.writeObj(data.obj))
            p.replyList = p.replyList.concat(data.obj)
            console.log('end for each and will render page')
            p.page = p.page + 1
            p.lastFlush = new Date().getTime()
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
    }
  },
  onPullDownRefresh: function() {
    this.init(wx.stopPullDownRefresh());
  },
  pullUpLoad: function( e ) {
    console.log( "上拉拉加载更多...." + this.data.scrollTop )
    var newData = this.data
    this.getReplys(newData)
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
                var ds = that.data.dream
                if(ds.dreamMessageView.messageId == mid) {
                    ds.greated = true
                    ds.greaterList.push({dreamerId:app.globalData.userInfo.id,greaterId:data.obj.id})
                }
                that.setData({dream:ds})
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
            var ds = that.data.dream
            if(ds.dreamMessageView.messageId == mid) {
              ds.greated = false
              for(var j=0; j<ds.greaterList.length; j++) {
                if(ds[i].dreamerId == app.globalData.userInfo.id) {
                  ds[i].greaterList.splice(j, 1)
                }
              }
            }
            that.setData({dream:ds})
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
            var ds = that.data.dream
              if(ds.dreamMessageView.messageId == that.data.reply.replyTo) {
                ds.replyList.splice(0,0,{
                  messageId:that.data.reply.replyTo,
                  dreamerId:app.globalData.userInfo.id,
                  nickName:app.globalData.userInfo.nickName,
                  avatarUrl:app.globalData.userInfo.avatarUrl,
                  content:that.data.reply.content,
                  replyDreamerId:that.data.reply.replyToDreamer,
                  replyNickName:that.data.reply.replyToDreamerNickName                
                })
              }
            
            that.setData({opReply:false, reply:{content:''}, replyPlaceHolder:'说点儿什么', dream:ds})
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
            var ds = that.data.dream

              if(ds.dreamMessageView.messageId == that.data.reply.replyTo) {
                ds.replyList.splice(0,0,{
                  messageId:that.data.reply.replyTo,
                  dreamerId:app.globalData.userInfo.id,
                  nickName:app.globalData.userInfo.nickName,
                  avatarUrl:app.globalData.userInfo.avatarUrl,
                  content:that.data.reply.content,
                  replyDreamerId:that.data.reply.replyToDreamer,
                  replyNickName:that.data.reply.replyToDreamerNickName                
                })
              }
            
            that.setData({opReply:false, reply:{content:''}, replyPlaceHolder:'说点儿什么', dream:ds})
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