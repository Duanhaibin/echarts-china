/**
 * 地图
 * @param {fn} con 全国
 * @param {fn} area 省区
 */
var charMap = function(con, area) {

    // 默认 dom
    var map = echarts.init(document.getElementById('chart_map'));

    // 获取最大值
    var maxfilter = function(arr) {
        return Math.max.apply(Math, arr.map(function (t) {
            return t.value;
        }));
    };

    var _init = function(data) {
        // 默认加载全国数据
        con && con(function(data) {
            setOption(data);
        });
    };

    // 标记已经下载的 JSON 文件
    var tag = [];

    /**
     * 更新数据
     * @param {obj} res
     * @param {str} type
     */
    var setOption = function (res, type) {
        if (!type) {
           option.series[0].mapType = 'china';
           option.map_home = true;
        } else {
           option.series[0].mapType = type;
           option.map_home = false;
        }

        option.title.subtext = res.count ? '(总数: ' + res.count + ')' : '';
        option.series[0].data = res.data;
        option.dataRange.max = maxfilter(res.data);

        // 当 已经下载过 此JSON文件 不再反复请求
        if (tag.some(function(t) {
                if (t.n == option.series[0].mapType) {
                    echarts.registerMap(option.series[0].mapType, t.v);
                    map.setOption(option);
                    return true
                }
            })) {
            return
        }

        // 获取地图数据
        $.get('/map/'+ prevName[option.series[0].mapType] +'.json',function(json) {
            echarts.registerMap(option.series[0].mapType, json);
            map.setOption(option);
            tag.push({
                n: option.series[0].mapType,
                v: json
            });
        });
    };

    // 地图配置项
    // @api http://echarts.baidu.com/echarts2/doc/example/map3.html
    var option = {
        map_home: true,
        title: {
            text: '导游全国分布',
            subtext: '',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (data, ticket, callback) {
                var res = '地区: ' + data.name + '<br/>';
                res += '总数: ' + data.value + '<br/>';
                return res;
            }
        },
        dataRange: {
            min: 0,
            max: 100,
            color: ['#bf444c', '#f6efa6'],
            text: ['高', '低'],
            calculable: true
        },
        series: [{
            name: '',
            type: 'map',
            mapType: 'china',
            selectedMode: 'single',
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            fontSize: 12,
                        }
                    }
                },
                emphasis: {
                    label: {
                        show: true
                    }
                }
            },
            data: []
        }]
    };

    var prevName = {
        "china":"china",
        "广东":"guangdong",
        "青海":"qinghai",
        "四川":"sichuan",
        "海南":"hainan",
        "陕西":"shanxi1",
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
        "内蒙古":"neimenggu",
        "西藏":"xizang",
        "北京":"beijing",
        "天津":"tianjin",
        "上海":"shanghai",
        "重庆":"chongqing",
        "香港":"xianggang",
        "澳门":"aomen"
    };

    // 地图点击事件
    map.on('click', function (param) {
        console.log(param)
        if (!option.map_home) {
            _init();
            return
        }

        var target = param.name;
        // 获取省级数据
        area && area(target, function(data) {
            setOption(data, target)
        });
    });

    _init();

    // 直接调用
    return setOption
};


$.fn.extend({
    /**
     * 垂直柱状图
     * @param {obj} res
     * @param {str} charTitle
     * @param {obj} grid 位置
     */
    charVerbar: function (res, charTitle, grid) {
        // 默认 dom
        var char = echarts.init(this[0]);
        var x = [], y = [];

        res.data.sort(function(a, b){
            return a.value - b.value
        }).forEach(function(t) {
            y.push(t.name);
            x.push(t.value);
        })

        var option = {
            title : {
                text: charTitle,
                subtext: res.count ? '(总数: ' + res.count + ')' : '',
                x: 'center'
            },
            grid: grid || {
                x: 110,
                y: 60,
                x2: 18,
                y2: 26,
            },
            tooltip : {
                trigger: 'axis'
            },
            calculable : true,
            xAxis : [
                {
                    type : 'value',
                    boundaryGap : [0, 0.01]
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    axisLabel: {
                        interval: 0
                    },
                    data : y
                }
            ],
            series : [
                {
                    name:'数量',
                    type:'bar',
                    data: x
                }
            ]
        };

        char.setOption(option);

        return this;
    },

    /**
     * 普通柱状图
     * @param {obj} res
     */
    charBar: function (res, charTitle) {
        // 默认 dom
        var char = echarts.init(this[0]);
        var x = [], y = [];

        res.data.sort(function(a, b){
            return a.value - b.value
        }).forEach(function(t) {
            x.push(t.name);
            y.push(t.value);
        })

        var option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                x: 40,
                y: 20,
                x2: 18,
                y2: 40,
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: x
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: y
                }
            ]
        };

        char.setOption(option);

        return this;
    },

    /**
     * 饼状图
     * @param {obj} res
     */
    charPie: function (res, charTitle) {
       // 默认 dom
       var char = echarts.init(this[0]);

       var option = {
            title : {
                text: charTitle,
                subtext: res.count ? '(总数: ' + res.count + ')' : '',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)" // {a} <br/>
            },
            calculable : true,
            series : [
                {
                    // name:'统计占比',
                    type:'pie',
                    radius : '56%',
                    center: ['50%', '60%'],
                    data: res.data
                }
            ]
        };

        char.setOption(option);

        return this;
    }
})
