import withAxios from './axios/withAxios'

export const commonConfig = {
  'csrfToken': {
    url: '/ui/common/csrfToken.do',
    method: 'get'
  },
  'getDict': {
    url: '/ui/common/dict/{codes}.do',
    method: 'get'
  },
  'multiLanguage': {
    url: '/multiLanguage.do',
    method: 'get'
  },
  'currLanguage': {
    url: '/currLanguage.do',
    method: 'get'
  },
  // 查询centerurl
  'findNginxInfoVo': {
    url: '/common/findNginxInfoVo.do',
    method: 'get'
  },
  getPlayerToolStartParam: {
    url: '/ui/caseRecord/toolStartParam/player/{indexCode}.do',
    method: 'get'
  },
  // 获取公钥
  'getAkPublicKey': {
    url: '/ui/common/publicKey.do',
    method: 'get'
  },
  // 获取导出录像列表
  'playBackActiveInfoVideo': {
    url: '/book/playBackActiveInfoVideo.do',
    method: 'get'
  },
  // shipin
  'playerParam': {
    url: '/ui/common/player/param.do', //    locationCode
    method: 'get'
  },
  'areaInfos':{
    url:'/ui/place/areaInfos.do',
    method:'get'
  },
  //获取组织树
  'loadOrgTree': {
    url: '/ui/common/loadOrgTree.do',
    method: 'get'
  },
  //获取警员列表
  'queryPagePersons': {
    url: '/ui/common/queryPagePersons.do',
    method: 'get'
  },
  //获取播放参数
  'getPlayerParam': {
    url: '/ui/common/player/param.do',
    method: 'get'
  },
  //图片上传
  'uploadFile': {
    url: '/ui/foundation/file/uploadToHikCstor.do',
    method: 'post'
  },
  //获取全量部门和人
  'personTree': {
    url: '/ui/common/person/tree.do',
    method: 'post'
  },

  //巡查表单部门查询  
  'loadUnitTree': {
    url: '/ui/common/loadUnitTree.do',
    method: 'get'
  },
  //执法考评导出
  'exportEvaluateInfo': {
    url: '/ui/evaluate/exportEvaluateInfo.do',
    method: 'post'
  },
  //绩效
  'exportStatisPreAlarmByType': {
    url: '/ui/evaluate/exportStatisPreAlarmByType.do',
    method: 'post'
  },
  
}
export default withAxios(commonConfig)
