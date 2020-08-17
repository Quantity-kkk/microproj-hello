// pages/zone/zone.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil
// 每页显示条数
const pageSize = 16 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    messages: [],
    comments: [],
    friends: [],
    tabIndex: 1,
    tabsTop: 255,
    tabsFixed: false, // Tabs是否吸顶
    messageBrief: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTabsTop();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.info(this.selectComponent('#tabs').data);
    
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
   * Tab切换
   */
  changeTabs(event) {
    const tabIndex = event.detail.currentIndex
    const userId = this.data.user.id
    this.setData({
      tabIndex: tabIndex
    })

    if (userId) {
      if (tabIndex == 0) {
        this.getTopics(userId)
      }
      if (tabIndex == 1) {
        this.getComments(userId)
      }
      if (tabIndex == 2) {
        this.getStars(userId)
      }
    }
  },

  /**
   * 获取Tabs的高度
   */
  getTabsTop() {
    const navigateHeight = 56
    const query = wx.createSelectorQuery();
    query.select("#tabs").boundingClientRect((res) => {
      this.setData({
        tabsTop: res.top - navigateHeight
      })
    }).exec();
  },

  /**
   * 获取用户信息
   */
  getUser() {
    const userInfo = wxutil.getStorage("userInfo")
    let userDetail = app.globalData.userDetail

    // 使用userInfo作为用户信息
    if (userInfo && !userDetail) {
      this.setData({
        user: userInfo,
        isAuth: false
      })
    }

    // 授权用户使用userDetail作为用户信息
    if (userDetail) {
      const userId = userDetail.id
      const url = api.userAPI + userId + "/"

      wxutil.request.get(url).then((res) => {
        if (res.data.code == 200) {
          // 更新缓存
          const user = res.data.data
          userDetail = Object.assign(userDetail, user)
          wxutil.setStorage("userDetail", userDetail)
          app.globalData.userDetail = userDetail

          this.setData({
            isAuth: true,
            user: userDetail
          })

          const tabIndex = this.data.tabIndex
          if (tabIndex == 0) {
            this.getTopics(userId)
          }
          if (tabIndex == 1) {
            this.getComments(userId)
          }
          if (tabIndex == 2) {
            this.getStars(userId)
          }
        }
      })
    }

    // 两种用户信息都没有
    if (!userInfo && !userDetail) {
      this.setData({
        user: {},
        isAuth: false
      })
    }
  },
  
})