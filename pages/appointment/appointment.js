//logs.js
var util = require('../../utils/util.js')

var date = new Date();
// var now = date.getFullYear() + '-' + parseInt(date.getMonth() + 1) + '-' + date.getDate();
var app = getApp();
Page({
    data: {
        store: ['奥斯卡', '爱情海'],
        items: [
            { name: '男', value: '男' },
            { name: '女', value: '女', checked: 'true' },
        ],
        startDate: null,
        endDate: null,
        index: 0,
        sex: 'gril',
        phone: '',
        name: '',
        username: '',
        shade: false,
        storeName: [],
        storeId: [],
        order: '',
        qq: '',
        remark: '',
        photoer_id: '',
        user_id: wx.getStorageSync('thirdpartyUserinfo').user_id
    },
    bindPickerChange: function(e) { //设置门店编号 0,1,2
        this.setData({
            index: e.detail.value
        })
    },
    bindStartDateChange: function(e) { //设置开始时间
        this.setData({
            startDate: e.detail.value
        })
    },
    bindEndDateChange: function(e) { //设置结束时间
        this.setData({
            endDate: e.detail.value
        })
    },
    bindSetUsername(e) { //设置用户姓名
        this.setData({
            username: e.detail.value
        })
    },
    bindRadioChange(e) { //设置性别
        this.setData({
            sex: e.detail.value
        })
    },
    bindPhoneChange(e) { //设置手机号
        this.setData({
            phone: e.detail.value
        })
    },
    bindOrderChange(e) {
        this.setData({
            order: e.detail.value
        })
    },
    bindQqChange(e) {
        this.setData({
            qq: e.detail.value
        })
    },
    bindRemarkChange(e) {
        this.setData({
            remark: e.detail.value
        })
    },
    getPhoneNumber(e) { //获取手机号
        wx.request({
            url: "https://cq.jfr121314.com/site/decrypt",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            data: {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                session_key: wx.getStorageSync('code').session_key
            },
            success: (res) => {
                console.log(res)
                this.setData({
                    phone: JSON.parse(res.data.data).phoneNumber
                })
            }
        })
    },
    bindShowShade(e) {
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userInfo']) {
                    wx.openSetting({
                        success(res) {
                            if (res.authSetting['scope.userInfo']) {
                                app.getUid()
                            }
                        }
                    })
                } else {
                    this.setData({
                        shade: true
                    })
                }
            }
        })
    },
    formSubmit(e) {
        wx.request({
            url: "https://cq.jfr121314.com/photoer/attempt",
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            data: e.detail.value,
            success: (res) => {
                this.setData({
                    shade: false
                })
                wx.showToast({
                    title: res.data.msg,
                    icon: 'success'
                })
            }
        })
    },
    bindClose() { //关闭订单确认信息
        this.setData({
            shade: false
        })
    },
    /**
     * @初始化数据
     * @name 摄影师名字
     * @username 用户名字
     * @startDate 预约档期
     * @store 门店信息
     * @photoer_id 摄影师UID
     */
    onLoad: function() {
        let storeName = [],
            storeId = []
        for (let i in wx.getStorageSync('store')) {
            storeName.push(wx.getStorageSync('store')[i].name)
            storeId.push(wx.getStorageSync('store')[i].id)
        }
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(function(log) {
                return util.formatTime(new Date(log))
            }),
            name: app.globalData.photographer.photographer.nickname,
            username: wx.getStorageSync('thirdpartyUserinfo').nickname,
            startDate: app.globalData.date,
            endDate: app.globalData.date,
            store: wx.getStorageSync('store'),
            storeName: storeName,
            storeId: storeId,
            photoer_id: app.globalData.photographer.photographer.uid
        })
    }

})