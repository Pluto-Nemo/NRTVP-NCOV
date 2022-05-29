//获得json的长度
function getJsonLength(jsonData){
    var jsonLength = 0;
    for(var item in jsonData){
        jsonLength++;
    }
    return jsonLength;
}

//删除数组中的空值
function trimSpace(array){  
    for(var i = 0 ;i<array.length;i++)  
    {  
       //这里为过滤的值
        if(array[i] == " " || array[i] == null || typeof(array[i]) == "undefined" || array[i] == '  ' )  
        {  
            array.splice(i,1);
            i= i-1;
        }  
    }  
    return array;  
}  

var chartdata1=[];
var chartdata2=[];
var chart1_result_length;
var chart_data,chart_data2,chart1_result;
function makeChart(province_name){
    //清空数组
    chartdata1=[];
    chartdata2=[];
    chart_data =  $.ajax({
        url: "../../assets/area_china_deal.json",//json文件位置，文件名
        type: "GET",//请求方式为get
        dataType: "json", //返回数据格式为json
        async: false,
        success: function(data) {//请求成功完成后要执行的方法 
        }
    }); 

    
    chart_data2=chart_data.responseText;
    chart1_result=$.parseJSON(chart_data["responseText"])	
    
    
    chart1_result_length=getJsonLength(chart1_result.provinceName);
    console.log("chart1_result_length:"+chart1_result_length);
    
    
    console.log('chart1_result', chart1_result);
    
    
    for(var i=0;i<chart1_result_length;i++){
        if(province_name==chart1_result['provinceName'][i]){
            var index1=chart1_result['cityName'][i];
            var index2=chart1_result['cityConfirmed'][i];
            chartdata1[i]=index1.toString();
            chartdata2[i]=parseInt(index2);
        }
    }
    
    chartdata1 = trimSpace(chartdata1);
    chartdata2 = trimSpace(chartdata2);
    
    console.log(chartdata1);
    console.log(chartdata2);
    setTimeout(() => {
        linemap(province_name);
    }, 1000);
}



function linemap(province_name){
    var myChart=echarts.init(document.getElementById('chart2'));
    //图表配置
    option={
    tooltip:{//提示框
    //可参照菜鸟教程
    },
    title:{
    x:'center',
    y:'top',
    text:province_name+'累计确诊人数',
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
    data:chartdata1
    },
    yAxis:{
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
        start: 30,
        end: 50//初始时坐标轴显示的数据范围为start到end(用百分比调节更好)
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
        smooth:false,//是否开启平滑处理，值为0-1，越小越接近折线段，true时=0.5
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
        data:chartdata2
    }
    ]
    };
    // 使用刚指定的配置项和数据显示图表。
    //获取数据之后
    // this.$nextTick(function () {
    //   this.$refs.myChart.setOption(option);
    // });
    myChart.setOption(option);
}



var chart3_data1=[];
var chart3_data2=[];
var chart3_result_length;
function makeChart3(province_name){
    //清空数组
    chart3_data1=[];
    chart3_data2=[];
    var chart3_data,chart3_index,chart3_result;
    chart3_data =  $.ajax({
        url: "../../assets/province_Confirm.json",//json文件位置，文件名
        type: "GET",//请求方式为get
        dataType: "json", //返回数据格式为json
        async: false,
        success: function(data) {//请求成功完成后要执行的方法 
        }
    }); 

    
    chart3_index=chart3_data.responseText;
    chart3_result=$.parseJSON(chart3_data["responseText"])	
    
    
    chart3_result_length=getJsonLength(chart3_result);
    console.log("chart3_result_length:"+chart3_result_length);
    
    
    console.log('chart3_result', chart3_result);
    
    chart3_data1[0]="2022/05/27";
    chart3_data1[1]="2022/05/28";
    chart3_data1[2]="2022/05/29";


    for(var i=0;i<chart3_result_length;i++){
        if(province_name==chart3_result[i]['name']){
            chart3_data2[0]=chart3_result[i]['2022/05/27'];
            chart3_data2[1]=chart3_result[i]['2022/05/28'];
            chart3_data2[2]=chart3_result[i]['2022/05/29'];
        }
    }
    
    chart3_data1 = trimSpace(chart3_data1);
    chart3_data2 = trimSpace(chart3_data2);
    
    console.log(chart3_data1);
    console.log(chart3_data2);
    setTimeout(() => {
        linemap3(province_name);
    }, 1000);
}



function linemap3(province_name){
    var myChart=echarts.init(document.getElementById('chart3'));
    //图表配置
    option={
    tooltip:{//提示框
    //可参照菜鸟教程
    },
    title:{
    x:'center',
    y:'top',
    text:province_name+'近期累计确诊人数',
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
    data:chart3_data1
    },
    yAxis:{
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
        start: 0,
        end: 100//初始时坐标轴显示的数据范围为start到end(用百分比调节更好)
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
        smooth:false,//是否开启平滑处理，值为0-1，越小越接近折线段，true时=0.5
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
        data:chart3_data2
    }
    ]
    };
    // 使用刚指定的配置项和数据显示图表。
    //获取数据之后
    // this.$nextTick(function () {
    //   this.$refs.myChart.setOption(option);
    // });
    myChart.setOption(option);
}


var chart4_data1=[];
var chart4_data2=[];
var chart4_result_length;
function makeChart4(province_name){
    //清空数组
    chart4_data1=[];
    chart4_data2=[];
    var chart4_data,chart4_index,chart4_result;
    chart4_data =  $.ajax({
        url: "../../assets/province_New.json",//json文件位置，文件名
        type: "GET",//请求方式为get
        dataType: "json", //返回数据格式为json
        async: false,
        success: function(data) {//请求成功完成后要执行的方法 
        }
    }); 

    
    chart4_index=chart4_data.responseText;
    chart4_result=$.parseJSON(chart4_data["responseText"])	
    
    
    chart4_result_length=getJsonLength(chart4_result);
    console.log("chart4_result_length:"+chart4_result_length);
    
    
    console.log('chart4_result', chart4_result);
    
    chart4_data1[0]="2022/05/27";
    chart4_data1[1]="2022/05/28";
    chart4_data1[2]="2022/05/29";


    for(var i=0;i<chart4_result_length;i++){
        if(province_name==chart4_result[i]['name']){
            chart4_data2[0]=chart4_result[i]['2022/05/27'];
            chart4_data2[1]=chart4_result[i]['2022/05/28'];
            chart4_data2[2]=chart4_result[i]['2022/05/29'];
        }
    }
    
    chart4_data1 = trimSpace(chart4_data1);
    chart4_data2 = trimSpace(chart4_data2);
    
    console.log(chart4_data1);
    console.log(chart4_data2);
    setTimeout(() => {
        linemap4(province_name);
    }, 1000);
}



function linemap4(province_name){
    var myChart=echarts.init(document.getElementById('chart4'));
    //图表配置
    option={
    tooltip:{//提示框
    //可参照菜鸟教程
    },
    title:{
    x:'center',
    y:'top',
    text:province_name+'近期新增确诊人数',
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
            color:'#ffffff',
            width:1,
            type:'solid'
        }
    },
    axisLabel:{
        interval:0,
        rotate:0
    },
    data:chart4_data1
    },
    yAxis:{
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
        start: 0,
        end: 100//初始时坐标轴显示的数据范围为start到end(用百分比调节更好)
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
        smooth:false,//是否开启平滑处理，值为0-1，越小越接近折线段，true时=0.5
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
        data:chart4_data2
    }
    ]
    };
    // 使用刚指定的配置项和数据显示图表。
    //获取数据之后
    // this.$nextTick(function () {
    //   this.$refs.myChart.setOption(option);
    // });
    myChart.setOption(option);
}