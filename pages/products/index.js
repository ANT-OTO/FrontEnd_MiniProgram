var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp()
Page({
  data: {
    keywrod: '',
    searchStatus: false,
    goodsList: [],
    helpKeyword: [],
    historyKeyword: [],
    categoryFilter: false,
    currentSortType: 'default',
    currentSortOrder: '',
    filterCategory: [],
    defaultKeyword: {},
    hotKeyword: [],
    page: 1,
    size: 10,
    currentSortType: 'id',
    currentSortOrder: 'desc',
    categoryId: 0,
    isHideLoadMore: true

  },
  //事件处理函数
  closeSearch: function () {
    wx.navigateBack()
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  onLoad: function () {

    //this.getSearchKeyword();
    this.getSearchResult();

  },

  getSearchKeyword() {
    // let that = this;
    // util.request(api.SearchIndex).then(function (res) {
    //   if (res.errno === 0) {
    //     that.setData({
    //       historyKeyword: res.data.historyKeywordList,
    //       defaultKeyword: res.data.defaultKeyword,
    //       hotKeyword: res.data.hotKeywordList
    //     });
    //   }
    // });
  },

  inputChange: function (e) {

    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });
    //this.getHelpKeyword();
  },
  getHelpKeyword: function () {
    let that = this;
    util.request(api.SearchHelper, { keyword: that.data.keyword }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          helpKeyword: res.data
        });
      }
    });
  },
  inputFocus: function () {
    this.setData({
      //searchStatus: false,
      // /goodsList: []
    });

    if (this.data.keyword) {
      //this.getHelpKeyword();
    }
  },
  clearHistory: function () {
    this.setData({
      historyKeyword: []
    })

    util.request(api.SearchClearHistory, {}, 'POST')
      .then(function (res) {
        console.log('清除成功');
      });
  },
  searchClick: function(){
    this.getGoodsList();

  },

  getGoodsList: function () {
    let that = this;
    console.log(that.data.keyword);

    util.request(api.CustomerOnSaleItemSearch, { ProductName: that.data.keyword, Page: 1, PageSize: that.data.size}, 'POST').then(function (res) {
      console.log(res)

      that.setData({
        searchStatus: true,
        categoryFilter: false,
        goodsList: res.records,
        // filterCategory: res.data.filterCategory,
        page: res.CurrentPage,
        //size: res.data.numsPerPage
        //size:20
      });

      //重新获取关键词
      that.getSearchKeyword();
    });
  },
  onKeywordTap: function (event) {

    this.getSearchResult(event.target.dataset.keyword);

  },
  onReachBottom: function () {
    let that = this;

    if (that.data.isHideLoadMore){
      console.log('加载更多')
      this.setData({
        isHideLoadMore: false
      });
      util.request(api.CustomerOnSaleItemSearch, { ProductName: that.data.keyword, Page: that.data.page + 1, PageSize: that.data.size }, 'POST').then(function (res) {
        console.log(res)
        if (res.CurrentPage == that.data.page + 1) {
          var newGoodList = that.data.goodsList.concat(res.records);
          that.setData({
            searchStatus: true,
            categoryFilter: false,
            goodsList: newGoodList,
            // filterCategory: res.data.filterCategory,
            page: res.CurrentPage,
            //size: res.data.numsPerPage
            //size: 20,
            isHideLoadMore: true

          });

        }else{
          that.setData({
          
            isHideLoadMore: true

          });

        }

      });

    }
   
   
  },
  getSearchResult(keyword) {
    this.setData({
      //keyword: keyword,
      page: 1,
      categoryId: 0,
      goodsList: []
    });

    this.getGoodsList();
  },
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          'categoryFilter': !this.data.categoryFilter,
          'currentSortOrder': 'asc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'price',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false
        });

        this.getGoodsList();
        break;
      default:
        //综合排序
        this.setData({
          'currentSortType': 'default',
          'currentSortOrder': 'desc',
          'categoryFilter': false
        });
        this.getGoodsList();
    }
  },
  selectCategory: function (event) {
    let currentIndex = event.target.dataset.categoryIndex;
    let filterCategory = this.data.filterCategory;
    let currentCategory = null;
    for (let key in filterCategory) {
      if (key == currentIndex) {
        filterCategory[key].selected = true;
        currentCategory = filterCategory[key];
      } else {
        filterCategory[key].selected = false;
      }
    }
    this.setData({
      'filterCategory': filterCategory,
      'categoryFilter': false,
      categoryId: currentCategory.id,
      page: 1,
      goodsList: []
    });
    this.getGoodsList();
  },
  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  }
})