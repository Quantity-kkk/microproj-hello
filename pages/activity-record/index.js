// pages/activity-record/index.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil

Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleName: null,
    activityDate: null,
    cost: null,
    activityDesc: null
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