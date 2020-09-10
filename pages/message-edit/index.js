// pages/topic-edit/index.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil

Page({
  data: {
    labels: [],
    imageFiles: [], // 图片文件列表
    labelsActive: [], // 选中的标签
    chooseCount: 0,
    canAnon: false,
    isAnon: false,
    content: null,
    commentTemplateId: 'fFUWiiLXOov-mPo9xstNJVkXXXjNw7Qs_n_XjEeP-e0',
    targetUser: null,
    writer:null
  },

  onLoad(option) {
    //设置留言是留给谁的
    const userInfo = app.globalData.userDetail
    this.setData({
      targetUser: option.userId,
      writer: userInfo.id
    })
  },

  /**
   * 设置内容
   */
  setContent(event) {
    this.setData({
      content: event.detail.value
    })
  },


  /**
   * 选择图片
   */
  onChangeImage(event) {
    const files = event.detail.all
    let imageFiles = []
    for (let i = 0; i < files.length; i++) {
      imageFiles.push(files[i].url)
    }
    this.setData({
      imageFiles: imageFiles
    })
  },

  /**
   * 多图上传
   */
  sendImages(imageFiles) {
    const url = api.messageAPI + "images"
    return Promise.all(imageFiles.map((imageFile) => {
      return new Promise(function (resolve, reject) {
        wxutil.file.upload({
          url: url,
          fileKey: "file",
          filePath: imageFile
        }).then((res) => {
          const data = JSON.parse(res.data);
          if (data.code == 200) {
            resolve(data.data.id)
          }
        }).catch((error) => {
          reject(error)
        })
      })
    }))
  },

  /**
   * 点击留言
   */
  onSubmitTap() {
    const content = this.data.content
    const imageFiles = this.data.imageFiles
    const targetUser = this.data.targetUser
    const writer = this.data.writer
    let images = []

    if (!wxutil.isNotNull(content)) {
      wx.lin.showMessage({
        type: "error",
        content: "内容不能为空！"
      })
      return
    }

    // 授权模板消息
    const templateId = this.data.commentTemplateId
    const that = this

    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      complete() {
        // 留言
        wxutil.showLoading("留言中...")
        let data = {
          content: content,
          images: [],
          targetUser: targetUser,
          writer: writer
        }

        if (imageFiles.length > 0) {
          that.sendImages(imageFiles).then((res) => {
            data.images = res
            that.uploadTopic(data)
          })
        } else {
          that.uploadTopic(data)
        }
      }
    })
  },

  /**
   * 发布留言
   */
  uploadTopic(data) {
    const url = api.messageAPI+"leaveMessage"

    wxutil.request.post(url, data).then((res) => {
      wx.hideLoading()
      if (res.data.code == 200) {
        wx.lin.showMessage({
          type: "success",
          content: "留言成功！",
          success() {
            wxutil.setStorage("refreshTopics", true)
            wx.navigateBack()
          }
        })
      } else {
        wx.lin.showMessage({
          type: "error",
          content: "留言失败！"
        })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: "编辑资料",
      path: "/pages/topic-edit/index"
    }
  }
})