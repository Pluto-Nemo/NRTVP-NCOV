export default function load(dataSource) {
    data.then(function (dataSource) {
        //alert("1");
        viewer.dataSources.add(dataSource);
        //获取实体数组
        //  neighborhoods = dataSource.entities;
        var entities = dataSource.entities.values;
        //alert(dataSource.entities.values);
        // entities.forEach(entity => {
        //     console.log(entity._properties._childNum);
        // }
        // );
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (Cesium.defined(entity.polygon)) {
                const colorHash = {};
                let numChild = entity._properties._childNum;
                let normalColor = colorHash[numChild];
                if (!normalColor) {
                    if (numChild < 10) {
                        normalColor = new Cesium.Color(1, 0, 0, 0.2);
                    }
                    else if (numChild < 100 && numChild > 10) {
                        normalColor = new Cesium.Color(1, 0, 0, 0.5);  //#38a800
                    } else {
                        normalColor = new Cesium.Color(1, 0, 0, 1);
                    }
                    colorHash[numChild] = normalColor;
                }
                entity.polygon.material = normalColor;
                entity.polygon.material = createCallback(entity);
                var scene = viewer.scene;
                var handler = viewer.screenSpaceEventHandler;
                var highlightedEntity;
                var highlightColor = Cesium.Color.YELLOW.withAlpha(0.6);
                handler.setInputAction(function (movement) {
                    var pickedObject = scene.pick(movement.endPosition);
                    if (Cesium.defined(pickedObject) && pickedObject.id instanceof Cesium.Entity) {
                        highlightedEntity = pickedObject.id;
                    } else {
                        highlightedEntity = undefined;
                    }

                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
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
    }).otherwise(function (error) {
        //显示加载时遇到的任何错误.
        window.alert(error);
    });
    var scene = viewer.scene;
    var handler = viewer.screenSpaceEventHandler;
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
        var pickedFeature = viewer.scene.pick(movement.position);
        if (typeof (pickedFeature) != "undefined") {     //鼠标是否点到面上
            var a = pickedFeature.id._properties._childNum;
            alert(a);
            // new Vue({
            //     el: '#show',
            //     data: {
            //         message: a
            //     }
            // });
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

}