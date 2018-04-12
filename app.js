const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

app.use('/', express.static(path.resolve(__dirname, 'src')))

var ls = {
    "广东":"guangdong",
    "青海":"qinghai",
    "四川":"sichuan",
    "海南":"hainan",
    "陕西":"shanxi",
    "甘肃":"gansu",
    "云南":"yunnan",
    "湖南":"hunan",
    "湖北":"hubei",
    "黑龙江":"heilongjiang",
    "贵州":"guizhou",
    "山东":"shandong",
    "江西":"jiangxi",
    "河南":"henan",
    "河北":"hebei",
    "山西":"shanxi",
    "安徽":"anhui",
    "福建":"fujian",
    "浙江":"zhejiang",
    "江苏":"jiangsu",
    "吉林":"jilin",
    "辽宁":"liaoning",
    "台湾":"taiwan",
    "新疆":"xinjiang",
    "广西":"guangxi",
    "宁夏":"ningxia",
    "内蒙古gu":"neimenggu",
    "西藏":"xizang",
    "北京":"beijing",
    "天津":"tianjin",
    "上海":"shanghai",
    "重庆":"chongqing",
    "香港":"xianggang",
    "澳门":"aomen"
}

/**
 * 全了个国
 */
app.get('/china', function(req, res) {

    const mapType = [
        '广东', '青海', '四川', '海南', '陕西',
        '甘肃', '云南', '湖南', '湖北', '黑龙江',
        '贵州', '山东', '江西', '河南', '河北',
        '山西', '安徽', '福建', '浙江', '江苏',
        '吉林', '辽宁', '台湾', '新疆',
        '广西', '宁夏', '内蒙古', '西藏',
        '北京', '天津', '上海', '重庆',
        '香港', '澳门'
    ];

    res.send({
        count: 15451,
        data: mapType.map(t => {
            return {
                name: t,
                value: randomData()
            }
        })
    })
    
})

/**
 * 区域
 */
app.get('/area', function(req, res) {

    const mapType = [
        '东城区', '西城区', '朝阳区', '丰台区', '石景山区',
        '海淀区', '门头沟区', '房山区'
    ];

    res.send({
        data: mapType.map(t => {
            return {
                name: t,
                value: randomData()
            }
        })
    })
    
})






function randomData() {
    return Math.round(Math.random()*1000);
}

module.exports = app.listen('8888', function(err) {
  if (err) {
		console.log(err)
		return
	}

  console.log('Open localhost:8888');
})
