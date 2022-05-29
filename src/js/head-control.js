let gear = document.getElementById('gear')
let headcontrol = document.getElementById('head-control');

function isMousein(mouseX, mouseY, x1, y1, x2, y2) {
    if ((mouseX>x1 && mouseX<x2)&&(mouseY>y1 && mouseY<y2)) {
      return true;
    } else {
      return false;
    }
  }
function drag(obj) {
    // 鼠标在被拖拽元素上按下时开始准备拖拽
    obj.onmousedown = function (e) {
      let ex1 = e.clientX, ey1 = e.clientY; // 鼠标的水平和垂直坐标
      let boxLeft = obj.offsetLeft, boxTop = obj.offsetTop;
  
      let boxRight = boxLeft + obj.offsetWidth, boxBottom = boxTop + obj.offsetHeight;

      // 若鼠标不在边框附近，不触发拖拽
      if (!isMousein(ex1, ey1, boxLeft, boxTop, boxRight, boxBottom)) {
        return;
      }
  
      // 每次移动鼠标，根据鼠标的位置重新设置被拖拽元素的位置
      document.onmousemove = function (e) {
        var docWidth = document.documentElement.clientWidth;   // 文档可视宽度
        var docHeight = document.documentElement.clientHeight;  // 文档可视高度
        var targetLeft = boxLeft + e.clientX - ex1; // obj目标left
        var targetTop = boxTop + e.clientY - ey1; // obj目标top
        // 将obj的位置限制在页面内
        if (targetLeft < 0) {
          targetLeft = 0
        } else if (targetLeft > docWidth - obj.offsetWidth) {
          targetLeft = docWidth - obj.offsetWidth;
        }
        if (targetTop < 0) {
          targetTop = 0
        } else if (targetTop > docHeight - obj.offsetHeight) {
          targetTop = docHeight - obj.offsetHeight
        }
        obj.style.left = targetLeft + 'px';
        obj.style.top = targetTop + 'px';
      }
      // 鼠标松开时，停止拖拽
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      }
    }
  }
  drag(headcontrol);