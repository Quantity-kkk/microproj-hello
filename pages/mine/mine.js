// pages/self/self.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil
const pageSize = 16 // 每页显示条数

Page({
  data: {
    user: {},
    topics: [],
    comments: [],
    stars: [],
    pageTopic: 1,
    pageComment: 1,
    pageStar: 1,
    tabIndex: 0,
    tabsTop: 255,
    isAuth: false,
    tabsFixed: false, // Tabs是否吸顶
    isEndTopic: false, // 话题是否到底
    isEndStar: false, // 收藏是否到底
    isEndComment: false, // 评论是否到底
    loading: false,
    messageBrief: null,
    showPopup: false
  },

  onLoad() {
    // 轮询获取消息概要
    
  },

  onReady : function(){
    wx.setNavigationBarTitle({
      title: '我的'
    })
  },
  onShow() {
    this.getUser()

    const userId = this.data.user.id
    if (!userId) {
      // 数据初始化
      this.setData({
        topics: [],
        comments: [],
        stars: [],
        pageTopic: 1,
        pageComment: 1,
        pageStar: 1,
        isEndTopic: false,
        isEndStar: false,
        isEndComment: false
      })
    }
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

  /**
   * 跳转到授权页面
   */
  gotoAuth() {
    wx.navigateTo({
      url: "/pages/auth/index"
    })
  },

  /**
   * 跳转到编辑资料页面
   */
  gotoUserEdit() {
    wx.navigateTo({
      url: "/pages/user-edit/index"
    })
  },

  /**
   * 跳转到用户名片页
   */
  gotoVisitingCard(event) {
    console.log(event)
    if (app.globalData.userDetail) {
      const userId = event.target.dataset.userId
      wx.navigateTo({
        url: "/pages/visiting-card/index?userId=" + userId
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/index"
      })
    }
  },

  /**
   * 修改封面
   */
  changePoster() {
    wx.lin.showMessage({
      content: "设置封面图片"
    })

    // 上传封面
    wxutil.image.choose(1).then((res) => {
      if (res.errMsg == "chooseImage:ok") {
        wxutil.showLoading("上传中...")
        const url = api.userAPI + "poster/"

        wxutil.file.upload({
          url: url,
          fileKey: "file",
          filePath: res.tempFilePaths[0]
        }).then((res) => {
          const data = JSON.parse(res.data);
          if (data.code == 200) {
            wx.hideLoading()
            // 更新缓存
            const user = data.data
            let userDetail = app.globalData.userDetail
            userDetail = Object.assign(userDetail, user)
            wxutil.setStorage("userDetail", userDetail)
            app.globalData.userDetail = userDetail

            this.setData({
              user: user
            })

            wx.lin.showMessage({
              type: "success",
              content: "封面修改成功！"
            })
          } else {
            wx.lin.showMessage({
              type: "error",
              content: "封面修改失败！"
            })
          }
        })
      }
    })
  },

  /**
   * 修改头像
   */
  changeAvatar() {
    wx.lin.showMessage({
      content: "设置头像图片"
    })
    wxutil.image.choose(1).then((res) => {
      if (res.errMsg == "chooseImage:ok") {
        wx.navigateTo({
          url: "/pages/images-cropper/index?src=" + res.tempFilePaths[0],
        })
      }
    })
  },
  onPageScroll(event) {
    if (event.scrollTop >= this.data.tabsTop) {
      this.setData({
        tabsFixed: true
      })
    } else {
      this.setData({
        tabsFixed: false
      })
    }
  },

  onShareAppMessage() {
    return {
      title: "个人中心",
      path: "/pages/profile/index"
    }
  },

    /**
   * 权限页面
   */
  authorize() {
    wx.openSetting({})
  },

  /**
   * 清除缓存
   */
  clearStorage() {
    wx.lin.showDialog({
      type: "confirm",
      title: "提示",
      content: "确定要清除所有缓存？",
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage()
          app.globalData.userDetail = null
        }
      }
    })
  },
})
