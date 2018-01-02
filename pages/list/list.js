Page({
    data: {
        isFilter: true,
        list: []
    },
    bindFilter() {
        wx.navigateTo({ url: "../index/index" })
    },
    bindFilterHot() {
        this.setData({
            isFilter: true
        })
    },
    bindFilterTime() {
        this.setData({
            isFilter: false
        })
    },
    ajax() {
        wx.request({
            url: "https://cq.jfr121314.com/photoer/listData",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            data: {
                page: 1,
                work_tags: "",
                master_level: "",
                store_id: "",
                start_date: "",
                end_date: "",
                order_by: ""
            },
            success(res) {
                console.log(res)
            },
            fail(err) {
                console.log(err)
            }

        })
    },
    onLoad() {
        this.ajax()
    }
})