// pages/activity-query-detail/index.js
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
        prop: 'activityDate',
        width: 200,
        label: '时间'
      },
      {
        prop: 'week',
        width: 160,
        label: '星期'
      },
      {
        prop: 'peopleName',
        width: 110,
        label: '人员'
      },
      {
        prop: 'cost',
        width: 110,
        label: '金额'
      },
      {
        prop: 'activityDesc',
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
    end: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let start = options.activityDateStart;
    let end = options.activityDateEnd;

    this.setData({
      start: start,
      end: end
    })

    this.queryRecord()
  },
  queryRecord: function(){
    let start = this.data.start;
    let end = this.data.end;

    let data = {}
    if(start!=null && start != 'null'){
      data.start=start;
    }
    if(end!=null && end != 'null'){
      data.end=end;
    }

    const url = api.backupAPI+"activity/";
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
            retdata[i].activityDate= retdata[i].activityDate.substring(0, 10);
            if(retdata[i].activityDateDesc==null || retdata[i].activityDateDesc=='null'){
              retdata[i].activityDateDesc='';
            }
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
  }
  
})