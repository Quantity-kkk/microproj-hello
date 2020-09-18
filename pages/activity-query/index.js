// pages/activity-query/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  setPeopleName: function(event){
    this.setData({
      peopleName: event.detail.value
    })
  },
  queryInfo: function(){
    //获取参数，跳转过去
    let start = this.data.overDateStart;
    let end = this.data.overDateEnd;
    let peopleName = this.data.peopleName;
    wx.navigateTo({
      url: "/pages/overtime-query-summary/index?overDateStart="+start+"&overDateEnd="+end+"&peopleName="+peopleName
    })
  }
})