//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        motto: 'Hello World',
        photographer: '', //摄影师信息
        commentNum: 99, //评论的总页数
        comment: '', //评论的数组
        score: 0, //摄影师的满意度
        page: 2, //评论分页数
        bl: true,
        _id: ''
    },
    //事件处理函数
    bindViewTap: function() { //跳转预约界面
        let date = new Date();
        let now = `${date.getFullYear()}-${parseInt(date.getMonth() + 1)}-${date.getDate()>10?date.getDate():'0'+date.getDate}`;
        app.globalData.date = now;
        wx.navigateTo({
            url: '../appointment/appointment'
        })

    },
    bindDateTap() { //跳转档期界面
        wx.navigateTo({ url: "../photographer/photographer" })
    },
    getComment(uid = 418, page = 1) { // 获取用户评论  默认UID->418 PAGE->1
        wx.request({
            url: "https://cq.jfr121314.com/photoer/commentList",
            data: {
                photoer_uid: uid,
                page: page
            },
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
                let data = res.data

                this.setData({
                    bl: true
                })

                if (data.data.list) { //当用户评论存在 执行
                    for (let i of data.data.list) {
                        i.score = Math.ceil(i.score / 20) - 1
                    }
                    this.setData({
                        commentNum: Math.ceil(data.data.total / data.data.pageSize),
                        comment: data.data.list
                    })
                }
            },
            fail(err) {
                console.log(err)
            }
        })
    },
    onReachBottom() { //加载评论
        if (this.data.page <= this.data.commentNum && this.data.bl) {
            this.setData({
                bl: false
            })
            this.getComment(this.data.photographer.photographer.uid, this.data.page);
            this.setData({
                page: this.data.page + 1
            })
        } else if (this.data.bl) {
            wx.showToast({
                title: '无更多数据!'
            })
        }
    },
    onLoad: function() {
        //调用应用实例的方法获取全局数据
        // app.getUserInfo(function(userInfo) {
        //     //更新数据
        //     app.globalData.userInfo = 'userInfo' //设置用户信息
        // })
        // app.getUid()
        this.setData({
            _id: JSON.stringify(app.globalData._id)
        })
        wx.request({
            url: "https://cq.jfr121314.com/photoer/info",
            data: {
                'photographer_id': 188
            },
            method: "GET",
            success: (res) => {
                let data = res.data.data; //获取数据

                this.setData({ //设置摄影师的满意度
                    score: data.score
                })
                data.score = Math.ceil(data.score / 20) - 1 //设置摄影师的星星数

                this.setData({ //设置摄影师的数据
                    photographer: data
                });
                app.globalData.photographer = data; //设置全局摄影师的数据

                // 获取用户评论
                this.getComment(data.photographer.uid)
            },
            fail(err) {
                console.log(err)
            }
        })
    }
})