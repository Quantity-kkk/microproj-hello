//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    togetherDate: new Date(2015,9-1,15),
    date:"2015年9月15日",
    days:parseInt(Math.abs(new Date()-new Date(2015,9-1,15))/86400000),
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.switchTab({
      url: '../logs/logs',
      sunccess:function(e){
        var page = getCurrentPages().pop(); 
        if (page == undefined || page == null) return; 
        page.onLoad(); 
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReady : function(){
    wx.setNavigationBarTitle({
      title: 'KBB-首页'
    })
  },
  redirectToolPage : function(params){
        //如果带有参数，则进行祝福判断，如果不带参数，则直接跳转到小工具页面
        //如果是8月8日，祝wife生日快乐
        //如果是9月15日,祝wife周年快乐
        //跳转到小工具页面
        if(this.data && this.data.hasUserInfo){
          wx.switchTab({
            url: '../toolnav/toolnav',
            sunccess:function(e){
              var page = getCurrentPages().pop(); 
              if (page == undefined || page == null) return; 
              page.onLoad(); 
            }
          })
      }
  }
})
