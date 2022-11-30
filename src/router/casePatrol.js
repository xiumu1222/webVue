
import getRouter from './utils'
const routers = [
  {
    name: 'index',
    path: '/',
    component: 'CasePatrol',
    meta: {
      keepAlive: true
    }
  },
  {
    name: 'patrol',
    path: '/patrol',
    component: 'CasePatrol/patrol'
  },
  {
    path: '/error/:type',
    name: 'Error',
    component: 'Error' // 注意提供ErrorPage组件内的多语言翻译
  },
  {
    path: '*',
    redirect: '/'
  }
]
export default getRouter(routers)