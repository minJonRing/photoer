//app.js
App({
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
            // this.getUid()
        this.getLoginInfo(this.getRoot())

        //扫描二维码获取参数
        // wx.scanCode({
        //     success: (res) => {
        //         console.log(res)

        //     }
        // })
        // wx.getExtConfig({ //获取第三方自定义参数
        //     success: (res) => {
        //         console.log(res)
        //         this.globalData._id = res.extConfig
        //     }
        // })

        this.getStore()

    },
    getUserInfo(cb) {
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: (res) => {
                    console.log(res)
                    wx.getUserInfo({
                        success: (res) => {
                            this.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(this.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    /**
     *@wx.checkSession 判断用户登入是否过期
     *@wx.login 刷新用户登入状态
     *@wx.request 获取用户code和key 并保存在wx.setStorageSync
     */
    getLoginInfo(fn) {
        wx.checkSession({
            success: () => {
                console.log('用户登入没过期')
                console.log(wx.getStorageSync('thirdpartyUserinfo'))
                fn ? fn() : null;
            },
            fail: () => {
                console.log('用户登入过期')
                wx.login({
                    success: (res) => {
                        wx.request({ //获取openid _key 有uid也返回uid
                            url: "https://cq.jfr121314.com/site/getUserUnionId",
                            method: 'GET',
                            data: {
                                code: res.code
                            },
                            success: (res) => {
                                wx.setStorageSync('code', res.data.data)
                                console.log(res.data.data)
                                fn ? fn() : null;
                            }
                        })
                    }
                })
            }
        })
    },
    /**
     *@wx.getSetting 判断用户授权状态
     *@wx.getUserInfo 获取用户基本信息
     *@wx.request 获取用户唯一标识uid
     */
    getRoot() { //获取权限
        wx.getSetting({ //判断用户是否授权
            success: (res) => {
                if (!res.authSetting['scope.userInfo']) {
                    this.getUid()
                }
            }
        })
    },
    /**
     *@wx.getUserInfo 获取用户基本信息
     *@wx.request url:https://cq.jfr121314.com/site/decrypt  获取uid唯一标识
     *@wx.request url:https://cq.jfr121314.com/site/smallWechatLogin  获取第三方用户信息
     */
    getUid() {
        wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
                wx.setStorageSync('userinfo', res)
                let sessionkey = wx.getStorageSync('code').session_key
                wx.request({
                    url: "https://cq.jfr121314.com/site/decrypt",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: "POST",
                    data: {
                        encryptedData: res.encryptedData,
                        iv: res.iv,
                        session_key: sessionkey
                    },
                    success: (res) => {
                        let data = JSON.parse(res.data.data)
                        data.headimgurl = data.avatarUrl
                        wx.setStorageSync('uid', data)
                        wx.request({
                            url: 'https://cq.jfr121314.com/site/smallWechatLogin',
                            method: "GET",
                            data: {
                                user_info: data
                            },
                            success: (res) => {
                                wx.setStorageSync('thirdpartyUserinfo', res.data.data)
                            }
                        })
                    }
                })
            }
        })
    },
    /**
     *@wx.request url:https://cq.jfr121314.com/site/getStoreSelect 获取所有的门店信息
     */
    getStore() {
        wx.request({
            url: 'https://cq.jfr121314.com/site/getStoreSelect',
            method: "GET",
            success: (res) => {
                wx.setStorageSync('store', res.data.data)
            }
        })
    },
    globalData: {
        userInfo: null,
        photographer: '',
        date: '',
        _id: ''
    }
})