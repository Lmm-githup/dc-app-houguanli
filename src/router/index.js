import Vue from 'vue'
import Router from 'vue-router'
import store from "@/store"
import VueCookie from 'vue-cookie'

import LoginPage from '@/components/LoginPage' // 登录
import HomePage from '@/components/HomePage' // 主页
import HomeWelcomePage from '@/components/HomeWelcomePage' // 欢迎页面
import SysUserManagePage from '@/components/SysUserManagePage' // 管理用户管理
import EmployeeManagePage from '@/components/EmployeeManagePage' // 导购宝用户管理
import RoleManagePage from '@/components/RoleManagePage' // 导购宝角色管理
import AuthManagePage from '@/components/AuthManagePage' // 导购宝权限管理
import OrgManagePage from '@/components/OrgManagePage' // 部门管理
import PositionManagePage from '@/components/PositionManagePage' // 职位管理
import TraningManagePage from '@/components/TraningManagePage' // 培训中心
import AnnouncementManagePage from '@/components/AnnouncementManagePage' // 通告管理
import EquityManagePage from '@/components/EquityManagePage' // 会员权益管理
import ActivityManagePage from '@/components/ActivityManagePage' // 活动管理
import StarProductManagePage from '@/components/StarProductManagePage' // 明星产品
import GoldProductManagePage from '@/components/GoldProductManagePage' // 挂金产品
import UserAnalysisManagePage from '@/components/UserAnalysisManagePage' // 用户统计

Vue.use(Router)

const router = new Router({
    mode: 'hash',
    routes: [{
            path: '/Login',
            name: 'LoginPage',
            component: LoginPage,
        },
        {
            path: '/',
            component: HomePage,
            children: [{
                    path: '',
                    redirect: 'Home',
                },
                {
                    path: 'Home',
                    name: 'HomePage',
                    component: HomeWelcomePage
                },
                {
                    path: '/SysUserManage',
                    name: 'SysUserManagePage',
                    component: SysUserManagePage
                },
                {
                    path: '/EmployeeManage',
                    name: 'EmployeeManagePage',
                    component: EmployeeManagePage
                },
                {
                    path: '/RoleManage',
                    name: 'RoleManagePage',
                    component: RoleManagePage
                },
                {
                    path: '/AuthManage',
                    name: 'AuthManagePage',
                    component: AuthManagePage
                },
                {
                    path: '/OrgManage',
                    name: 'OrgManagePage',
                    component: OrgManagePage
                },
                {
                    path: '/PositionManage',
                    name: 'PositionManagePage',
                    component: PositionManagePage
                },
                {
                    path: '/TraningManage',
                    name: 'TraningManagePage',
                    component: TraningManagePage
                },
                {
                    path: '/AnnouncementManage',
                    name: 'AnnouncementManagePage',
                    component: AnnouncementManagePage
                },
                {
                    path: '/EquityManage',
                    name: 'EquityManagePage',
                    component: EquityManagePage
                },
                {
                    path: '/ActivityManage',
                    name: 'ActivityManagePage',
                    component: ActivityManagePage
                }
                ,
                {
                    path: '/StarProductManage',
                    name: 'StarProductManagePage',
                    component: StarProductManagePage
                }
                ,
                {
                    path: '/GoldProductManage',
                    name: 'GoldProductManagePage',
                    component: GoldProductManagePage
                }
                ,
                {
                    path: '/UserAnalysisManage',
                    name: 'UserAnalysisManagePage',
                    component: UserAnalysisManagePage
                }
            ]
        },
        {
            path: '*',
            redirect: '/'
        },
    ]
});

router.beforeEach((to, from, next) => {
    const isLogin = VueCookie.get(store.state.cookiePrefix + 'isLogin');

    if (!isLogin && to.name !== 'LoginPage') {
        router.push({ name: 'LoginPage' });
        return;
    }

    if (isLogin && to.name === 'LoginPage') {
        router.push({ name: 'HomePage' });
        return;
    }

    next();
});

export default router;
