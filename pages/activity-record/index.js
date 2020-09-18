// pages/activity-record/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleName: null,
    overDate: null,
    cost: null,
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
  setActivityDate: function(event){
    this.setData({
      activityDate: event.detail.value
    })
  },

  /**
   * 设置加班原因
   */
  setActivityDesc: function(event){
    this.setData({
      activityDesc: event.detail.value
    })
  },

  /**
   * 设置是否登记第一个人员的餐补
   */
  setCost: function(event){
    this.setData({
      cost: event.detail.value
    })
  },

  saveInfo: function(event){
    this.commitRecord()
  },


  commitRecord: function(){
    const peopleName = this.data.peopleName
    const activityDate = this.data.activityDate
    const cost = this.data.cost
    const activityDesc = this.data.activityDesc
    if (!wxutil.isNotNull(peopleName) || !wxutil.isNotNull(activityDate) || !wxutil.isNotNull(cost)) {
      wx.lin.showMessage({
        type: "error",
        content: "日期、人员、金额不能为空！"
      })
      return
    }

    // 构造请求参数
    const url = api.backupAPI+"activity/"
    const data = {
      peopleName: peopleName,
      activityDate: activityDate,
      cost: cost,
      activityDesc: activityDesc
    }

    // 提交团建记录
    wxutil.request.post(url, data).then((res) => {
      if (res.data.code == 200) {
        // 更新缓存
        this.setData({
          peopleName: null,
          activityDate: null,
          cost: 0,
          activityDesc:null
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