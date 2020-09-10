// pages/zone/zone.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil
// 每页显示条数
const pageSize = 16 

const sideBarData = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'
];

const nameData = [
  ['安冉', '艾浩宇'],
  ['白昕玥', '包博坤'],
  ['陈麟', '曹毛毛'],
  ['邓波光', '董睿希'],
  ['鄂卓烆', '洱惜文'],
  ['冯月滢', '范源'],
  ['郭若诗', '高薇竹'],
  ['黄琪琪', '胡纩鸯'],
  ['蒋馥蔓', '金倜厅'],
  ['孔薇竹', '康艳霞'],
  ['李舒旬', '刘笑'],
  ['马亦', '孟熠彤'],
  ['倪靓', '牛彗伶'],
  ['欧玉兰', '欧阳漂泊'],
  ['潘静', '皮文涛'],
  ['钱卫国', '秦健容'],
  ['任倩倩', '荣盈盈'],
  ['孙桢', '沈业轩'],
  ['陶小树', '唐子翊'],
  ['吴洁立', '王紫耘'],
  ['许子豪', '谢亚希'],
  ['杨思远', '尤庭亮'],
  ['赵容', '周承瑶']
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameData: nameData,
    sideBarData: sideBarData,
    user: {},
    informations:[
      {
        user:{
          avatar:'../../images/index-list/avatar/7.jpg',
          id:'ZXJDKXS',
          nick_name:'ZXJDKXS'
        },
        reply:{
          id:'2',
          type:'message',
          nick_name:'文静'
        },
        content:'你是猪吗',
        id:'1',
        create_time:'20小时前'
      },
      {
        user:{
          avatar:'../../images/index-list/avatar/7.jpg',
          id:'ZXJDKXS',
          nick_name:'ZXJDKXS'
        },
        reply:{
          id:'2',
          type:'message',
          nick_name:'文静'
        },
        content:'你是王大锤吗？',
        id:'2',
        create_time:'20小时前'
      }
    ],
    messages: [
      {
        user:{
          id:'ZXJDKXS',
          avatar:'../../images/index-list/avatar/7.jpg',
          nick_name:'奇妙幻想'
        },
        create_time:'2020-08-18 15:17:23',
        id:'d4546dsdsad',
        content:'给作者点赞呀！',
        images:['../../images/backup/backup-background-01.jpg'],
      },
      {
        user:{
          id:'ZXJDKXS1',
          avatar:'../../images/index-list/avatar/7.jpg',
          nick_name:'静静猪'
        },
        create_time:'2020-08-18 15:30:23',
        id:'d4546dsdsad2',
        content:'给作者点赞呀！',
        images:['../../images/backup/backup-background-01.jpg'],
      }
    ],
    friends: [
      {
        "anchor":"A",
        "list":[{"name":"Amos"},{"name":"Ada"}]
      },
      {
        "anchor":"B",
        "list":[{"name":"Balan"},{"name":"Ben"}]
      },
    ],
    actionList: [],
    messageIndex: -1,
    pageMessage: 1,
    pageInformation: 1,
    isEndInformation: false,
    isEndMessage: false,
    height: 1206, // 话题区高度
    tabIndex: 1,
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
        this.getMessages(userId)
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
            this.getMessages(userId)
          }
          if (tabIndex == 1) {
            this.getMessages(userId)
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
})