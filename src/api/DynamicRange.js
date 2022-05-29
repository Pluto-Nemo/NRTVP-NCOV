/**
 * 动态扩散圆
 */

 export default class DynamicRange{
    constructor(val){
        this.viewer = val.viewer;
    }
    dynamicRange(val){
        let minR=val.minR;//最小半径
        let maxR = val.maxR;// 最大半径
        let lon=val.lon;
        let lat=val.lat;
        let deviationR = val.deviationR; // 每次增加的大小
        var r1 = minR
        function changeR1() {  
            r1=r1+deviationR;//deviationR为每次圆增加的大小
            if(r1>=maxR){
                r1=minR;
            }
            return r1;
        }
        function color() {
            let x=1-r1/maxR;
            return Cesium.Color.WHITE.withAlpha(x);
        }
        let entitys = this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            name: 'ellipse on surface with outline',

            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(changeR1,false),
                semiMajorAxis: new Cesium.CallbackProperty(changeR1,false),
                material: new Cesium.ImageMaterialProperty({
                image:"../images/cc.png",
                repeat:new Cesium.Cartesian2(1.0, 1.0),
                transparent:true,
                color:new Cesium.CallbackProperty(color,false)
                }),
                outlineColor: Cesium.Color.RED
            }
        });
        return entitys
    }
    dynamicRange2(val){
        let minR=val.minR;//最小半径
        let maxR = val.maxR;// 最大半径
        let deviationR = val.deviationR; // 每次增加的大小
        var r1 = minR
        function changeR1() {  
            r1=r1+deviationR;//deviationR为每次圆增加的大小
            if(r1>=maxR){
                r1=minR;
            }
            return r1;
        }
        function color() {
            let x=1-r1/maxR;
            return Cesium.Color.WHITE.withAlpha(x);
        }
        let entitys = this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            name: 'ellipse on surface with outline',
         
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(changeR1,false),
                semiMajorAxis: new Cesium.CallbackProperty(changeR1,false),
                material: new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(color,false)),
                outlineColor: Cesium.Color.RED
            }
        });
        return entitys
    }
}
