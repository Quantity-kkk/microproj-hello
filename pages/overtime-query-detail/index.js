// pages/overtime-query-detail/index.js
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
        width: 80,
        label: '序号'
        
      },
      {
        prop: 'peopleName',
        width: 110,
        label: '姓名'
      },
      {
        prop: 'overDate',
        width: 175,
        label: '日期'
      },
      {
        prop: 'week',
        width: 110,
        label: '星期'
      },
      {
        prop: 'overTimeDesc',
        width: 200,
        label: '说明'
      }
    ],
    stripe: true,
    border: true,
    outBorder: true,
    row: [
      {
          "seqNo": 1,
          "peopleName": '李亮',
          "overDate": "2020-08-13",
          "week": '星期四',
          "overTimeDesc":'紧急项目紧急项目紧急项目紧急项目紧急项目紧急项目紧急项目紧急项目紧急项目紧急项目紧急项目紧急项目紧急项目紧急项目紧急项目紧急项目'
      },
      {
        "seqNo": 2,
        "peopleName": '李亮2',
        "overDate": "2020-08-13",
        "week": '星期四',
        "overTimeDesc":'紧急项目'
      }

    ],
    msg: '暂无数据'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let peopleName = options.peopleName;
    console.info(peopleName);
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