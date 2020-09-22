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
    row: [],
    msg: '暂无数据',
    start: null,
    end: null,
    peopleName: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let start = options.overDateStart;
    let end = options.overDateEnd;
    let peopleName = options.peopleName;

    this.setData({
      start: start,
      end: end,
      peopleName: peopleName
    })

    this.queryRecordDetail()
  },

  queryRecordDetail: function(){
    let start = this.data.start;
    let end = this.data.end;
    let peopleName = this.data.peopleName

    let data = {}
    if(start!=null){
      data.start=start;
    }
    if(end!=null){
      data.end=end;
    }
    if(peopleName!=null&&peopleName!=''){
      data.peopleName=peopleName
    }

    const url = api.backupAPI+"overtime/detail/";
    wxutil.request.get(url, data).then((res) => {
      if (res.data.code == 200) {
        let retdata = res.data.data;
        //将返回的数据转为需要的格式

        let oldData = this.data.row;
        let seqNo = 0;
        if(oldData!=null && oldData.length>0){
          seqNo = oldData[oldData.length-1].seqNo;
        }
        
        if(retdata!=null && retdata.length>0){
          let tmpdata = [];
          for(let i=0; i<retdata.length;i++){
            retdata[i].seqNo= ++seqNo;
            retdata[i].overDate= retdata[i].overDate.substring(0, 10);
            tmpdata.push(retdata[i]);
          }
          if(oldData!=null && oldData.length>0){
            this.setData({
              row: oldData.concat(tmpdata)
            })
          }else{
            this.setData({
              row: tmpdata
            })
          }
        }

      } else {
        wx.lin.showMessage({
          type: "error",
          content: "加载详情失败！"
        })
      }
    })
  },
})