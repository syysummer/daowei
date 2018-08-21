'use strict';

$(function () {
  $.get('http://localhost:3000/item', function (data) {
    // 获取服务项目的数据
    var serverProject = template('server-project', data);
    $('.target-comment').append(serverProject);
  });

  // 监听body的滚动,当滚动的高度大于同步高度时头部进行固定定位
  $('body').on('scroll', function (event) {
    var flag = true;
    if (this.scrollTop >= 100 && this.scrollTop <= 120) {
      $('.commentsWrap #header').slideUp(100);
    } else if (this.scrollTop >= 120) {
      $('.commentsWrap #header').css({
        position: 'fixed',
        top: 0,
        zIndex: 1000
      });
      if (flag) {
        $('.commentsWrap #header').slideDown(500);
        flag = false;
      }
    } else {
      $('.commentsWrap #header').css({
        position: 'static'
      });
      $('.commentsWrap #header').slideDown(0);
    }
  });

  // 给商家分类动态添加类名
  var $cateGorys = $('.comment-categroy .comment-categroy-wrap a');
  var lastActive = 0;

  var _loop = function _loop(i) {
    $cateGorys[i].onclick = function () {
      $cateGorys[lastActive].classList.remove('active');
      $(this).addClass('active');
      lastActive = i;
    };
  };

  for (var i = 0; i < $cateGorys.length; i++) {
    _loop(i);
  }
  // 动态获取服务项目的数据
  $.get('http://localhost:3000/item', function (data) {
    var serverDetailItem = template('server-detail', data);
    $('.serverCenter').append(serverDetailItem);
    var companyInfo = template('company', data);
    $('.company-description').append(companyInfo);
  });

  // 定义时间格式化的函数
  function formatDate(dateStr) {
    var date = new Date(dateStr);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  }
  // 获取评论信息
  $.get('http://localhost:3000/comment', function (data) {
    // 分页器的逻辑(初始化的逻辑)
    var lastPage = 0;
    var length = parseInt(data.length / 10) - 3;
    // changUlContent(lastPage)
    var newData = data.splice(lastPage * 10, 10);
    for (var i = 0; i < newData.length; i++) {
      newData[i].createtime = formatDate(newData[i].createtime);
    }
    var commentObj = { data: newData };
    var commentItems = template('commentList', commentObj);
    $('.commentsUl').append(commentItems);
    var dataArr = new Array(length).fill('1');
    var pageList = template('pageList', { dataArr: dataArr });
    $('.pageList').append(pageList);
    var $pages = $('.pageList .paging-item');
    $pages[lastPage].classList.add('on-checked');

    // 定义在切换分页器时更新相应的评论内容
    function changUlContent(lastPage) {
      $('.commentsUl').empty();
      morepage && morepage.remove();
      for (var _i = 0; _i < $pages.length; _i++) {
        $pages[_i].style.display = 'inline-block';
      }
      var newData = data.slice(lastPage * 10, lastPage * 10 + 10);
      for (var _i2 = 0; _i2 < newData.length; _i2++) {
        newData[_i2].createtime = formatDate(newData[_i2].createtime);
      }
      var commentObj = { data: newData };
      var commentItems = template('commentList', commentObj);
      $('.commentsUl').append(commentItems);
    }

    // 给每个分页器绑定点击事件

    var _loop2 = function _loop2(_i3) {
      $pages[_i3].onclick = function () {
        $pages[lastPage].classList.remove('on-checked');
        $pages[_i3].classList.add('on-checked');
        lastPage = _i3;
        changUlContent(lastPage);
        hideMiddlePage(lastPage);
      };
    };

    for (var _i3 = 0; _i3 < $pages.length; _i3++) {
      _loop2(_i3);
    }

    // 点击上一页和下一页是切换分页器
    $('.pre').click(function () {
      var current = lastPage;
      lastPage--;
      if (lastPage < 0) {
        lastPage = 0;
        return;
      }
      $pages[current].classList.remove('on-checked');
      $pages[lastPage].classList.add('on-checked');
      changUlContent(lastPage);
      hideMiddlePage(lastPage);
    });
    $('.next').click(function () {
      var current = lastPage;
      lastPage++;
      if (lastPage >= length) {
        lastPage = 0;
      }
      $pages[current].classList.remove('on-checked');
      $pages[lastPage].classList.add('on-checked');
      changUlContent(lastPage);
      hideMiddlePage(lastPage);
    });

    var morepage = void 0; // 中间的省略号,代表隐藏页
    function hideMiddlePage(lastPage) {
      if (lastPage >= 4) {
        var pageFour = $('.pageList').children().eq(4);
        morepage = $('<span>...</span>');
        morepage.css({
          display: 'inline-block',
          fontSize: '14px',
          width: '10px',
          height: '30px',
          textAlign: 'center',
          marginRight: '-3px'
        });
        morepage.insertBefore(pageFour);
        var detPage = lastPage - 4;
        if (detPage >= 7) {
          detPage = 7;
        }
        for (var _i4 = 0; _i4 < detPage; _i4++) {
          $pages[_i4 + 3].style.display = 'none';
        }
      }
    }
  });

  // 获取热门城市相关数据
  $.get('http://localhost:3000/hotCity', function (data) {
    // 生成服务列表
    var objCity = { data: data };
    var cityList = template('cityList', objCity);
    $('.hot-city').append(cityList);
  });
});