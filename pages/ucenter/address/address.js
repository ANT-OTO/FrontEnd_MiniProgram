var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    addressList: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getAddressList();

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getAddressList();

  },
  getAddressList (){
    let that = this;
    util.request(api.Customer).then(function (res) {
      console.log(res)
     
      that.setData({
        addressList: res.AddressList
      });
    });
  },
  addressAddOrUpdate (event) {
    console.log(event)
    var address = JSON.stringify(this.data.addressList[event.currentTarget.dataset.index])
   

    wx.navigateTo({
      url: '/pages/ucenter/addressAdd/addressAdd?address=' + address
    })
  },
  deleteAddress(event){
    console.log(event.target)
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function (res) {
        if (res.confirm) {
          let addressId = event.target.dataset.addressId;
          util.request(api.CustomerAddressCreateUpdate, { CustomerAddressId: addressId,Available:0}, 'POST').then(function (res) {
            that.getAddressList();
            
          });
          console.log('用户点击确定')
        }
      }
    })
    return false;
    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})