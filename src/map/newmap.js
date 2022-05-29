function fnW(str) {
    var num;
    str >= 10 ? num = str : num = "0" + str;
    return num;
}
//获取当前时间
var timer = setInterval(function () {
    var date = new Date();
    var year = date.getFullYear(); //当前年份
    var month = date.getMonth(); //当前月份
    var data = date.getDate(); //天
    var hours = date.getHours(); //小时
    var minute = date.getMinutes(); //分
    var second = date.getSeconds(); //秒
    var day = date.getDay(); //获取当前星期几 
    var ampm = hours < 12 ? 'am' : 'pm';
    $('#time').html(fnW(hours) + ":" + fnW(minute) + ":" + fnW(second));
    $('#date').html('<span>' + year + '/' + (month + 1) + '/' + data + '</span><span>  ' + ampm + '</span><span>  周' + day + '</span>')
}, 1000)



function addScript(url){
	var script = document.createElement('script');
	script.setAttribute('type','text/javascript');
	script.setAttribute('src',url);
	document.getElementsByTagName('head')[0].appendChild(script);
}

addScript('../api/makeChart.js');



//-------------------------- 左上角表格chart1---------------------------//
var PRCmonth_chartdata1=[];
var PRCmonth_chartdata2=[];

var PRCmonth_chart_data,PRCmonth_chart_data2,PRCmonth_result;
PRCmonth_chart_data =  $.ajax({
    url: "../../assets/country_monthly_confirmed.json",//json文件位置，文件名
    type: "GET",//请求方式为get
    dataType: "json", //返回数据格式为json
    async: false,
    success: function(data) {//请求成功完成后要执行的方法 
    }
}); 

PRCmonth_chart_data2=PRCmonth_chart_data.responseText;
PRCmonth_result=$.parseJSON(PRCmonth_chart_data["responseText"])	

// console.log('PRCmonth_result', PRCmonth_result);


var PRCmonth_length=29;
for(var i=0;i<PRCmonth_length;i++){
    var index1=PRCmonth_result[i]['updateMonth'];
    var index2=PRCmonth_result[i]['contry_monthly_confirmedCount'];
    PRCmonth_chartdata1[i]=index1.toString();
    PRCmonth_chartdata2[i]=parseInt(index2)/1000;
}

// console.log(PRCmonth_chartdata1);
// console.log(PRCmonth_chartdata2);



var myChart1=echarts.init(document.getElementById('chart1'));
    //图表配置
    option={
    tooltip:{//提示框
    //可参照菜鸟教程
    },
    title:{
    x:'center',
    y:'top',
    text:'全国新增确诊人数（按月）',
    textStyle:{
        color:'#ffffff'
    }
    },
    toolbox:{//工具箱
        x:'right',
        y:'top',
        color : ['#1e90ff','#22bb22','#4b0082','#d2691e'],
        feature: {
            saveAsImage: {}
            //lineChart &barChart
        }
    },
    xAxis:{
    type: 'category', //类目轴，适用于离散的类目数据。//采用时间轴？？
    name:'时间',
    nameLocation:'end',//名称显示位置
    //nameGap:坐标轴名称与轴线自建的距离
    boundaryGap: false,//坐标轴数据显示  为true时刻度在数据之间作为分隔
    axisLine:{
        lineStyle:{
            color:'#ffffff',
            width:1,
            type:'solid'
        }
    },
    axisLabel:{
        interval:0,
        rotate:0
    },
    data:PRCmonth_chartdata1
    },
    yAxis:{
    name:'人数/千',
    type:'value',
    boundaryGap: [0, '20%'],//数据最大值和最小值的延伸范围？
    axisLine:{
        lineStyle:{
            color:'#ffffff',
            width:1,
            type:'solid'
        }
    }
    },
    dataZoom:[{
        type: 'inside',
        start: 80,
        end: 95//初始时坐标轴显示的数据范围为start到end(用百分比调节更好)
    },{
        //缩放手柄的形状
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle:{
        color:'#fff',
        //图形阴影设置
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
    }
    }],
    series:[
    {
        name:'人数',
        type:'line',
        smooth:0,//是否开启平滑处理，值为0-1，越小越接近折线段，true时=0.5
        //拐点样式
        itemStyle:{
        color: '#CC0033'
        },
        areaStyle:{
        //渐变
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgb(255, 255, 255)'
        }, {
            offset: 1,
            color: '#FF0000'
        }])
        },
        data:PRCmonth_chartdata2
    }]
};
myChart1.setOption(option);



//----------------------- 左下角表格chart2初始化------------------------//
var PRCarea_chartdata1=[];
var PRCarea_chartdata2=[];

var PRCarea_chart_data,PRCarea_chart_data2,PRCarea_result;
PRCarea_chart_data =  $.ajax({
    url: "../../assets/china_simplify5.geojson",//json文件位置，文件名
    type: "GET",//请求方式为get
    dataType: "json", //返回数据格式为json
    async: false,
    success: function(data) {//请求成功完成后要执行的方法 
    }
}); 

PRCarea_chart_data2=PRCarea_chart_data.responseText;
PRCarea_result=$.parseJSON(PRCarea_chart_data["responseText"])	


// console.log('PRCarea_result', PRCarea_result);

var country_sum=0;
var PRCarea_length=34;
for(var i=0;i<PRCarea_length;i++){
    var index1=PRCarea_result['features'][i]['properties'].name;
    var index2=PRCarea_result['features'][i]['properties'].dailyNewConfirmed;
    PRCarea_chartdata1[i]=index1.toString();
    PRCarea_chartdata2[i]=parseInt(index2);

    country_sum+=index2;
}
var country_newnum=document.getElementById("country_newnum");
country_newnum.innerHTML=country_sum;

// console.log(PRCarea_chartdata1);
// console.log(PRCarea_chartdata2);


var myChart2=echarts.init(document.getElementById('chart2'));
    //图表配置
    option={
    tooltip:{//提示框
    //可参照菜鸟教程
    },
    title:{
    x:'center',
    y:'top',
    text:'全国省级行政区新增确诊人数',
    textStyle:{
        color:'#ffffff'
    }
    },
    toolbox:{//工具箱
        x:'right',
        y:'top',
        color : ['#1e90ff','#22bb22','#4b0082','#d2691e'],
        feature: {
            saveAsImage: {}
            //lineChart &barChart
        }
    },
    xAxis:{
    type: 'category', //类目轴，适用于离散的类目数据。//采用时间轴？？
    name:'地区',
    nameLocation:'end',//名称显示位置
    //nameGap:坐标轴名称与轴线自建的距离
    boundaryGap: true,//坐标轴数据显示  为true时刻度在数据之间作为分隔
    axisLine:{
        lineStyle:{
            color:'#eeeeee',
            width:1,
            type:'solid'
        }
    },
    axisLabel:{
        interval:0,
        rotate:0
    },
    data:PRCarea_chartdata1
    },
    yAxis:{
    name:'人数',
    type:'value',
    boundaryGap: [0, '20%'],//数据最大值和最小值的延伸范围？
    axisLine:{
        lineStyle:{
            color:'#dddddd',
            width:1,
            type:'solid'
        }
    }
    },
    dataZoom:[{
        type: 'inside',
        start: 20,
        end: 40//初始时坐标轴显示的数据范围为start到end(用百分比调节更好)
    },{
        //缩放手柄的形状
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle:{
        color:'#fff',
        //图形阴影设置
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
    }
    }],
    series:[
    {
        name:'人数',
        type:'bar',
        smooth:0,//是否开启平滑处理，值为0-1，越小越接近折线段，true时=0.5
        //拐点样式
        itemStyle:{
        color: '#CC0033'
        },
        areaStyle:{
        //渐变
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgb(255, 255, 255)'
        }, {
            offset: 1,
            color: '#FF0000'
        }])
        },
        data:PRCarea_chartdata2
    }]
};
myChart2.setOption(option);


//----------------------- 右上角表格chart3------------------------//