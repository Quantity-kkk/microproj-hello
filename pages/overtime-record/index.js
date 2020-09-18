// pages/overtime-record/index.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil

Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleName: null,
    overDate: null,
    cost:0,
    overtimeDesc: null
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

  /**
   * 设置加班人员名字
   */
  setPeopleName: function(event){
    this.setData({
      peopleName: event.detail.value
    })
  },

  /**
   * 设置加班登记的日期
   */
  setOverDate: function(event){
    this.setData({
      overDate: event.detail.value
    })
  },

  /**
   * 设置加班原因
   */
  setOvertimeDesc: function(event){
    this.setData({
      overtimeDesc: event.detail.value
    })
  },

  /**
   * 设置是否登记第一个人员的餐补
   */
  onChangeCost: function(event){
    this.setData({
      cost: event.detail.key
    })
  },

  saveInfo: function(event){
    this.commitRecord()
    // if (app.globalData.userDetail) {
    //   this.commitRecord()
    // } else {
    //   wx.navigateTo({
    //     url: "/pages/auth/index"
    //   })
    // }
  },


  commitRecord: function(){
    const peopleName = this.data.peopleName
    const overDate = this.data.overDate
    const cost = this.data.cost
    const overtimeDesc = this.data.overtimeDesc
    if (!wxutil.isNotNull(peopleName) || !wxutil.isNotNull(overDate)) {
      wx.lin.showMessage({
        type: "error",
        content: "日期或人员不能为空！"
      })
      return
    }

    // 构造请求参数
    const url = api.backupAPI+"overtime/"
    const data = {
      peopleName: peopleName,
      overDate: overDate,
      cost: cost > 0 ? true : false,
      overtimeDesc: overtimeDesc
    }

    // 提交加班记录
    wxutil.request.post(url, data).then((res) => {
      if (res.data.code == 200) {
        // 更新缓存
        this.setData({
          peopleName: null,
          overDate: null,
          cost: 0
        })

        wx.lin.showMessage({
          type: "success",
          content: "登记成功！",
          success() {
            wx.navigateBack()
          }
        })
      } else {
        wx.lin.showMessage({
          type: "error",
          content: "登记失败！"
        })
      }
    })
  }
})