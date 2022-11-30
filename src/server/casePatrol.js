import withAxios from './axios/withAxios'
import {
  commonConfig
} from './common'

export const serverConfig = {
  ...commonConfig,
  // 'getCloudParam': {
  //   url: '/config/getCloudParam.do',
  //   method: 'get'
  // },
  // 'getTaskParam': {
  //   url: '/config/getTaskParam.do',
  //   method: 'get'
  // },
  // 'saveCloudParam': {
  //   url: '/config/saveCloudParam.do',
  //   method: 'get'
  // },
  // 'saveTaskParam': {
  //   url: '/config/saveTaskParam.do',
  //   method: 'get'
  // },
  // 'findYears': {
  //   url: '/ui/caseInfo/findYears.do',
  //   method: 'get'
  // },
  // 'pageQuery': {
  //   url: '/ui/caseInfo/pageQuery.do',
  //   method: 'get'
  // },

  // 'findDeptTree': {
  //   url: '/ui/foundation/findDeptTree.do',
  //   method: 'get'
  // },

  // // 获取审讯记录
  // 'getInterrogationRecord': {
  //   url: '/ui/interrogationRecord/loadInterrogations/{caseCode}.do',
  //   method: 'get'
  // },
  // // 获取笔录文件打印地址
  // 'getInterrogationRecordPrintUrl': {
  //   url: '/ui/interrogationRecord/noteFile/printUrl/{interrogationCode}.do',
  //   method: 'get'
  // },
  // // 获取审讯详情
  // 'getInterrogationRecordDetail': {
  //   url: '/ui/interrogationRecord/loadInterrogationByCode/{interrogationCode}.do',
  //   method: 'get'
  // },
  // // 获取审讯相关附件
  // 'getInterrogationRecordAttachments': {
  //   url: '/ui/interrogationRecord/attachments/find/{interrogationCode}.do',
  //   method: 'get'
  // },
  // // 获取附件下载地址
  // 'getInterrogationRecordAttachmentsUrl': {
  //   url: '/ui/interrogationRecord/attachments/url/{id}.do',
  //   method: 'get'
  // },
  // // 6.获取案件音视频资料
  // 'loadVideosType': {
  //   // url: '/ui/caseVideo/loadVideos/{caseCode}.do',
  //   url: '/ui/caseVideo/getFileTag/{caseCode}.do',
  //   method: 'get'
  // },
  // // 6.获取案件音视频资料
  // 'loadVideos': {
  //   // url: '/ui/caseVideo/loadVideos/{caseCode}.do',
  //   url: '/ui/caseVideo/loadVideos/{caseCode}/{typeCode}.do',
  //   method: 'get'
  // },
  // // 6.获取案件音视频地址
  // 'loadVideoUrl': {
  //   url: '/ui/caseVideo/loadVideoUrl/{fileCode}.do',
  //   method: 'get'
  // },
  // // 6.获取上传参数
  // 'toolStartParam': {
  //   url: '/ui/caseVideo/toolStartParam/{caseCode}.do',
  //   method: 'get'
  // },
  // 'playerParams': {
  //   url: '/ui/common/player/param.do',
  //   method: 'get'
  // },

  // 'getCaseGoodsInfos': {
  //   url: 'ui/caseGoodsInfo/getCaseGoodsInfos.do',
  //   method: 'get'
  // },
  // // 案件列表
  // 'getPage': {
  //   url: '/ui/casemanage/case/page.do',
  //   method: 'get'
  // },
  // // 办案部门
  // 'getHandlingDeparmentList': {
  //   url: '/ui/common/dept/tree.do',
  //   method: 'get'
  // },

  // // 删除案件
  // 'deleteCase': {
  //   url: '/ui/casemanage/case/{indexCodes}/deletion.do',
  //   method: 'get'
  // },
  // // 归档
  // 'closeCase': {
  //   url: '/ui/casemanage/case/{indexCode}/{status}/update.do',
  //   method: 'get'
  // },
  // // 添加案件
  // 'addCase': {
  //   url: '/ui/casemanage/case/save.do',
  //   method: 'post'
  // },
  // // 编辑案件
  // 'changeCase': {
  //   url: '/ui/casemanage/case/{indexCode}/update.do',
  //   method: 'post'
  // },
  // // 获取案件信息
  // 'getCaseInfo': {
  //   url: '/ui/casemanage/case/{indexCode}.do',
  //   method: 'get'
  // },
  // // 涉案人员列表
  // 'getPersonList': {
  //   url: '/ui/casemanage/{caseIndexCode}/suspect/find.do',
  //   method: 'get'
  // },
  // // 删除涉案人员
  // 'deletePerson': {
  //   url: '/ui/casemanage/suspect/{indexCode}/deletion.do',
  //   method: 'get'
  // },
  // // 获取涉案人员信息
  // 'getPersonInfo': {
  //   url: '/ui/casemanage/suspect/{indexCode}.do',
  //   method: 'get'
  // },
  // // 添加涉案人员信息
  // 'addPersonInfo': {
  //   url: '/ui/casemanage/suspect/save.do',
  //   method: 'post'
  // },
  // // 修改涉案人员信息
  // 'changePersonInfo': {
  //   url: '/ui/casemanage/suspect/{indexCode}/update.do',
  //   method: 'post'
  // },
  // // 上传涉案人员图片
  // 'uploadPhoto': {
  //   url: '/ui/casemanage/suspect/uploadPhoto.do',
  //   method: 'post'
  // },
  // // 审讯记录
  // 'getPageTwo': {
  //   url: '/ui/casemanage/{indexCode}/interrogation/page.do',
  //   method: 'post'
  // },
  // 'findOneByInterrogationCode': {
  //   url: '/ui/casemanage/interrogation/findOne/{interrogationCode}.do',
  //   method: 'get'
  // },
  // 'findAttachmentsByInterrogationCode': {
  //   url: '/ui/casemanage/attachments/find/{interrogationCode}.do',
  //   method: 'get'
  // },
  // 'getDept': {
  //   url: '/ui/common/dept/tree.do',
  //   method: 'get'
  // },
  // 'getAllPersonTwo': {
  //   url: '/ui/common/person/tree.do',
  //   method: 'get'
  // },
  // // 添加案件
  // 'saveCase': {
  //   url: '/ui/casemanage/case/save.do',
  //   method: 'post'
  // },
  // // 添加对象
  // 'saveSuspect': {
  //   url: '/ui/casemanage/suspect/save.do',
  //   method: 'post'
  // },
  // 'findAllCase': {
  //   url: '/ui/common/case/findAll.do',
  //   method: 'get'
  // },
  // 'finaAllSuspect': {
  //   url: '/ui/common/suspect/findAll.do',
  //   method: 'get'
  // },
  // // 获取默认案号
  // 'loadDefaultCaseNo': {
  //   url: '/ui/caseInfo/loadDefaultCaseNo.do',
  //   method: 'get'
  // },
  // // 删除附件
  // 'deleteAttachmenthandleClick': {
  //   url: '/ui/casemanage/attachments/delete/{ids}.do',
  //   method: 'post'
  // },
  // // 下载附件
  // 'downloadAttchmenthandleClick': {
  //   url: '/ui/casemanage/attachments/url/{id}.do',
  //   method: 'get'
  // },
  // // 获取房间列表
  // 'getRoomList': {
  //   url: '/ui/casemanage/room/list.do',
  //   method: 'get'
  // },
  // // 获取房间刻录类型
  // 'getBurnType': {
  //   url: '/ui/casemanage/burn/burnType/{roomIndexCode}.do',
  //   method: 'get'
  // },
  // // 启动点播播放器
  // 'getPlayerToolStartParam': {
  //   url: '/ui/casemanage/toolStartParam/player/{interrogationCode}.do',
  //   method: 'get'
  // },
  // // 开启事后刻录
  // 'startBurning': {
  //   url: '/ui/casemanage/interrogation/startBurning.do',
  //   method: 'post'
  // },
  // // 查询打印刻录一体机信息
  // 'findAccessService': {
  //   url: '/ui/common/burn/findAccessService.do',
  //   method: 'get'
  // },
  // // 默认封面
  // 'loadDefaultDiskCover': {
  //   url: '/ui/common/diskCover/loadDefault.do',
  //   method: 'get'
  // },
  // 'daochu': {
  //   url: '/ui/casemanage/noteFile/downloadUrl/{interrogationCode}.do',
  //   method: 'get'
  // },
  // 'dayin': {
  //   url: '/ui/casemanage/noteFile/printUrl/{interrogationCode}.do',
  //   method: 'get'
  // },
  // 'shipindaochu': {
  //   url: '/ui/casemanage/toolStartParam/downloadVideo/findSegment/{interrogationCode}.do',
  //   method: 'get'
  // },
  // 'getPlayerParam': {
  //   url: '/ui/casemanage/toolStartParam/downloadVideo.do',
  //   method: 'get'
  // },
  // 'updateInterrogation': {
  //   url: '/ui/casemanage/interrogation/updateInterrogation.do',
  //   method: 'post'
  // },
  // 'loadInterrogatorLimit': {
  //   url: '/ui/common/config/loadInterrogatorLimit.do',
  //   method: 'get'
  // },


  // 'findDeptTreeNew': {
  //   url: '/ui/foundation/findDeptTreeNew.do',
  //   method: 'get'
  // },
  // 'addNewCase': {
  //   url: '/ui/caseInfo/add.do',
  //   method: 'post'
  // },
  // 'updateCase': {
  //   url: '/ui/caseInfo/edit.do',
  //   method: 'post'
  // },
  // 'deleteCaseList': {
  //   url: '/ui/caseInfo/delete.do',
  //   method: 'post'
  // },
  // // 承办人
  // 'getAllPerson': {
  //   url: '/ui/common/person/tree.do',
  //   method: 'get'
  // },
  // 'getCurrentUser': {
  //   url: '/ui/common/currentUser.do',
  //   method: 'get'
  // },
  // 'getPoliceSituationInfoList': {
  //   url: '/ui/policeSituation/page.do',
  //   method: 'post'
  // },
  // 'getPersonByUser': {
  //   url: '/ui/common/getPersonByUser.do',
  //   method: 'get'
  // },
  // 'submit': {
  //   url: '/ui/preAlarm/savePreAlarmInfo.do',
  //   method: 'post'
  // },


  // 'getCloudParam': {
  //   url: '/config/getCloudParam.do',
  //   method: 'get'
  // },
  // 'getTaskParam': {
  //   url: '/config/getTaskParam.do',
  //   method: 'get'
  // },
  // 'saveCloudParam': {
  //   url: '/config/saveCloudParam.do',
  //   method: 'get'
  // },
  // 'saveTaskParam': {
  //   url: '/config/saveTaskParam.do',
  //   method: 'get'
  // },
  // 'findYears': {
  //   url: '/ui/caseRecord/findYears.do',
  //   method: 'get'
  // },
  // 'pageQuery': {
  //   url: '/ui/caseRecord/pageQuery.do',
  //   method: 'get'
  // },
  // 'caseBaseInfo': {
  //   url: '/ui/caseRecord/{indexCode}/load.do',
  //   method: 'get'
  // },
  // 'findDeptTree': {
  //   url: '/ui/foundation/findDeptTree.do',
  //   method: 'get'
  // },
  // 'loadCaseArea': {
  //   url: '/ui/caseRecord/{indexCode}/loadCaseArea.do',
  //   method: 'get'
  // },
  // // 获取审讯记录
  // 'getInterrogationRecord': {
  //   url: '/ui/interrogationRecord/loadInterrogations/{caseCode}.do',
  //   method: 'get'
  // },
  // // 获取笔录文件打印地址
  // 'getInterrogationRecordPrintUrl': {
  //   url: '/ui/interrogationRecord/noteFile/printUrl/{interrogationCode}.do',
  //   method: 'get'
  // },
  // // 获取审讯详情
  // 'getInterrogationRecordDetail': {
  //   url: '/ui/interrogationRecord/loadInterrogationByCode/{interrogationCode}.do',
  //   method: 'get'
  // },
  // // 获取审讯相关附件
  // 'getInterrogationRecordAttachments': {
  //   url: '/ui/interrogationRecord/attachments/find/{interrogationCode}.do',
  //   method: 'get'
  // },
  // // 获取附件下载地址
  // 'getInterrogationRecordAttachmentsUrl': {
  //   url: '/ui/interrogationRecord/attachments/url/{id}.do',
  //   method: 'get'
  // },
  // // 6.获取案件音视频资料
  // 'loadVideosType': {
  //   // url: '/ui/caseVideo/loadVideos/{caseCode}.do',
  //   url: '/ui/caseVideo/getFileTag/{caseCode}.do',
  //   method: 'get'
  // },
  // // 6.获取案件音视频资料
  // 'loadVideos': {
  //   // url: '/ui/caseVideo/loadVideos/{caseCode}.do',
  //   url: '/ui/caseVideo/loadVideos/{caseCode}/{typeCode}.do',
  //   method: 'get'
  // },
  // // 6.获取案件音视频地址
  // 'loadVideoUrl': {
  //   url: '/ui/caseVideo/loadVideoUrl/{fileCode}.do',
  //   method: 'get'
  // },
  // // 6.获取上传参数
  // 'toolStartParam': {
  //   url: '/ui/caseVideo/toolStartParam/{caseCode}.do',
  //   method: 'get'
  // },
  // 'playerParams': {
  //   url: '/ui/common/player/param.do',
  //   method: 'get'
  // },
  // 'getFolderInfo':{
  //   url:'/ui/folderInfo/getFolderInfo.do',
  //   method:'get'
  // },

  'findActiveInfo': {
    url: '/standing/book/findActiveInfoList.do',
    method: 'get'
  },

  'caseBaseInfo': {
    url: '/ui/caseRecord/{indexCode}/load.do',
    method: 'get'
  },
  'loadCaseArea': {
    url: '/ui/caseRecord/{indexCode}/loadCaseArea.do',
    method: 'get'
  },
  'getCaseGoodsInfos': {
    url: 'ui/caseGoodsInfo/getCaseGoodsInfos.do',
    method: 'get'
  },

  'getFolderInfo': {
    url: '/ui/folderInfo/getFolderInfo.do',
    method: 'get'
  },
  // 获取审讯记录
  'loadInterrogations': {
    url: '/ui/interrogationRecord/loadInterrogations/{caseCode}.do',
    method: 'get'
  },
  // 获取笔录文件打印地址
  'getInterrogationRecordPrintUrl': {
    url: '/ui/interrogationRecord/noteFile/printUrl/{interrogationCode}.do',
    method: 'get'
  },


  /**
   * 新接口整理
   */
  //案件巡查列表查询（行政案件、刑事案件）
  'casePageQuery': {
    url: '/ui/inspect/case/page.do',
    method: 'post'
  },
  //案件关联警情查询
  'findCaseRelatedPoliceSituationInfo': {
    url: '/ui/caseRecord/findCaseRelatedPoliceSituationInfo.do',
    method: 'post'
  },
  //案件巡查列表导出
  'caseExport': {
    url: '/ui/inspect/case/export.do',
    method: 'get'
  },
  //新增督办
  'savePreAlarmInfo': {
    url: '/ui/preAlarm/savePreAlarmInfo.do',
    method: 'post'
  },
  //查询告警规则
  'queryAlarmConfig': {
    url: '/ui/alarmConfig/queryAlarmConfig.do',
    method: 'post'
  },

  //新增考评
  'saveOrUpdateEvaluateInfo': {
    url: '/ui/evaluate/saveOrUpdateEvaluateInfo.do',
    method: 'post'
  },
  // 查询考评规则配置列表
  'queryEvaluateConfig': {
    url: '/ui/evaluate/config/queryEvaluateConfig.do',
    method: 'post'
  },
  // 查询督办记录
  'preAlarmPageQueryBySource': {
    url: '/ui/preAlarm/pageQueryBySource.do',
    method: 'get'
  },
  // 查询考评记录
  'evaluatePageQuery': {
    url: '/ui/evaluate/pageQuery.do',
    method: 'post'
  },

  //巡查表单部门查询  
  'loadUnitTree': {
    url: '/ui/common/loadUnitTree.do',
    method: 'get'
  },

  //巡查表单获取警员列表  unitCode=d111&pageNo=1&pageSize=20
  'queryPagePersonsByUnitCode': {
    url: '/ui/common/queryPagePersonsByUnitCode.do',
    method: 'get'
  },
  //巡查表单获取警员列表  unitCode=d111&pageNo=1&pageSize=20
  'caseExport': {
    url: '/ui/inspect/case/export.do',
    method: 'post'
  },
}
export default withAxios(serverConfig)
