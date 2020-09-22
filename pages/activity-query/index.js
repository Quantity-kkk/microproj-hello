// pages/activity-query/index.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityDateStart: null,
    activityDateEnd: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  setActivityStart: function(event){
    this.setData({
      activityDateStart: event.detail.value
    })
  },
  setActivityEnd: function(event){
    this.setData({
      activityDateEnd: event.detail.value
    })
  },

  queryInfo: function(){
    //获取参数，跳转过去
    if (app.globalData.userDetail) {
      let start = this.data.activityDateStart;
      let end = this.data.activityDateEnd;
      wx.navigateTo({
        url: "/pages/activity-query-detail/index?activityDateStart="+start+"&activityDateEnd="+end
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/index"
      })
    }
  }
})