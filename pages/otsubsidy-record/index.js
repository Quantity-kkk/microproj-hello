// pages/otsubsidy-record/index.js
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
    cost: null,
    overTimeDesc: null
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
  setOverTimeDesc: function(event){
    this.setData({
      overTimeDesc: event.detail.value
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
    if (app.globalData.userDetail) {
      this.commitRecord()
    } else {
      wx.navigateTo({
        url: "/pages/auth/index"
      })
    }
  },


  commitRecord: function(){
    const peopleName = this.data.peopleName
    const overDate = this.data.overDate
    const cost = this.data.cost
    const overTimeDesc = this.data.overTimeDesc
    if (!wxutil.isNotNull(peopleName) || !wxutil.isNotNull(overDate) || !wxutil.isNotNull(cost)) {
      wx.lin.showMessage({
        type: "error",
        content: "日期、人员、金额不能为空！"
      })
      return
    }

    // 构造请求参数
    const url = api.backupAPI+"otsubsidy/"
    const data = {
      peopleName: peopleName,
      overDate: overDate,
      cost: cost,
      overTimeDesc: overTimeDesc
    }

    // 提交加班记录
    wxutil.request.post(url, data).then((res) => {
      if (res.data.code == 200) {
        // 更新缓存
        this.setData({
          peopleName: null,
          overDate: null,
          cost: 0,
          overTimeDesc: null
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