// 判断鼠标位置是否在边框区
function isMouseOnBuffer(mouseX, mouseY, bufferX, bufferY, x1, y1, x2, y2) {
  if ((Math.abs(mouseX - x1) < bufferX || Math.abs(mouseX - x2) < bufferX) || (Math.abs(mouseY - y1) < bufferY || Math.abs(mouseY - y2) < bufferY)) {
    return true;
  } else {
    return false;
  }
}

// 将拖拽封装成一个函数, 使用es6语法将该函数默认暴露
export default function drag(obj) {
  // 鼠标在被拖拽元素上按下时开始准备拖拽
  obj.onmousedown = function (e) {
    let ex1 = e.clientX, ey1 = e.clientY; // 鼠标的水平和垂直坐标
    let boxLeft = obj.offsetLeft, boxTop = obj.offsetTop;

    let boxRight = boxLeft + obj.offsetWidth, boxBottom = boxTop + obj.offsetHeight;
    let bufferX = 20, bufferY = 20; // obj面板边框的水平和垂直容差
    // 若鼠标不在边框附近，不触发拖拽
    if (!isMouseOnBuffer(ex1, ey1, bufferX, bufferY, boxLeft, boxTop, boxRight, boxBottom)) {
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

