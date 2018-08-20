'use strict';

$(function () {
  // 轮播图swiper
  var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    loop: true,
    effect: 'fade',
    autoplay: true,
    delay: 500,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  });

  // 监听body的滚动,当滚动的高度大于同步高度时头部进行固定定位
  $('body').on('scroll', function (event) {
    var flag = true;
    if (this.scrollTop >= 100 && this.scrollTop <= 150) {
      $('.indexWrap #header').fadeOut(100);
    } else if (this.scrollTop >= 150) {
      $('.indexWrap #header').css({
        position: 'fixed',
        top: 0,
        zIndex: 1000
      });
      if (flag) {
        $('.indexWrap #header').fadeIn(1000);
        flag = false;
      }
    } else {
      $('.indexWrap #header').css({
        position: 'static'
      });
      $('.indexWrap #header').fadeIn(0);
    }
  });

  //动态生产导航列表的数据
  var $navList = $('.serviceIndex');
  var $serviceType = $('.serviceType');
  $.get('http://localhost:3000/index', function (data) {
    // 鼠标移入导航列表时显示相应的内容
    $navList.on('mouseenter', 'li', function () {
      $serviceType.css('display', 'block');
      var obj = data[$(this).index()];
      var navList = template('serverNav', obj);
      $serviceType.append(navList);
    });
    // 鼠标离开时隐藏相应的内容
    $navList.on('mouseleave', 'li', function () {
      $serviceType.css('display', 'none');
      $serviceType.empty();
    });
    // 生成服务列表
    var objServer = { data: data };
    var serverList = template('serverList', objServer);
    $('.serverWrap').append(serverList);
  });

  // 获取热门城市相关数据
  $.get('http://localhost:3000/hotCity', function (data) {
    // 生成服务列表
    console.log(data);
    var objCity = { data: data };
    var cityList = template('cityList', objCity);
    $('.hot-city').append(cityList);
    console.log(cityList);
  });
});