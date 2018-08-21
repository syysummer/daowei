$(function () {
  $.get('http://localhost:3000/item', function (data) {
    // 获取服务项目的数据
    let serverProject = template('server-project', data);
    $('.target-comment').append(serverProject)
  })

  // 监听body的滚动,当滚动的高度大于同步高度时头部进行固定定位
  $('body').on('scroll',function (event){
    let flag = true;
    if(this.scrollTop >= 100 && this.scrollTop <= 120){
      $('.commentsWrap #header').slideUp(100)
    } else if(this.scrollTop >= 120) {
      $('.commentsWrap #header').css({
        position: 'fixed',
        top: 0,
        zIndex: 1000
      })
      if(flag){
        $('.commentsWrap #header').slideDown(500)
        flag = false
      }
    }else{
      $('.commentsWrap #header').css({
        position: 'static'
      })
      $('.commentsWrap #header').slideDown(0)
    }
  })

  // 给商家分类动态添加类名
  let $cateGorys = $('.comment-categroy .comment-categroy-wrap a')
  let lastActive = 0;
  for (let i = 0; i < $cateGorys.length; i++) {
    $cateGorys[i].onclick = function () {
      $cateGorys[lastActive].classList.remove('active')
      $(this).addClass('active')
      lastActive = i
    }
  }
  // 动态获取服务项目的数据
  $.get('http://localhost:3000/item',function (data){
    let serverDetailItem = template('server-detail',data);
    $('.serverCenter').append(serverDetailItem)
    let companyInfo = template('company',data);
    $('.company-description').append(companyInfo)
  })

  // 定义时间格式化的函数
  function formatDate(dateStr){
   let date = new Date(dateStr)
   return  date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  }
  // 获取评论信息
  $.get('http://localhost:3000/comment',function (data){
    // 分页器的逻辑(初始化的逻辑)
    let lastPage = 0;
    let length = parseInt(data.length / 10) - 3
    // changUlContent(lastPage)
    let newData = data.splice(lastPage * 10, 10)
    for(let i = 0; i < newData.length; i++){
      newData[i].createtime = formatDate(newData[i].createtime)
    }
    let commentObj = {data: newData}
    let commentItems = template('commentList',commentObj);
    $('.commentsUl').append(commentItems)
    let dataArr = new Array(length).fill('1')
    let pageList = template('pageList',{dataArr});
    $('.pageList').append(pageList)
    let $pages = $('.pageList .paging-item')
    $pages[lastPage].classList.add('on-checked')

    // 定义在切换分页器时更新相应的评论内容
    function changUlContent(lastPage){
      $('.commentsUl').empty()
      morepage && morepage.remove()
      for(let i = 0; i < $pages.length; i++){
        $pages[i].style.display = 'inline-block'
      }
      let newData = data.slice(lastPage * 10, lastPage * 10 + 10)
      for(let i = 0; i < newData.length; i++){
        newData[i].createtime = formatDate(newData[i].createtime)
      }
      let commentObj = {data: newData}
      let commentItems = template('commentList',commentObj);
      $('.commentsUl').append(commentItems)
    }

    // 给每个分页器绑定点击事件
    for(let i = 0; i < $pages.length; i++){
      $pages[i].onclick = function (){
        $pages[lastPage].classList.remove('on-checked')
        $pages[i].classList.add('on-checked')
        lastPage = i
        changUlContent(lastPage)
        hideMiddlePage(lastPage)
      }
    }
    // 点击上一页和下一页是切换分页器
    $('.pre').click(function (){
      let current = lastPage
      lastPage--
      if(lastPage < 0){
        lastPage = 0
        return
      }
      $pages[current].classList.remove('on-checked')
      $pages[lastPage].classList.add('on-checked')
      changUlContent(lastPage)
      hideMiddlePage(lastPage)
    })
    $('.next').click(function (){
      let current = lastPage
      lastPage++
      if(lastPage >= length){
        lastPage = 0
      }
      $pages[current].classList.remove('on-checked')
      $pages[lastPage].classList.add('on-checked')
      changUlContent(lastPage)
      hideMiddlePage(lastPage)
    })
    let morepage
    function hideMiddlePage(lastPage){
      if(lastPage >= 4){
        let pageFour = $('.pageList').children().eq(4)
        morepage = $('<span>...</span>')
        morepage.css({
          display: 'inline-block',
          fontSize: '14px',
          width: '10px',
          height: '30px',
          textAlign: 'center',
          marginRight: '-3px'
        })
        morepage.insertBefore(pageFour)
        let detPage = lastPage - 4
        if(detPage >= 7){
          detPage = 7
        }
        for(let i = 0; i < detPage; i++){
          $pages[i + 3].style.display = 'none'
        }
      }
    }
  })

  // 获取热门城市相关数据
  $.get('http://localhost:3000/hotCity', function (data){
    // 生成服务列表
    let objCity = {data};
    let cityList = template('cityList',objCity);
    $('.hot-city').append(cityList)
  })
})