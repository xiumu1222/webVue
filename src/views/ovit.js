/**
 * 播放指定视频文件
 * @param {Object} fileName
 */
js_functionView.tool.playFunctionViewVideo = function (fileName) {
  var ua = navigator.userAgent.toLowerCase()
	if (ua.indexOf('msie') > -1 && ua.indexOf('opera') == -1) {
    var downloadUrl = basePath + 'video/play/' + fileName
		var ovitUrl = 'hikvideoplayer://' + downloadUrl + '&name=' + fileName
		var progid = 'HikToolCheckActivex.IHikCheckToolActi.1'
		var activeX = null
    try {
      activeX = new ActiveXObject(progid)
		} catch (e) {
      activeX = null
		}
    if (activeX != null) {
      $('#playerFrame').attr('src', ovitUrl)
		}else {
      alert('请到首页下载视侦通工具!')
		}
    return
	} else{
    alert('播放请用IE浏览器!')
		return;
  }
  if (js_home.main.upload1 != null) {
	 		js_home.main.upload1.destroy()
	 	}
 	if (js_home.main.upload2 != null) {
 		js_home.main.upload2.destroy()
 	}
  var iframeHeight = '600px';
  if (isInternet == '1') {
    iframeHeight = '557px';
  }
  var htmlArr = []
		htmlArr.push("<div id='videoPlayerIframeDiv'>" +
				"<iframe style='width:100%;height:800px;overflow:hidden' FRAMEBORDER=0 SCROLLING=NO src='" + basePath + 'video/player.jsp?' +
						'functionPakage=' + js_functionView.tool.funtionPakage + '&toolName=' + $('.toolNameClicked').html() + '&videoName=' + fileName + "' id='videoPlayIframe'>" +
						'</iframe></div>')

	$('#content').empty().append(htmlArr.join(''))

	$('#content').height($('#videoPlayerIframeDiv').height())

	$(window).resize(function () {
    if ($('#content').height() - $('#videoPlayerIframeDiv').height() < 10) {
      $('#content').css('min-height', '700px')
		}
  })
	$(window).trigger('resize')
}

// js_home.main.upload1
