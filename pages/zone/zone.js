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
    nameData,
    sideBarData,
    user: {},
    messages:[
      {
        user:{
          avatar:'../../images/index-list/avatar/8.jpg',
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
          avatar:'../../images/index-list/avatar/8.jpg',
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
    comments: [
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
    height: 1206, // 话题区高度
    tabIndex: 1,
    tabsTop: 255,
    tabsFixed: false, // Tabs是否吸顶
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
    const labelId = this.data.labelId

    if (labelId == -1) {
      this.getTopics()
    } else {
      this.getTopics(1, labelId)
    }
    // 振动交互
    wx.vibrateShort()
  },
    /**
   * 触底加载
   */
  scrollToLower() {
    const labelId = this.data.labelId
    const page = this.data.page

    this.setData({
      loading: true
    })
    if (labelId == -1) {
      this.getTopics(page + 1)
    } else {
      this.getTopics(page + 1, labelId)
    }
  },

})