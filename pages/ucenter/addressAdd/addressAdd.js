var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    idLists:[],
    address: {
      ContactName: "",
      ContactLastName: "",
      ContactPhoneNumber: "",
      ContactPhoneCountryId: -1,
      Address1: "",
      Address2: "",
      City: "",
      State: "",
      Zip: "",
      CountryId: -1,
      DefaultShipping: true,
      IDList : []
    },
    addressId: 0,
    openSelectRegion: false,
    selectRegionList: [
      { id: 0, name: '省份', parent_id: 1, type: 1 },
      { id: 0, name: '城市', parent_id: 1, type: 2 },
      { id: 0, name: '区县', parent_id: 1, type: 3 }
    ],
    regionType: 1,
    regionList: [],
    selectRegionDone: false
  },

  bindinputContactName(event) {
    let address = this.data.address;
    address.ContactName = event.detail.value;
    this.setData({
      address: address
    });
  },

  bindinputContactLastName(event) {
    let address = this.data.address;
    address.ContactLastName = event.detail.value;
    this.setData({
      address: address
    });
  },

  bindinputContactPhoneNumber(event) {
    let address = this.data.address;
    address.ContactPhoneNumber = event.detail.value;
    this.setData({
      address: address
    });
  },

  bindinputIDNumber(event) {
    let address = this.data.address;
    address.IDNumber = event.detail.value;
    this.setData({
      address: address
    });
  },

  bindinputAddress1(event) {
    let address = this.data.address;
    address.Address1 = event.detail.value;
    this.setData({
      address: address
    });
  },

  bindinputAddress2(event) {
    let address = this.data.address;
    address.Address2 = event.detail.value;
    this.setData({
      address: address
    });
  },

  bindinputCity(event) {
    let address = this.data.address;
    address.City = event.detail.value;
    this.setData({
      address: address
    });
  },

  bindinputState(event) {
    let address = this.data.address;
    address.State = event.detail.value;
    this.setData({
      address: address
    });
  },

  bindinputZip(event) {
    let address = this.data.address;
    address.Zip = event.detail.value;
    this.setData({
      address: address
    });
  },

  bindinputMobile(event) {
    let address = this.data.address;
    address.mobile = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputName(event) {
    let address = this.data.address;
    address.name = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputAddress (event){
    let address = this.data.address;
    address.address = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindIsDefault(){
    let address = this.data.address;
    address.DefaultShipping = !address.DefaultShipping;
    this.setData({
      address: address
    });
  },
  getAddressDetail() {
    let that = this;
    util.request(api.AddressDetail, { id: that.data.addressId }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          address: res.data
        });
      }
    });
  },
  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      return item.id != 0;
    });

    that.setData({
      selectRegionDone: doneStatus
    })

  },
  chooseRegion() {
    let that = this;
    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    });

    //设置区域选择数据
    let address = this.data.address;
    if (address.province_id > 0 && address.city_id > 0 && address.district_id > 0) {
      let selectRegionList = this.data.selectRegionList;
      selectRegionList[0].id = address.province_id;
      selectRegionList[0].name = address.province_name;
      selectRegionList[0].parent_id = 1;

      selectRegionList[1].id = address.city_id;
      selectRegionList[1].name = address.city_name;
      selectRegionList[1].parent_id = address.province_id;

      selectRegionList[2].id = address.district_id;
      selectRegionList[2].name = address.district_name;
      selectRegionList[2].parent_id = address.city_id;

      this.setData({
        selectRegionList: selectRegionList,
        regionType: 3
      });

      this.getRegionList(address.city_id);
    } else {
      this.setData({
        selectRegionList: [
          { id: 0, name: '省份', parent_id: 1, type: 1 },
          { id: 0, name: '城市', parent_id: 1, type: 2 },
          { id: 0, name: '区县', parent_id: 1, type: 3 }
        ],
        regionType: 1
      })
      this.getRegionList(1);
    }

    this.setRegionDoneStatus();

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    if (options.address != 'undefined') {
      var tAddress = JSON.parse(options.address);
      console.log(tAddress.IDList);
      this.setData({
        address: tAddress,
        idLists: tAddress.IDList
      });
      //this.getAddressDetail();
    }


    //this.getRegionList(1);

  },
  onReady: function () {

  },
  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex-1].id <= 0)) {
      return false;
    }

    this.setData({
      regionType: regionTypeIndex + 1
    })
    
    let selectRegionItem = selectRegionList[regionTypeIndex];

    this.getRegionList(selectRegionItem.parent_id);

    this.setRegionDoneStatus();

  },
  selectRegion(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.data.regionList[regionIndex];
    let regionType = regionItem.type;
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;


    if (regionType != 3) {
      this.setData({
        selectRegionList: selectRegionList,
        regionType: regionType + 1
      })
      this.getRegionList(regionItem.id);
    } else {
      this.setData({
        selectRegionList: selectRegionList
      })
    }

    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.id = 0;
        item.name = index == 1 ? '城市' : '区县';
        item.parent_id = 0;
      }
      return item;
    });

    this.setData({
      selectRegionList: selectRegionList
    })


    that.setData({
      regionList: that.data.regionList.map(item => {

        //标记已选择的
        if (that.data.regionType == item.type && that.data.selectRegionList[that.data.regionType - 1].id == item.id) {
          item.selected = true;
        } else {
          item.selected = false;
        }

        return item;
      })
    });

    this.setRegionDoneStatus();

  },
  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }

    let address = this.data.address;
    let selectRegionList = this.data.selectRegionList;
    address.province_id = selectRegionList[0].id;
    address.city_id = selectRegionList[1].id;
    address.district_id = selectRegionList[2].id;
    address.province_name = selectRegionList[0].name;
    address.city_name = selectRegionList[1].name;
    address.district_name = selectRegionList[2].name;
    address.full_region = selectRegionList.map(item => {
      return item.name;
    }).join('');

    this.setData({
      address: address,
      openSelectRegion: false
    });

  },
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });

  },
  getRegionList(regionId) {
    let that = this;
    let regionType = that.data.regionType;
    util.request(api.RegionList, { parentId: regionId }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          regionList: res.data.map(item => {

            //标记已选择的
            if (regionType == item.type && that.data.selectRegionList[regionType - 1].id == item.id) {
              item.selected = true;



            } else {
              item.selected = false;
            }

            return item;
          })
        });
      }
    });
  },
  cancelAddress(){
    wx.navigateBack({
      delta: -1
    });
  },
  saveAddress(){
    console.log(this.data.address)
     let address = this.data.address;
    address.ContactPhoneCountryId = 37;
    address.CountryId = 37;
    address.Available = true;
    address.IDList = this.data.idLists;

    // if (address.name == '') {
    //   util.showErrorToast('请输入姓名');

    //   return false;
    // }

    // if (address.mobile == '') {
    //   util.showErrorToast('请输入手机号码');
    //   return false;
    // }


    // if (address.district_id == 0) {
    //   util.showErrorToast('请输入省市区');
    //   return false;
    // }

    // if (address.address == '') {
    //   util.showErrorToast('请输入详细地址');
    //   return false;
    // }
    console.log(address);
    util.request(api.CustomerAddressCreateUpdate, address, 'POST').then(function (res) {
      wx.navigateBack({
        delta: -1
      });
      
    });

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  chooseimage: function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
        
    })
  },
  chooseWxImage: function (type) {
    var that = this;
    let idLists = this.data.idLists;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(res);
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          var tArray = tempFilePaths[i].split('.');
          var ext = tArray[tArray.length-1];
          
          wx.uploadFile({
            url: api.FileUpload +ext,
            filePath: tempFilePaths[i],
            name: 'uploadfile_ant',
            // formData: {
            //   'imgIndex': i
            // },
            header: {
              "Content-Type": "multipart/form-data",
              'ANTToken': wx.getStorageSync('token')
            },
            success: function (res) {
              console.log(res.data);
              uploadImgCount++;
              if(res.data){
                var address = JSON.parse(res.data)
                idLists.push(address);
                that.setData({
                  idLists
                })

              }

              //如果是最后一张,则隐藏等待中
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }        
      }
    });


    
  },
  deleteImageTap:function(event){
    let index = event.target.dataset.addressIndex;
    let idLists = this.data.idLists;
    idLists.splice(index, 1);
    this.setData({
      idLists: idLists
    })
  }
})