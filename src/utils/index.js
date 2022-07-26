/*
 * @Author: Liweifei 1195669615@qq.com
 * @Date: 2022-07-26 10:58:30
 * @LastEditors: Liweifei 1195669615@qq.com
 * @LastEditTime: 2022-07-26 17:03:44
 * @FilePath: \calendar-vue-app\src\utils\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


// * touchstart和touchend事件，计算两个事件之间的位移量
// * 1、如果位移量很小或没有位移，看做点击事件
// * 2、如果位移量较大，x大于y，可以看做平移，x>0,向右滑，反之向左滑。
// * 3、如果位移量较大，x小于y，看做上下移动，y>0,向下滑，反之向上滑
// * 4、触屏时间小于800的不被认为是长按



const model = {
  pageX: 0,
  pageY: 0,
  lastTime: new Date().getTime(),
  timeDiff: 0
}
const eventArr = ['slidLeft', 'slidRight', 'slideUp', 'slideDown', 'longPress'];

const bindEvent = (dom, event, callback) => {
  checkParam(dom, event)
  dom.addEventListener('touchstart', touchStart);
  dom.addEventListener('touchend', touchEnd);
  if (!dom[`${event}ServerList`]) dom[`${event}ServerList`] = []
  // dom[`${event}ServerList`].includes(event) || dom[`${event}ServerList`].push({ event, callback })
  dom[`${event}ServerList`].push(callback)
}

const touchStart = function (e) {
  const touchesStart = e.touches[0]
  model.pageX = touchesStart.pageX;
  model.pageY = touchesStart.pageY;
  model.lastTime = new Date().getTime();
}

const touchEnd = function (e) {
  const touchesEnd = e.changedTouches[0]
  model.timeDiff = new Date().getTime() - model.lastTime;
  model.pageX -= touchesEnd.pageX
  model.pageY -= touchesEnd.pageY
  analyze(this,e)
}

const analyze = (dom,e) => {
  const { pageX: moveX, pageY: moveY, timeDiff } = model;
  if (Math.abs(moveX) < 5 && Math.abs(moveY) < 5) {
    if (timeDiff >= 800) {
      dispatchEvent(dom, "longPress",e)
    }
  } else if (Math.abs(moveX) > Math.abs(moveY)) {//slide left/right
    if (moveX > 0) {
      dispatchEvent(dom, "slidLeft",e)
    } else {
      dispatchEvent(dom, "slidRight",e)
    }
  } else if (Math.abs(moveY) > Math.abs(moveX)) {
    if (moveY > 0) {
      dispatchEvent(dom, "slideUp",e)
    } else {
      dispatchEvent(dom, "slideDown",e)
    }
  }
}

const dispatchEvent = (dom, event,e) => {
  const { pageX: moveX, pageY: moveY } = model;
  if (dom[`${event}ServerList`]) {
    dom[`${event}ServerList`].forEach(fn => {
      typeof fn === "function" && fn({ moveX, moveY },e)
    })
  }
}

const removeEvent = (dom, event, callback) => {
  const serverList = dom[`${event}ServerList`];
  if (serverList && Array.isArray(serverList)) {
    for (var i = 0; i < serverList.length; i++) {
      var fn = serverList[i]
      if (callback == fn) serverList.splice(i, 1)
    }
    serverList.length < 1 && delete dom[`${event}ServerList`];
    if (eventArr.every(key => !dom[`${key}ServerList`])) {
      dom.removeEventListener('touchstart', touchStart);
      dom.removeEventListener('touchend', touchEnd);
    }
  }

}

const checkParam = (dom, event) => {
  if (!(dom instanceof HTMLElement)) {
    throw 'dom must be HTMLElement'
  }
  if (!eventArr.includes(event)) {
    throw 'event must be one of slidLeft, slidRight, slideUp, slideDown  or longPress'
  }
}

export default {
  bindEvent,
  removeEvent
};