var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0
  },
 
  onLoad: function (options) {
    console.log("XXXXXXXXXXXXXXXXXXXXXXX")

    // 页面初始化 options为页面跳转所带来的参数

   


  },
  getCheckoutInfo: function () {
    let that = this;
    // util.request(api.CartCheckout, { addressId: that.data.addressId, couponId: that.data.couponId }).then(function (res) {
    //   if (res.errno === 0) {
    //     console.log(res.data);
    //     that.setData({
    //       checkedGoodsList: res.data.checkedGoodsList,
    //       checkedAddress: res.data.checkedAddress,
    //       actualPrice: res.data.actualPrice,
    //       checkedCoupon: res.data.checkedCoupon,
    //       couponList: res.data.couponList,
    //       couponPrice: res.data.couponPrice,
    //       freightPrice: res.data.freightPrice,
    //       goodsTotalPrice: res.data.goodsTotalPrice,
    //       orderTotalPrice: res.data.orderTotalPrice
    //     });
    //   }
    //   wx.hideLoading();
    // });

    util.request(api.Customer).then(function (res) {
      if (res.AddressList.length > 0){
        var tmp = null;
        for (var i in res.AddressList){
          if (res.AddressList[i].DefaultShipping){
            tmp = res.AddressList[i]
            
          }
        }
        console.log("############");
        console.log(tmp);

        if(tmp == null){
          tmp = res.AddressList[0];
        }
        if (that.data.addressId == 0 || !that.data.addressId){
          that.setData({
            checkedAddress: tmp,
            addressId: tmp.CustomerAddressId
          });
        }else{
          for (var i in res.AddressList) {
            if (res.AddressList[i].CustomerAddressId == that.data.addressId) {
              tmp = res.AddressList[i]
            }
          }
          that.setData({
            checkedAddress: tmp,
            addressId: tmp.CustomerAddressId
          });
        }
       

      }else{
        that.setData({
          checkedAddress: {id:-1}
        });
      }
      util.request(api.CustomerShoppingCartGet, {}, 'POST').then(function (res) {
        var tempCartTotal =
          {
            "goodsCount": res.Goods_Count,
            "goodsAmount": res.Goods_Amount,
            "checkedGoodsCount": 0,
            "checkedGoodsAmount": 0.00
          };

        that.setData({
          goodsTotalPrice: res.Goods_Amount,
          checkedGoodsList: res.ItemList,
        });
        wx.hideLoading();

      });

     
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    try {
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }

      var couponId = wx.getStorageSync('couponId');
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
    } catch (e) {
      // Do something when catch error
    }
    this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
     
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    let that = this;


    util.request(api.CustomerOrderCreateFromShoppingCart, { CustomerAddressId: this.data.addressId}, 'POST').then(res => {
      const orderId = 1;
      wx.redirectTo({
        url: '/pages/payResult/payResult?status=1&orderId=' + orderId
      });
      
      
    });
  }
})