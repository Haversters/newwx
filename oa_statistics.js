if (!window.jQuery) {
  document.write('<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>');
  loadingJquery();
} else {
  start();
};
function loadingJquery() {
  var loadingTimeout = setTimeout(function () {
    if (window.jQuery) {
      start();
    } else {
      loadingJquery();
    };
    clearTimeout(loadingTimeout);
  }, 100);
};
function start() {
  var startTime = (new Date()).valueOf();
  var timeOutEvent = 0;
  var gyroScope = '';
  var touchCount = 0;
  var scannum = 0;
  var uId = '';
  var scanTime = 0;
  var scanStartTime = 0;
  var pointNum = 0;
  var copyWxNoCount = 0;
  if (localStorage.getItem("UID") == null) {
    localStorage.setItem('UID', Date.now()+'_'+ articleId + '_'+ (Math.random()*10000)+1)
    uId = Date.now()+'_'+ articleId + '_'+ (Math.random()*10000)+1
  } else {
    uId = localStorage.getItem("UID")
  }
  var scanFlage = false;
  $("body").on("touchstart", ".adCode", function (e) {
    scanStartTime = Date.now()
    timeOutEvent = setTimeout(function () {
      scanFlage = true
      scannum ++;
    }, 1000);
  });
  $("body").on("touchmove", ".adCode", function (e) {
    clearTimeout(timeOutEvent);
    timeOutEvent = 0;
  });
  $("body").on("touchend", ".adCode", function (e) {
    if(scanFlage) {
      scanTime += Date.now() - scanStartTime
    }
    scanFlage = false
    clearTimeout(timeOutEvent);
    return false;
  });
  var ing = 0;
  $('body').on("touchstart", function (e) {
    ing = 0;
  });
  $("body").on("touchmove", function (e) {
    ing = 1;
  });
  $('body').on("touchend", function (e) {
    if(ing) {
      touchCount ++;
    } else {
      pointNum ++;
    }
  });
  $('.J_wxno').on("copy" , function (e) {
    window.location.href='weixin://';
    copyWxNoCount++;
  })
  /**
   * @description 微信内页面关闭 刷新 跳转 等离开页面时上报
   */
  var data = {
    referrer: decodeURIComponent(referrer),
    articleId: articleId,
    wxNo: adiWxNo,
    width: $(window).width(),
    height: $(window).height(),
    hight: $(window).height(),
    adSource:getParams("adSource"),
    sessionId: getParams('sd'),
    cookie: getParams('ce'),
    shareCount: getParams('sct'),
    fromStr: getParams('fms'),
    st: getParams('st'),
    userId: getParams('ud'),
    firstCookieDay: decodeURIComponent(getParams('fcd')),
    cookieDayCount: getParams('cdt'),
    cookieNum: getParams('cnm'),
    local: getParams('ll'),
    advertId: getParams('add'),
    abbreviation: getParams("ptSource"),
    eventType: 'ad_click_exact',
    ir: getParams('ir'),
    adSource: getParams('adSource'),
    ptArticleId: getParams('ad'),
    uId: uId,
  };
  window.addEventListener('pagehide', function () {
    data.touchCount = touchCount;
    data.scannum = scannum;
    data.scanNum = scannum;
    data.gyroScope = gyroScope;
    data.stopTime = new Date().getTime() - startTime;
    data.stayTime = new Date().getTime() - startTime;

    data.scanTime = scanTime;
    data.pointNum = pointNum;
    data.strokeNum = touchCount;
    data.strokeDistance = $(document).scrollTop();
    data.copyWxNoCount = copyWxNoCount;
    /**
     * @description 同步事件
     */
    $.ajax({
      url: url + 'open/adBehaviorReport.ohtml',
      type: 'post',
      data: data,
      async: false,
      dataType: "json",
    });
  });
}
/**
 * @description 获取URL参数
 * @param {*} name
 */
function getParams(name) {
  var params = {};
  var paramsStr = window.location.search || window.location.hash || '';
  var arr = paramsStr.split('&');
  arr.forEach(element => {
      var keyAnValue = element.split('=');
      if (keyAnValue[0].substr(0, 1) == '?' || keyAnValue[0].substr(0, 1) == '#') {
        keyAnValue[0] = keyAnValue[0].substr(1);
      }
      Object.defineProperty(params, keyAnValue[0], {
        enumerable: true,
        value: keyAnValue[1],
      });
  });
  if(params[name]){
    return params[name];
  } else {
    return '';
  }
};
/**
 * @description 陀螺仪
 */
window.addEventListener("deviceorientation", function (event) {
  if (!event.alpha) {
    return;
  };
  var alpha = event.alpha && event.alpha != 0 ? event.alpha.toFixed(2) : '0.00';
  var beta = event.alpha && event.alpha != 0 ? event.beta.toFixed(2) : '0.00';
  var gamma = event.alpha && event.alpha != 0 ? event.gamma.toFixed(2) : '0.00';
  gyroScope = alpha + '_' + beta + '_' + gamma;
}, false);
