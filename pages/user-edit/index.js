// pages/user-edit/index.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil

Page({
  data: {
    nickName: null,
    signature: null,
    userId: -1,
    male: 0
  },

  onLoad() {
    this.getUserDetail()
  },

  /**
   * 获取用户详情
   */
  getUserDetail() {
    const userId = app.globalData.userDetail.id
    const url = api.userAPI + userId + "/"

    wxutil.request.get(url).then((res) => {
      if (res.data.code == 200) {
        const user = res.data.data
        this.setData({
          userId: user.id,
          nickName: user.nickName,
          male: user.male,
          signature: user.signature
        })
      }
    })
  },

  /**
   * 设置昵称
   */
  setNickName(event) {
    this.setData({
      nickName: event.detail.value
    })
  },

  /**
   * 设置性别
   */
  onChangeGenderTap(event) {
    this.setData({
      male: event.detail.key
    })
  },

  /**
   * 设置个性签名
   */
  setSignature(event) {
    this.setData({
      signature: event.detail.value
    })
  },

  /**
   * 保存用户信息
   */
  saveInfo() {
    // 获取表单数据
    const nickName = this.data.nickName
    const male = this.data.male
    const signature = this.data.signature

    if (!wxutil.isNotNull(nickName)) {
      wx.lin.showMessage({
        type: "error",
        content: "昵称不能为空！"
      })
      return
    }

    // 构造请求参数
    const userId = app.globalData.userDetail.id
    const url = api.userAPI
    const data = {
      nickName: nickName,
      male: male,
      signature: signature
    }

    // 更新用户信息
    wxutil.request.put(url, data).then((res) => {
      if (res.data.code == 200) {
        let userDetail = app.globalData.userDetail
        // 更新缓存
        const user = res.data.data
        userDetail = Object.assign(userDetail, user)
        wxutil.setStorage("userDetail", userDetail)
        app.globalData.userDetail = userDetail

        wx.lin.showMessage({
          type: "success",
          content: "资料修改成功！",
          success() {
            wx.navigateBack()
          }
        })
      } else {
        wx.lin.showMessage({
          type: "error",
          content: "资料修改失败！"
        })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: "编辑资料",
      path: "/pages/user-edit/index"
    }
  }
})