var app = getApp();
var start, end, sT, eT;
Page({
    data: {
        year: new Date().getFullYear(), //年
        month: new Date().getMonth(), //月
        week: '', //星期
        days: '', //总天数
        date: [], //存放日期数据的数组
        textIndex: 0,

    },
    onReady() {
        this.setDate() //初始化档期
    },
    onLoad() {
        this.setData({ //给总天数和 星期赋值
            days: this.setDay(),
            week: new Date(this.data.year, this.data.month, 1).getDay()
        })
    },
    navAddClass(e) { //切换标签
        this.setData({
            showView: e.target.dataset.index
        })
    },
    setDay() { //获得一个月的天数
        let num = new Date(this.data.year, this.data.month + 1, 0).getDate();
        return num;
    },
    setDate(year = this.data.year, month = this.data.month, id = 188) { //渲染档期
        let arr = [],
            opacity = 0,
            operation = 'no',
            time = new Date();
        for (let j = 0; j < this.data.week; j++) {
            arr.push({ opacity: opacity })
        }
        for (let i = 1; i <= this.data.days; i++) {
            if (new Date(year, month, i, 12, 0, 0) <= time || new Date(year, month, i) >= new Date(new Date().setMonth(time.getMonth() + 3))) {
                opacity = 0.5;
                operation = 'no'
            } else {
                opacity = 1;
                operation = 'yes'
            }
            arr.push({ year: year, month: month, day: i, opacity: opacity, operation: operation, class: '' })
        }
        wx.request({
            url: 'https://cq.jfr121314.com/photoer/scheduleInfo',
            data: {
                'photoer_id': id,
                'year': year,
                'month': month
            },
            success: (res) => {
                let date = { schedule: [{ start: '2017-12-01', end: '2017-12-03' }, { start: '2017-12-13', end: '2017-12-22' }], attempt: [{ start: '2017-12-06', end: '2017-12-12' }, { start: '2017-12-26', end: '2017-12-30' }] }
                let schedule = res.data.schedule;
                let attempt = res.data.attempt;
                for (let i of arr) {
                    if (i.year) {
                        for (let x of schedule) {
                            if (new Date(x.start) <= new Date(i.year, i.month, i.day, 12) && new Date(x.end) >= new Date(i.year, i.month, i.day)) {
                                i.class = 'schedule'
                            }
                        }
                        for (let y of attempt) {
                            if (new Date(y.start) <= new Date(i.year, i.month, i.day, 12) && new Date(y.end) >= new Date(i.year, i.month, i.day)) {
                                i.class = 'attempt';
                            }
                        }
                    }
                }
                this.setData({
                    date: arr
                })
            },
            fail(err) {
                console.log(err)
            }
        })
    },
    nextMonth() { //下一个月
        this.setData({
            month: this.data.month + 1
        })
        if (this.data.month > 11) {
            this.setData({
                month: 0,
                year: this.data.year + 1
            })
        }
        this.setData({
            week: new Date(this.data.year, this.data.month, 1).getDay(),
            days: this.setDay()
        })
        this.setDate();
    },
    prevMonth() { //上一个月
        this.setData({
            month: this.data.month - 1
        })
        if (this.data.month < 0) {
            this.setData({
                month: 11,
                year: this.data.year - 1
            })
        }
        this.setData({
            week: new Date(this.data.year, this.data.month, 1).getDay(),
            days: this.setDay()
        })
        this.setDate();
    },
    reserve(e) { //点击档期 判断是否可以预定 并执行事件
        let data = e.target.dataset;
        let isReserve = data.operation;
        let status = data.status;
        let appointmentDate = `${data.year}-${data.month+1}-${data.day<10?'0'+data.day:data.day}`;
        app.globalData.date = appointmentDate;
        if (isReserve == 'yes' && status == '') {
            wx.navigateTo({ url: '/pages/appointment/appointment' })
        } else {
            return;
        }
    },
    touchStart(e) {
        start = e.touches[0].pageX;
        sT = Date.now()
    },
    touchEnd(e) {
        end = e.changedTouches[0].pageX;
        eT = Date.now()
        if ((end - start) > 50) {
            this.prevMonth()
        } else if ((end - start) < -50) {
            this.nextMonth()
        }

    },
    bindReturn() { //跳转主界面
        wx.navigateBack()
    }
})