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

  },
  getAddressList (){
    let that = this;
    util.request(api.Customer).then(function (res) {
      console.log(res)
      var testitem = {

        "CustomerId": 1,
        "ContactName": "sample string 1",
        "ContactLastName": "sample string 2",
        "ContactPhoneNumber": "sample string 3",
        "ContactPhoneCountryId": 1,
        "Address1": "sample string 4",
        "Address2": "sample string 5",
        "City": "sample string 6",
        "State": "sample string 7",
        "Zip": "sample string 8",
        "CountryId": 1,
        "IDNumber": "sample string 9",
        "DefaultShipping": true,
      };
      res.AddressList.push(testitem)
      testitem = {

        "CustomerId": 2,
        "ContactName": "sample string 1",
        "ContactLastName": "sample string 2",
        "ContactPhoneNumber": "sample string 3",
        "ContactPhoneCountryId": 1,
        "Address1": "sample string 4",
        "Address2": "sample string 5",
        "City": "sample string 6",
        "State": "sample string 7",
        "Zip": "sample string 8",
        "CountryId": 1,
        "IDNumber": "sample string 9",
        "DefaultShipping": true,
      },
      res.AddressList.push(testitem)
      that.setData({
        addressList: res.AddressList
      });
    });
  },
  addressAddOrUpdate (event) {
    console.log(event)
    wx.navigateTo({
      url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
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
          util.request(api.AddressDelete, { id: addressId }, 'POST').then(function (res) {
            if (res.errno === 0) {
              that.getAddressList();
            }
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