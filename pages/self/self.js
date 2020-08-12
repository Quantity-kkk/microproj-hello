// pages/self/self.js
const moment = require('../../utils/moment.min.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      //绑定按钮
      wx.setNavigationBarTitle({
        title: 'ZBB-我的'
      })
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

  },
  
  /**
   * 获取随机手机号码
  */
  getRandomPhoneNum: function(){
    let head = ["1590230","1592341","1592391","159898",
    "1822352","1862325","1890830","189836",
    "1898367","1880230","1872317","1871687",
    "1582635","1572334"];
    let nums = ['1','2','3','4','5','6','7','8','9','0'];
    let idx = Math.floor(Math.random()*head.length);
    let ret = head[idx];
    for(var i =0 ; i < 5; i++){
      ret += nums[Math.floor(Math.random()*10)];
    }
    wx.showModal({
      title:'随机电话号码',
      showCancel: false,
      confirmText: '关闭',
      content: ret
    });
  },
  /**
   * 获取随机身份证号
  */
 getRandomIdNum: function(){
    let genId = this.getId_no();
    wx.showModal({
      title:'随机身份证号',
      showCancel: false,
      confirmText: '关闭',
      content: genId
    })
  },

  getId_no: function(){
    // 加权因子
    var coefficientArray = [ "7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2"];
    // 校验码
    var lastNumberArray = [ "1","0","X","9","8","7","6","5","4","3","2"];
    // 地址范围
    var areaList = ['500101','500102','500103','500104','500105','500106','500107','500108','500109','500110','500111','500112','500113','500114','500115','500116','500117','500118','500119','500222','500223','500224','500225','500226','500227','500228','500229','500230','500231','500232','500233','500234','500235','500236','500237','500238','500240','500241','500242','500243'];
    // 住址
    var address = areaList[Math.floor(Math.random()*areaList.length)]; 
    // 生日
    var birthday = this.getRandomDate();

    var s = Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString();
    var array = (address + birthday + s).split(""); 
    var total = 0;
    for(let i in array){
      total = total + parseInt(array[i])*parseInt(coefficientArray[i]);
    } 
    var lastNumber = lastNumberArray[parseInt(total%11)];
    var id_no_String = address + birthday + s + lastNumber;
    return id_no_String;
  },

  getRandomDate: function(){
    var max = new Date(2005,0,1,8).getTime();
    var min = new Date(1950,0,1,8).getTime();
    min = Math.ceil(min);
    max = Math.floor(max);
    return moment(Math.floor(Math.random() * (max - min + 1)) + min).format("YYYYMMDD");
  }
})
