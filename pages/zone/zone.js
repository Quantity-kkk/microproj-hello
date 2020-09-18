// pages/zone/zone.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil
// 每页显示条数
const pageSize = 16 
const sideBarData = []
const nameData = []

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameData,
    sideBarData,
    user: {},
    informations:[],
    messages: [],
    friends: [],
    actionList: [],
    messageIndex: -1,
    pageMessage: 1,
    pageInformation: 1,
    isEndInformation: false,
    isEndMessage: false,
    height: 1206, // 话题区高度
    tabIndex: 0,
    tabsTop: 255,
    tabsFixed: true, // Tabs是否吸顶
    messageBrief: null,
    scrollTop:undefined,
    isEnd: true, // 是否到底
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTabsTop();
    this.getScrollHeight();
  },

/**
   * 获取窗口高度
   */
  getScrollHeight() {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        const windowHeight = res.windowHeight;
        const windowWidth = res.windowWidth;
        const ratio = 750 / windowWidth;
        const height = windowHeight * ratio;
        that.setData({
          height: height - 80
        })
      }
    })
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
    this.getUser()

    const userId = this.data.user.id
    if(!userId){
      // 数据初始化
      this.setData({
        messages: [],
        pageInformation: 1,
        pageMessage: 1,
        isEndInformation: false,
        isEndMessage: false
      })
    }
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
        this.getMessages(userId)
      }
      if (tabIndex == 1) {
        this.getFriends(userId)
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
            this.getMessages(userId)
          }

          if (tabIndex == 1) {
            this.getFriends(userId)
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
  // 页面监听函数
  onPageScroll(res) {
    this.setData({
      scrollTop: res.scrollTop,
    })
  },
  // 索引被选中的监听函数
  onSelected(event){
    this.setData({
      indexText: event.detail.indexText
    })
  },
    /**
   * 下拉刷新
   */
  scrollToUpper() {
    const userId = this.data.user.id
  
    //刷新留言板数据
    if(userId){
      const page = this.data.pageComment
      this.getMessages(userId, page+1)
  
      // 振动交互
      // wx.vibrateShort()
    }
    
  },
    /**
   * 触底加载
   */
  scrollToLower() {
    const page = this.data.page

    this.setData({
      loading: true
    })

    this.getMessages(page + 1, labelId)
  },
  /**
   * 跳转话题详情页
   */
  gotoDetail(event) {
    const messageId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: "/pages/message-detail/index?messageId=" + messageId
    })
  },

  /**
   * 点击编辑
   */
  onEditTap() {
    if (app.globalData.userDetail) {
      const userInfo = app.globalData.userDetail
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
   * 跳转到用户名片页
   */
  gotoVisitingCard(event) {
    const userId = event.target.dataset.userId
    wx.navigateTo({
      url: "/pages/visiting-card/index?userId=" + userId
    })
    /*
    if (app.globalData.userDetail) {
      const userId = event.target.dataset.userId
      wx.navigateTo({
        url: "/pages/visiting-card/index?userId=" + userId
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/index"
      })
    }*/
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
   * 获取用户留言信息
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
          pageMessage: (messages.length == 0 && page != 1) ? page - 1 : page,
          loading: false,
          isEndMessage: ((messages.length < pageSize) || (messages.length == 0 && page != 1)) ? true : false,
          messages: page == 1 ? messages : this.data.messages.concat(messages)
        })
      }
    })
  },

  getFriends(userId){
    const url = api.friendAPI
    wxutil.request.get(url).then((res) => {
      if(res.data.code == 200){
        const friends = res.data.data
        //对好友列表进行一下处理
        if(friends){
          let sideBarData = []
          let nameData = []
          //第一次转换
          let dic = {}
          for(let friend of friends){
            let list = dic[friend.anchor] ? dic[friend.anchor] : []
            list.push(friend)
            dic[friend.anchor]=list
          }
          //第二次转换
          let dicList = []
          for(let anchor in dic){
            dicList.push({
              'anchor': anchor,
              'list': dic[anchor].sort((a,b) => a.nickName<b.nickName?-1:a.nickName==b.nickName?0:1)
            })
          }
          dicList.sort((a,b) => a.anchor<b.anchor?-1:a.anchor==b.anchor?0:1)
          //对第二次转换的结果进行排序
          for(var item of dicList){
            sideBarData.push(item.anchor)
            nameData.push(item.list)
          }
          this.setData({
            sideBarData: sideBarData,
            nameData: nameData
          })
          // console.info(sideBarData)
          // console.info(nameData)
        }
      }
    })
  },

  /**
   * 图片预览
   */
  previewImage(event) {
    const index = event.currentTarget.dataset.index
    const current = event.currentTarget.dataset.src
    const urls = this.data.messages[index].images

    wx.previewImage({
      current: current,
      urls: urls
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
   * 点击好友头像
   */
  onTapAvatar(event){
    console.info(event);
    const userId = event.target.dataset.avatarId
    wx.navigateTo({
      url: "/pages/visiting-card/index?userId=" + userId
    })
  }
})