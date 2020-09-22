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
    row: [],
    msg: '暂无数据',
    start: null,
    end: null,
    peopleName: null
  },

  /** 
   * 点击表格一行
   */
  onRowClick: function(e) {
    let header = this.data.tableHeader;
    //组件行列互换了。。。
    let dataColumn = e.detail.currentTarget.dataset.row;
    let dataRow = e.detail.currentTarget.dataset.column;
    // overDateStart="+start+"&overDateEnd="+end+"&peopleName="+peopleName
    if(header[dataColumn].prop == 'option'){
      let clickRow = this.data.row[dataRow-1];
      wx.navigateTo({
        url: "/pages/overtime-query-detail/index?overDateStart="+this.data.start+"&overDateEnd="+this.data.end+"&peopleName="+clickRow.peopleName,
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

    this.setData({
      start: start,
      end: end,
      peopleName: peopleName
    })
    this.queryRecord()
  },

  queryRecord: function(){
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

    const url = api.backupAPI+"overtime/";
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
            retdata[i].option='明细';
            retdata[i].seqNo= ++seqNo;
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
          content: "查询数据失败！"
        })
      }
    })
  },

  
})