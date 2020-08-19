// pages/message-detail/index.js
const app = getApp()
const api = app.api
const wxutil = app.wxutil
const pageSize = 16 // 每页显示条数

Page({
  data: {
    message: {},
    comments: [],
    stars: [],
    actionList: [],
    placeholder: "评论点什么吧~",
    userId: -1,
    page: 1,
    comment: null,
    commentId: null,
    commentTemplateId: null, // 评论模板ID
    focus: false, // 获取焦点
    showAction: false, // 是否显示操作菜单
    isEnd: false // 是否到底
  },

  onLoad(options) {
    const messageId = options.messageId
    const focus = options.focus

    // 评论获取焦点展开键盘
    if (focus) {
      this.setData({
        focus: true
      })
    }
    this.getMessageDetail(messageId)
    this.getUserId()
  },

  /**
   * 获取动态详情
   */
  getMessageDetail(messageId) {
    console.info(messageId);
    //1.获取留言详情
    this.setData({
      message:{
        id:messageId,
        user:{
          id:'ZXJDKXS',
          nick_name:'奇思妙想',
          avatar:'../../images/index-list/avatar/7.jpg'
        },
        content:'给作者点赞呀！',
        images:['../../images/backup/backup-background-01.jpg'],
        comment_count:1
      }
    })
    //2.获取留言对应的评论详细
    this.getComments(messageId);

    /*
    const url = api.messageAPI + messageId + "/"

    wxutil.request.get(url).then((res) => {
      if (res.data.code == 200) {
        const message = res.data.data
        this.setData({
          message: message
        })
        if ("id" in message) {
          this.getComments(messageId)
          this.getStars(messageId)
          this.getTemplateId()
        }
      }
    })*/
  },

  /**
   * 获取评论
   */
  getComments(messageId, page = 1, size = pageSize) {
    let comments = [
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
        id:'2',
        content:'你是王大锤吗？',
        create_time:'20小时前'
      }
    ]
    this.setData({
      page: (comments.length == 0 && page != 1) ? page - 1 : page,
      isEnd: ((comments.length < pageSize) || (comments.length == 0 && page != 1)) ? true : false,
      comments: page == 1 ? comments : this.data.comments.concat(comments)
    })

    /*
    const url = api.commentAPI + "message/" + messageId + "/"
    let data = {
      size: size,
      page: page
    }

    if (this.data.isEnd && page != 1) {
      return
    }

    wxutil.request.get(url, data).then((res) => {
      if (res.data.code == 200) {
        const comments = res.data.data
        this.setData({
          page: (comments.length == 0 && page != 1) ? page - 1 : page,
          isEnd: ((comments.length < pageSize) || (comments.length == 0 && page != 1)) ? true : false,
          comments: page == 1 ? comments : this.data.comments.concat(comments)
        })
      }
    })*/
  },

  /**
   * 获取用户ID
   */
  getUserId() {
    if (app.globalData.userDetail) {
      this.setData({
        userId: app.globalData.userDetail.id
      })
    }
  },

  /**
   * 获取收藏
   */
  getStars(messageId) {
    const url = api.starAPI + "message/" + messageId + "/"

    wxutil.request.get(url).then((res) => {
      if (res.data.code == 200) {
        this.setData({
          stars: res.data.data
        })
      }
    })
  },

  /**
   * 获取评论模板ID
   */
  getTemplateId(title = "评论模板") {
    if (app.globalData.userDetail) {
      const url = api.templateAPI
      const data = {
        title: title
      }

      wxutil.request.get(url, data).then((res) => {
        if (res.data.code == 200) {
          this.setData({
            commentTemplateId: res.data.data.template_id
          })
        }
      })
    }
  },

  /**
   * 加载更多评论
   */
  getMoreComments() {
    const page = this.data.page
    const messageId = this.data.message.id
    this.getComments(messageId, page + 1)
  },

  /**
   * 图片预览
   */
  previewImage(event) {
    const current = event.currentTarget.dataset.src
    const urls = this.data.message.images

    wx.previewImage({
      current: current,
      urls: urls
    })
  },

  /**
   * 展开操作菜单
   */
  onMoreTap() {
    let actionList = [{
      name: "分享",
      color: "#666",
      openType: "share"
    }, {
      name: "举报",
      color: "#666"
    }]

    if (this.data.userId == this.data.message.user.id) {
      actionList.push({
        name: "删除",
        color: "#d81e05"
      })
    }

    this.setData({
      showAction: true,
      actionList: actionList
    })
  },

  /**
   * 关闭操作菜单
   */
  onCancelSheetTap() {
    this.setData({
      showAction: false
    })
  },

  /**
   * 点击操作菜单按钮
   */
  onActionItemtap(event) {
    const index = event.detail.index
    if (index == 1) {
      // 举报话题
      this.reportMessage()
    }
    if (index == 2) {
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
      content: "确定要删除该话题？",
      success: (res) => {
        if (res.confirm) {
          const messageId = this.data.message.id
          const url = api.messageAPI + messageId + "/"

          wxutil.request.delete(url).then((res) => {
            if (res.data.code == 200) {
              wx.lin.showMessage({
                type: "success",
                content: "删除成功！",
                success() {
                  wx.navigateBack()
                }
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
   * 举报话题
   */
  reportMessage() {
    wx.lin.showDialog({
      type: "confirm",
      title: "提示",
      content: "确定要举报该话题？",
      success: (res) => {
        if (res.confirm) {
          const messageId = this.data.message.id
          const url = api.messageAPI + "report/"
          const data = {
            message_id: messageId
          }

          wxutil.request.post(url, data).then((res) => {
            if (res.data.code == 200) {
              wx.lin.showMessage({
                type: "success",
                content: "举报成功！"
              })
            } else {
              wx.lin.showMessage({
                type: "error",
                content: "举报失败！"
              })
            }
          })
        }
      }
    })
  },

  /**
   * 跳转话题页面
   */
  gotoMessage(event) {
    const labelId = event.currentTarget.dataset.label
    wxutil.setStorage("labelId", labelId)
    wx.switchTab({
      url: "/pages/message/index"
    })
  },

  /**
   * 跳转到用户名片页
   */
  gotoVisitingCard(event) {
    if (app.globalData.userDetail) {
      const userId = event.target.dataset.userId
      wx.navigateTo({
        url: "/pages/visiting-card/index?userId=" + userId
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/index"
      })
    }
  },

  /**
   * 点赞或取消点赞
   */
  onStarTap(event) {
    let message = this.data.message

    const url = api.starAPI
    const data = {
      message_id: message.id
    }

    wxutil.request.post(url, data).then((res) => {
      if (res.data.code == 200) {
        // 重新获取收藏列表
        this.getStars(message.id)

        const hasStar = message.has_star
        message.has_star = !message.has_star

        if (hasStar) {
          message.star_count--
        } else {
          message.star_count++
        }

        this.setData({
          message: message
        })
      }
    })
  },

  /**
   * 设置评论
   */
  inputComment(event) {
    this.setData({
      comment: event.detail.value
    })
  },

  /**
   * 点击评论列表
   */
  onCommentItemTap(event) {
    const index = event.currentTarget.dataset.index
    this.setData({
      focus: true,
      commentId: this.data.comments[index].id,
      placeholder: "@" + this.data.comments[index].user.nick_name
    })
  },

  /**
   * 点击评论图标
   */
  onCommentTap(event) {
    this.setData({
      focus: true,
      commentId: null,
      placeholder: "评论点什么吧..."
    })
  },

  /**
   * 发送评论
   */
  onCommntBtnTap() {
    const comment = this.data.comment
    if (!wxutil.isNotNull(comment)) {
      wx.lin.showMessage({
        type: "error",
        content: "评论不能为空！"
      })
      return
    }

    // 授权模板消息
    const templateId = this.data.commentTemplateId
    const that = this

    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      complete() {
        // 发送评论
        const url = api.commentAPI
        let message = that.data.message
        const messageId = message.id
        let data = {
          content: comment,
          message_id: messageId
        }

        if (that.data.commentId) {
          data["comment_id"] = that.data.commentId
        }

        wxutil.request.post(url, data).then((res) => {
          if (res.data.code == 200) {
            wx.lin.showMessage({
              type: "success",
              content: "评论成功！"
            })
            // 重新获取评论列表
            that.getComments(messageId)
            setTimeout(function () {
              wx.pageScrollTo({
                scrollTop: 1000
              })
            }, 1000)

            message.has_comment = true
            message.comment_count++

            that.setData({
              message: message,
              comment: null,
              commentId: null,
              placeholder: "评论点什么吧..."
            })
          } else {
            wx.lin.showMessage({
              type: "error",
              content: "评论失败！"
            })
          }
        })
      }
    })
  },

  /**
   * 删除评论
   */
  deleteComment(event) {
    wx.lin.showDialog({
      type: "confirm",
      title: "提示",
      content: "确定要删除该评论？",
      success: (res) => {
        if (res.confirm) {
          const commentId = event.currentTarget.dataset.id
          const url = api.commentAPI + commentId + "/"

          wxutil.request.delete(url).then((res) => {
            if (res.data.code == 200) {
              this.getComments(this.data.message.id)

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

  onShareAppMessage() {
    return {
      title: this.data.message.content,
      imageUrl: this.data.message.images ? this.data.message.images[0] : '',
      path: "/pages/message-detail/index?messageId=" + this.data.message.id
    }
  }
})