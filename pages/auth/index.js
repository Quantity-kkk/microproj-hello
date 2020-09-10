// pages/auth/index.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil
const base64 = app.base64

Page({
  data: {},

  onLoad() {},

  /**
   * 授权
   */
  auth(event) {
    let data = {}

    if (event.detail.errMsg == "getUserInfo:ok") {
      data["raw_data"] = event.detail.rawData
      data["app_id"] = app.globalData.appId

      // 缓存用户简要信息
      wxutil.setStorage("userInfo", event.detail.userInfo)

      wx.login({
        success(event) {
          data["code"] = event.code
          //经过授权后，该信息是存在的
          let userInfo = wxutil.getStorage("userInfo")
          // data["id"] = 
          const url = api.userAPI+"wxLogin"

          wxutil.request.post(url, data).then((res) => {
            if (res.data.code == 200) {
              wxutil.setStorage("userDetail", res.data.data)
              app.globalData.userDetail = res.data.data
              wx.lin.showMessage({
                type: "success",
                content: "授权成功！",
                success() {
                  wx.navigateBack()
                }
              })
            } else {
              wx.lin.showMessage({
                type: "error",
                content: "授权失败！"
              })
            }
          })
        }
      })
    }
  },

  onShareAppMessage() {
    return {
      title: "授权",
      path: "/pages/auth/index"
    }
  }
})