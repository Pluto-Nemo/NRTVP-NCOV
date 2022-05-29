import DynamicRange from '../api/DynamicRange.js';

function addScript(url) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);
}

addScript('../api/makeChart.js');

var cesiumAsset = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMjRjMWU1NC1kMWFmLTRlMTItYWFjYS1hYjIwYjhlYWIwMjgiLCJpZCI6ODY0NTgsImlhdCI6MTY0NzgzMzU5N30.Wy9_xXKes7Yd_e9GbW0FgfBDGr2n2cO_e5R5ovyH74Y';
var tiandituTk = '574352db76e5a6ccbcf184573dc7eb8d';
// 服务负载子域
var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];
Cesium.Ion.defaultAccessToken = cesiumAsset;


var viewer = new Cesium.Viewer('cesiumContainer', {
    shouldAnimate: true,
    animation: false,       //动画
    homeButton: false,       //home键
    geocoder: false,         //地址编码
    baseLayerPicker: false, //图层选择控件
    timeline: false,        //时间轴
    fullscreenButton: false, //全屏显示
    infoBox: false,         //点击要素之后浮窗
    sceneModePicker: false,  //投影方式  三维/二维
    navigationInstructionsInitiallyVisible: false, //导航指令
    navigationHelpButton: false,     //帮助信息
    selectionIndicator: false, // 选择
});

viewer._cesiumWidget._creditContainer.style.display = "none";
const imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
    //影像底图
    url: "http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" + tiandituTk,
    subdomains: subdomains,
    layer: "tdtImgLayer",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",//使用谷歌的瓦片切片方式
    show: true,
});
imageryProvider.name = "tdtImgLayer";
let imagery = viewer.imageryLayers.addImageryProvider(imageryProvider);
//imagery.hue = 1.2;
imagery.contrast = 1.2;
imagery.brightness = 0.5;
viewer._cesiumWidget._creditContainer.style.display = "none";  // 隐藏cesium ion
viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    //影像注记
    url: "http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" + tiandituTk,
    subdomains: subdomains,
    fillColor: Cesium.Color.WHITE,
    layer: "tdtCiaLayer",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    show: true
}));
let data1, data2;
let data;


//设置相机初始位置
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(102, 32, 30000000.0),
});
let n = 0; let j = 0;
let cc = 0;
var provider1, provider2;

provider1 = new Cesium.GeoJsonDataSource.load(
    "../../assets/china_simplify5.geojson",
    {
        stroke: Cesium.Color.WHITE,
        //fill: Cesium.Color.BLUE.withAlpha(0.5),
        strokeWidth: 15,
        markerSymbol: '?',
    }
)

provider2 = new Cesium.GeoJsonDataSource.load(
    "../../assets/city_simplify4.geojson",
    {
        stroke: Cesium.Color.WHITE,
        //: Cesium.Color.YELLOW.withAlpha(0.5),
        strokeWidth: 15,
        markerSymbol: '?',
    }
)
//this._primitives = this._viewer.scene.primitives.add(new Cesium.PrimitiveCollection());
//根据高度设置相应图层
viewer.camera.changed.addEventListener(() => {
    // 当前高度
    let height = viewer.camera.positionCartographic.height;
    let aa;
    if (height > 1300000) {
        aa = "省";
    }
    else {
        aa = "市";
    }

    if (aa === '市' && n === 0) {
        viewer.dataSources.removeAll();
        data2 = viewer.dataSources.add(provider2);
        data = data2;
        n = 1;
        j = 0;
    }
    else if (aa === '省' && j === 0) {
        viewer.dataSources.removeAll();
        data1 = viewer.dataSources.add(provider1);
        data = data1;
        n = 0;
        j = 1;
    }

    if (data === data1) {
        data1.then(function (dataSource) {
            //获取实体数组
            var entities = dataSource.entities.values;
            // entities.forEach(entity => {
            //     console.log(entity._properties);
            // }
            // );
            if (entities.length != undefined) {
                for (var i = 0; i < entities.length; i++) {
                    var entity = entities[i];
                    // alert( entity.polygon.show );
                    if (Cesium.defined(entity.polygon)) {
                        const colorHash = {};
                        let numChild = entity._properties._provinceConfirmed;
                        let normalColor = colorHash[numChild];
                        if (!normalColor) {
                            if (numChild < 1000) {
                                normalColor = new Cesium.Color(1, 0, 0, 0.2);
                            }
                            else if (numChild < 3000 && numChild >= 1000) {
                                normalColor = new Cesium.Color(1, 0, 0, 0.45);  //#38a800
                            } else {
                                normalColor = new Cesium.Color(1, 0, 0, 0.7);
                            }
                            colorHash[numChild] = normalColor;
                        }
                        entity.polygon.material = normalColor;
                        entity.polygon.material = createCallback(entity);
                        var scene = viewer.scene;
                        var handler = viewer.screenSpaceEventHandler;
                        var highlightedEntity;
                        var highlightColor = Cesium.Color.BLUE.withAlpha(0.45);
                        handler.setInputAction(function (movement) {
                            var pickedObject = scene.pick(movement.endPosition);
                            if (Cesium.defined(pickedObject) && pickedObject.id instanceof Cesium.Entity) {
                                highlightedEntity = pickedObject.id;
                                tooltip.show(pickedObject.id._properties._provinceConfirmed);
                                //  console.log(entity._properties);
                            } else {
                                highlightedEntity = undefined;
                                tooltip.hide();
                            }


                        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                        handler.setInputAction(function (click) {
                            let pick = new Cesium.Cartesian2(click.position.x, click.position.y);
                            let pick0;
                            if (pick) {
                                let cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
                                if (cartesian) {
                                    //世界坐标转地理坐标（弧度）
                                    let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
                                    if (cartographic) {
                                        //海拔
                                        let height = viewer.scene.globe.getHeight(cartographic)
                                        //视角海拔高度
                                        let he = Math.sqrt(
                                            viewer.scene.camera.positionWC.x * viewer.scene.camera.positionWC.x +
                                            viewer.scene.camera.positionWC.y * viewer.scene.camera.positionWC.y +
                                            viewer.scene.camera.positionWC.z * viewer.scene.camera.positionWC.z
                                        )
                                        let he2 = Math.sqrt(
                                            cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z
                                        )
                                        //地理坐标（弧度）转经纬度坐标
                                        let point = [
                                            (cartographic.longitude / Math.PI) * 180,
                                            (cartographic.latitude / Math.PI) * 180,
                                        ]
                                        let lon = point[0];
                                        let lat = point[1];
                                        //粒子系统
                                        let entity3 = new DynamicRange({
                                            viewer
                                        })
                                        if (pick0 != pick && cc != 0) {
                                            viewer.entities.values.forEach(entity3 => {
                                                viewer.entities.remove(entity3)
                                            })
                                        }
                                        entity3.dynamicRange({
                                            minR: 4000,
                                            maxR: 400000,
                                            deviationR: 4000,
                                            lon: lon,
                                            lat: lat
                                        })
                                        //模拟代码
                                        cc++;
                                        console.log("经度：" + point[0] + "纬度：" + point[1] + "高程：" + height);
                                        console.log("视角高度：" + (he - he2));
                                        let h1;
                                        if ((he - he2) >= 1400000)
                                            h1 = 1400000;
                                        else
                                            h1 = he - he2;
                                        viewer.camera.flyTo({
                                            destination: Cesium.Cartesian3.fromDegrees(
                                                lon,
                                                lat,
                                                h1
                                            )
                                        })
                                    }
                                }
                                pick0 = pick;

                                var pickedObject = scene.pick(click.position);
                                var province_name = pickedObject.id._properties._name._value;
                                console.log(province_name);//这是省名


                                var mainArea = document.getElementById('mainArea')
                                mainArea.innerHTML = province_name;

                                makeChart(province_name);
                                makeChart3(province_name);
                                makeChart4(province_name);
                            }
                        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                        function createCallback(entity) {
                            var colorProperty = new Cesium.CallbackProperty(function (time, result) {
                                if (highlightedEntity === entity) {
                                    return Cesium.Color.clone(highlightColor, result);
                                }
                                return Cesium.Color.clone(normalColor, result);
                            }, false);
                            return new Cesium.ColorMaterialProperty(colorProperty);
                        }
                    }
                }
            }
        }).otherwise(function (error) {
            //显示加载时遇到的任何错误.
            window.alert(error);
        });

    }
    if (data === data2) {

        data2.then(function (dataSource) {
            //获取实体数组
            var entities = dataSource.entities.values;
            // entities.forEach(entity => {
            //     console.log(entity._properties);
            // }
            // );
            if (entities.length != undefined) {
                for (var i = 0; i < entities.length; i++) {
                    var entity = entities[i];
                    // alert( entity.polygon.show );
                    if (Cesium.defined(entity.polygon)) {
                        const colorHash = {};
                        let numChild = entity._properties._cityConfirmed;
                        let normalColor = colorHash[numChild];
                        if (!normalColor) {
                            if (numChild < 100) {
                                normalColor = new Cesium.Color(1, 0, 0, 0.2);
                            }
                            else if (numChild < 200 && numChild > 100) {
                                normalColor = new Cesium.Color(1, 0, 0, 0.45);  //#38a800
                            } else {
                                normalColor = new Cesium.Color(1, 0, 0, 0.7);
                            }
                            colorHash[numChild] = normalColor;
                        }
                        entity.polygon.material = normalColor;
                        entity.polygon.material = createCallback(entity);
                        var scene = viewer.scene;
                        var handler = viewer.screenSpaceEventHandler;
                        var highlightedEntity;
                        var highlightColor = Cesium.Color.BLUE.withAlpha(0.45);
                        handler.setInputAction(function (movement) {
                            var pickedObject = scene.pick(movement.endPosition);
                            if (Cesium.defined(pickedObject) && pickedObject.id instanceof Cesium.Entity) {
                                highlightedEntity = pickedObject.id;
                                tooltip.show(pickedObject.id._properties._cityConfirmed);
                                //  console.log(entity._properties);
                            } else {
                                highlightedEntity = undefined;
                                tooltip.hide();
                            }


                        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                        handler.setInputAction(function (click) {
                            var pick = new Cesium.Cartesian2(click.position.x, click.position.y);
                            var pick0;
                            if (pick) {
                                let cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
                                if (cartesian) {
                                    //世界坐标转地理坐标（弧度）
                                    let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
                                    if (cartographic) {
                                        //海拔
                                        let height = viewer.scene.globe.getHeight(cartographic)
                                        //视角海拔高度
                                        let he = Math.sqrt(
                                            viewer.scene.camera.positionWC.x * viewer.scene.camera.positionWC.x +
                                            viewer.scene.camera.positionWC.y * viewer.scene.camera.positionWC.y +
                                            viewer.scene.camera.positionWC.z * viewer.scene.camera.positionWC.z
                                        )
                                        let he2 = Math.sqrt(
                                            cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z
                                        )
                                        //地理坐标（弧度）转经纬度坐标
                                        let point = [
                                            (cartographic.longitude / Math.PI) * 180,
                                            (cartographic.latitude / Math.PI) * 180,
                                        ]
                                        let lon = point[0];
                                        let lat = point[1];
                                        let entity3 = new DynamicRange({
                                            viewer
                                        })
                                        if (pick0 != pick && cc != 0) {
                                            viewer.entities.values.forEach(entity3 => {
                                                viewer.entities.remove(entity3)
                                            })
                                        }
                                        entity3.dynamicRange({
                                            minR: 4000,
                                            maxR: 400000,
                                            deviationR: 4000,
                                            lon: lon,
                                            lat: lat
                                        })
                                        //模拟代码
                                        cc++;
                                        console.log("经度：" + point[0] + "纬度：" + point[1] + "高程：" + height);
                                        console.log("视角高度：" + (he - he2));
                                        let h1;
                                        if ((he - he2) >= 1400000)
                                            h1 = 1400000;
                                        else
                                            h1 = he - he2;
                                        viewer.camera.flyTo({
                                            destination: Cesium.Cartesian3.fromDegrees(
                                                lon,
                                                lat,
                                                h1
                                            )
                                        })
                                    }
                                }
                                pick0 = pick;
                                var pickedObject = scene.pick(click.position);
                                var city_name = pickedObject.id._properties._市._value;
                                var citysprovince_name = pickedObject.id._properties._省._value;
                                console.log(city_name);//这是市名
                                console.log(citysprovince_name);//这是省名

                                mainArea.innerHTML = city_name;

                                makeChart(citysprovince_name);
                                makeChart3(citysprovince_name);
                                makeChart4(citysprovince_name);


                            }
                        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                        function createCallback(entity) {
                            var colorProperty = new Cesium.CallbackProperty(function (time, result) {
                                if (highlightedEntity === entity) {
                                    return Cesium.Color.clone(highlightColor, result);
                                }
                                return Cesium.Color.clone(normalColor, result);
                            }, false);
                            return new Cesium.ColorMaterialProperty(colorProperty);
                        }
                    }
                }
            }
        }).otherwise(function (error) {
            //显示加载时遇到的任何错误.
            window.alert(error);
        });
    }


})
document.addEventListener('mousemove', function (e) {
    var x1, y1;

    var e = window.event;
    x1 = e.clientX;
    y1 = e.clientY;

    if (x1 < 470 || x1 > 1200 || y1 < 105 || y1 > 535) {
        tooltip.hide();
    }
  
})
//搜索
let lo;//经度
let la;//纬度
var flyBtn = document.getElementById('flyBtn');
var address;
//搜索地址
flyBtn.onclick = function () {
    address = document.getElementById('area_input').value; // 获取用户输入
    axios.get('https://restapi.amap.com/v3/geocode/geo', {
        params: {
            address: address,
            key: '3fc6951060fe31456f2805d72c015de9'
        }
    })
        .then(function (res) {
            // 处理成功的结果
            // console.log(res);
            lo = res.data.geocodes[0].location.split(',')[0];
            la = res.data.geocodes[0].location.split(',')[1];
            // alert('查询成功！' + address + '的经纬度为：' + lo);
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                    lo,
                    la,
                    410000
                )
            })
        }).catch(function (err) {
            // 处理失败的结果
            console.log(err);
        })


    mainArea.innerHTML = address;

    for (var i = 0; i < chart1_result_length; i++) {
        if (address == chart1_result['provinceName'][i]) {
            var citysprovince_name = chart1_result['provinceName'][i];
            makeChart(citysprovince_name);
            makeChart3(citysprovince_name);
            makeChart4(citysprovince_name);
            break;
        }
        if (address == chart1_result['cityName'][i]) {
            citysprovince_name = chart1_result['provinceName'][i];
            makeChart(citysprovince_name);
            makeChart3(citysprovince_name);
            makeChart4(citysprovince_name);
            break;
        }
    }

}

//提示框
var tt, t, c, b, h;

var tooltip = function () {
    var id = 'tt';
    var top = 3;
    var left = 3;
    var maxw = 300;
    var speed = 10;
    var timer = 20;
    var endalpha = 95;
    var alpha = 0;

    var ie = document ? true : false;
    return {
        show: function (v, w) {
            if (tt == null) {
                tt = document.createElement('div');
                tt.setAttribute('id', id);
                t = document.createElement('div');
                t.setAttribute('id', id + 'top');
                c = document.createElement('div');
                c.setAttribute('id', id + 'cont');
                b = document.createElement('div');
                b.setAttribute('id', id + 'bot');
                tt.appendChild(t);
                tt.appendChild(c);
                tt.appendChild(b);
                document.body.appendChild(tt);
                tt.style.opacity = 0;
                tt.style.filter = 'alpha(opacity=0)';
                document.onmousemove = this.pos;
            }
            tt.style.display = 'block';
            c.innerHTML = v;
            tt.style.width = w ? w + 'px' : 'auto';
            if (!w && ie) {
                t.style.display = 'none';
                b.style.display = 'none';
                tt.style.width = tt.offsetWidth;
                t.style.display = 'block';
                b.style.display = 'block';
            }
            if (tt.offsetWidth > maxw) { tt.style.width = maxw + 'px' }
            h = parseInt(tt.offsetHeight) + top;
            clearInterval(tt.timer);
            tt.timer = setInterval(function () { tooltip.fade(1) }, timer);
        },
        pos: function (e) {
            var u = ie ? e.clientY + document.documentElement.scrollTop : e.pageY;
            var l = ie ? e.clientX + document.documentElement.scrollLeft : e.pageX;
            tt.style.top = (u - h) + 'px';
            tt.style.left = (l + left) + 'px';
        },
        fade: function (d) {
            var a = alpha;
            if ((a != endalpha && d == 1) || (a != 0 && d == -1)) {
                var i = speed;
                if (endalpha - a < speed && d == 1) {
                    i = endalpha - a;
                } else if (alpha < speed && d == -1) {
                    i = a;
                }
                alpha = a + (i * d);
                tt.style.opacity = alpha * .01;
                tt.style.filter = 'alpha(opacity=' + alpha + ')';
            } else {
                clearInterval(tt.timer);
                if (d == -1) { tt.style.display = 'none' }
            }
        },
        hide: function () {
            if (tt) {//必须先判断一下存不存在tt，不然tt.timer找不到，我也不知道为啥           
                clearInterval(tt.timer);
                tt.timer = setInterval(function () { tooltip.fade(-1) }, timer);
                //tt.style.display = 'none'    
            }
        }
    };
}();
