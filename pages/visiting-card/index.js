// pages/visiting-card/index.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil
const pageSize = 16 // 每页显示条数

Page({
  data: {
    user: {},
    messages: [],
    comments: [],
    stars: [],
    actionList: {},
    messageIndex: -1,
    userId: null,
    page: 1,
    tabIndex: 0,
    tabsTop: 305,
    genderText: "Ta",
    tabsFixed: false, // Tabs是否吸顶
    isEndMessage: false, // 评论是否到底
    loading: false
  },

  onLoad(options) {
    const userId = options.userId
    
    let userDetail = app.globalData.userDetail
    if(userDetail){
      const currentUserId = userDetail.id
      this.setData({
        userId: currentUserId
      })
    }
    this.getUser(userId)
  },

  /**
   * 获取Tabs的高度
   */
  getTabsTop() {
    const query = wx.createSelectorQuery();
    query.select("#tabs").boundingClientRect((res) => {
      this.setData({
        tabsTop: res.top
      })
    }).exec();
  },

  /**
   * 获取用户信息
   */
  getUser(userId) {
    const url = api.userAPI + "visit/" +userId + "/"

    wxutil.request.get(url).then((res) => {
      if (res.data.code == 200) {
        const user = res.data.data
        let genderText = "Ta"
        if (user.male == 1) {
          genderText = "他"
        }
        if (user.male == 2) {
          genderText = "她"
        }

        this.setData({
          user: user,
          genderText: genderText
        })

        // 获取Tabs高度
        this.getTabsTop()

        // 设置标题
        wx.setNavigationBarTitle({
          title: user.nickName
        })

        // 标签页切换
        this.getMessages(userId)
      }
    })
  },

  /**
   * 获取用户话题
   */
  getTopics(userId, pageTopic = 1, size = pageSize) {
    const url = api.topicAPI + "user/" + userId + "/"
    let data = {
      size: size,
      page: pageTopic
    }

    if (this.data.isEndTopic && pageTopic != 1) {
      return
    }

    wxutil.request.get(url, data).then((res) => {
      if (res.data.code == 200) {
        const topics = res.data.data
        this.setData({
          pageTopic: (topics.length == 0 && pageTopic != 1) ? pageTopic - 1 : pageTopic,
          loading: false,
          isEndTopic: ((topics.length < pageSize) || (topics.length == 0 && pageTopic != 1)) ? true : false,
          topics: pageTopic == 1 ? topics : this.data.topics.concat(topics)
        })
      }
    })
  },

  

  /**
   * 获取用户留言
   */
  getMessages(userId, page = 1, size = pageSize) {
    const url = api.messageAPI + "user/" + userId + "/"
    let data = {
      size: size,
      page: page
    }

    if (this.data.isEndMessage && page != 1) {
      return
    }

    wxutil.request.get(url, data).then((res) => {
      if (res.data.code == 200) {
        const messages = res.data.data
        this.setData({
          page: (messages.length == 0 && page != 1) ? page - 1 : page,
          loading: false,
          isEndMessage: ((messages.length < pageSize) || (messages.length == 0 && page != 1)) ? true : false,
          messages: page == 1 ? messages : this.data.messages.concat(messages)
        })
      }
    })
  },

  /**
   * 点击关注或取消关注按钮
   */
  onFriendTap() {
    const that = this
    const user = this.data.user
    if (this.data.user.isFriends) {
      wx.lin.showActionSheet({
        title: "确定要删除好友" + user.nickName + "吗？",
        showCancel: true,
        cancelText: "放弃",
        itemList: [{
          name: "删除好友",
          color: "#666",
        }],
        success() {
          that.friendOrCancel(user.id, "删除好友")
        }
      })
    } else {
      this.friendOrCancel(user.id, "添加好友")
    }
  },

  /**
   * 关注或取关
   */
  friendOrCancel(userId, msg) {
    const url = api.friendAPI
    const data = {
      "friendUserId": userId
    }

    wxutil.request.post(url, data).then((res) => {
      if (res.data.code == 200) {
        wx.lin.showMessage({
          type: "success",
          content: msg + "成功！",
        })
        let user = this.data.user
        user.isFriends = !user.isFriends
        this.setData({
          user: user
        })
      } else if (res.data.message == "Can Not Add Yourself") {
        wx.lin.showMessage({
          type: "error",
          content: "不能添加自己",
        })
      } else {
        wx.lin.showMessage({
          type: "error",
          content: msg + "失败！",
        })
      }
    })
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
    if (tabIndex == 0) {
      this.getTopics(userId)
    }
    if (tabIndex == 1) {
      this.getComments(userId)
    }
    if (tabIndex == 2) {
      this.getStars(userId)
    }
  },

  /**
   * 展开操作菜单
   */
  onMoreTap(event) {
    const messageIndex = event.currentTarget.dataset.index
    let actionList = [{
      name: "分享",
      color: "#666",
      openType: "share"
    }]

    if (this.data.user.id == this.data.messages[messageIndex].user.id) {
      actionList.push({
        name: "删除",
        color: "#d81e05"
      })
    }

    this.setData({
      actionList: actionList,
      showAction: true,
      messageIndex: messageIndex
    })
  },

  /**
   * 点击操作菜单按钮
   */
  onActionItemtap(event) {
    const index = event.detail.index
    if (index == 1) {
      // 删除话题
      this.deleteMessage()
    }
  },

  /**
   * 删除话题
   */
  deleteMessage() {
    wx.lin.showDialog({
      type: "confirm",
      title: "提示",
      content: "确定要删除该留言？",
      success: (res) => {
        if (res.confirm) {
          const messageId = this.data.messages[this.data.messageIndex].id
          const url = api.messageAPI + messageId + "/"

          wxutil.request.delete(url).then((res) => {
            if (res.data.code == 200) {
              const userId = this.data.user.id
              this.getMessages(userId,this.data.pageMessage)

              wx.lin.showMessage({
                type: "success",
                content: "删除成功！"
              })
            } else {
              wx.lin.showMessage({
                type: "error",
                content: "删除失败！"
              })
            }
          })
        }
      }
    })
  },

  /**
   * 点击留言按钮
   */
  onEditTap() {
    if (app.globalData.userDetail) {
      const userInfo = this.data.user
      wx.navigateTo({
        url: "/pages/message-edit/index?userId="+userInfo.id
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/index"
      })
    }
  },

  /**
   * 跳转留言详情页
   */
  gotoDetail(event) {
    const messageId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: "/pages/message-detail/index?messageId=" + messageId
    })
  },

  /**
   * 跳转到用户名片页
   */
  gotoVisitingCard(event) {
    const userId = event.target.dataset.userId
    wx.navigateTo({
      url: "/pages/visiting-card/index?userId=" + userId
    })
  },

  /**
   * 触底加载
   */
  onReachBottom() {
    const tabIndex = this.data.tabIndex
    const userId = this.data.user.id

    this.setData({
      loading: true
    })

    const page = this.data.page
    this.getMessages(userId, page + 1)
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
      title: this.data.user.nick_name,
      imageUrl: this.data.user.avatar,
      path: "/pages/visiting-card/index?userId=" + this.data.user.id
    }
  }
})