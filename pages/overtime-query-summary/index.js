// pages/overtime-query-summary/index.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableHeader: [
      {
        prop: 'seqNo',
        width: 100,
        label: '序号'
        
      },
      {
        prop: 'peopleName',
        width: 200,
        label: '姓名'
      },
      {
        prop: 'overTimeCount',
        width: 160,
        label: '加班天数'
      },
      {
        prop: 'option',
        width: 110,
        label: '操作',
        color: '#00F'
      }
    ],
    stripe: true,
    border: true,
    outBorder: true,
    row: [
      {
          "seqNo": 1,
          "peopleName": '李亮',
          "overTimeCount": "20",
          "option": '明细'
          
      },
      {
        "seqNo": 2,
        "peopleName": '李亮2',
        "overTimeCount": "20",
        "option": '明细'
      }

    ],
    msg: '暂无数据'
  },

  /** 
   * 点击表格一行
   */
  onRowClick: function(e) {
    let header = this.data.tableHeader;
    //组件行列互换了。。。
    let dataColumn = e.detail.currentTarget.dataset.row;
    let dataRow = e.detail.currentTarget.dataset.column;
    
    if(header[dataColumn].prop == 'option'){
      let clickRow = this.data.row[dataRow-1];
      wx.navigateTo({
        url: "/pages/overtime-query-detail/index?peopleName="+clickRow.peopleName,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let start = options.overDateStart;
    let end = options.overDateEnd;
    let peopleName = options.peopleName;

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

  }
})