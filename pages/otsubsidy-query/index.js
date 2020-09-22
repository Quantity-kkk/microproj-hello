// pages/otsubsidy-query/index.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil

Page({

  /**
   * 页面的初始数据
   */
  data: {
    overDateStart: null,
    overDateEnd: null
  },
  
  setOverDateStart: function(event){
    this.setData({
      overDateStart: event.detail.value
    })
  },
  setOverDateEnd: function(event){
    this.setData({
      overDateEnd: event.detail.value
    })
  },

  queryInfo: function(){
    //获取参数，跳转过去
    if (app.globalData.userDetail) {
      let start = this.data.overDateStart;
      let end = this.data.overDateEnd;
      wx.navigateTo({
        url: "/pages/otsubsidy-query-summary/index?overDateStart="+start+"&overDateEnd="+end
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/index"
      })
    }
  }
})