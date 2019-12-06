import axios from 'axios';
import md5 from 'js-md5';
import store from "../store/index";

const instance = axios.create({
    baseURL: process.env.baseURL,
});

store.watch(state => {
    instance.defaults.headers = {
        Authorization: store.getters.token
    };
});

/** 员工服务 */
const employeeService = {
    /**
     * 重置密码
     *
     * @param {string} userNo 员工号
     * @param {string} loginPwd 新密码
     * @returns
     */
    resetPwd(userNo, loginPwd) {
        loginPwd = md5(loginPwd);
        return instance.post('/web/emp/reset/pwd', { userNo, loginPwd }).then(res => res.data);
    },
    /**
     * 查看个人信息
     *
     * @returns
     */
    userInfo() {
        return instance.post('/web/emp/info').then(res => res.data);
    },
    
    /**
     * 员工列表
     *
     * @param {number} [currentPage]
     * @param {number} [pageSize]
     * @param {string} [userCode]   员工编码
     * @param {string} [mobile]     手机
     * @param {string} [orgName]      部门
     * @param {string} [userName]   姓名
     * @param {string} [userStatus] 状态
     * @param {string} [email]      邮箱
     * @returns
     */
    empList(currentPage, pageSize, userCode,mobile,orgName,userName,userStatus,email) {
        return instance.post('/web/emp/list', { currentPage, pageSize, userCode,mobile,orgName,userName,userStatus,email }).then(res => res.data);
    },

    /**
     * 员工
     *
     * @param {string} userNo
     * @param {string} userCode
     * @param {string} mobile
     * @param {string} userName
     * @param {string} email
     * @param {string} positionNo
     * @param {string} loginPwd
     * @returns
     */
    save(userNo, userCode, mobile, userName,email,positionNo,loginPwd) {
        loginPwd = md5(loginPwd);
        return instance.post('/web/emp/save', { userNo, userCode, mobile, userName,email,positionNo,loginPwd }).then(res => res.data);
    },
    /**
     * 修改状态
     *
     * @param {string} userNo
     * @param {string} operType
     * @returns
     */
    updateEmpStatus(userNo, operType) {
        return instance.post('/web/emp/update/status', { userNo, operType }).then(res => res.data);
    },
    /**
     * 解绑
     *
     * @param {string} userCode
     * @returns
     */
    unbind(userCode) {
        return instance.post('/user/emp/edit/udId', { userCode }).then(res => res.data);
    },

    /**
     * 员工使用情况
     *
     * @param {string} userName
     * @returns
     */
    loginList( currentPage, pageSize, userName,positionName,orgName,regionName) {
        return instance.post('/web/user/userLoginList', { currentPage, pageSize,  userName,positionName,orgName,regionName }).then(res => res.data);
    },

    /**
     * 导出
     */
    exportExcel(userName,positionName,orgName,regionName){
        return instance.get('/web/user/userLoginExcel',{
            params: {
                userName:userName,
                positionName:positionName,
                orgName:orgName,
                regionName:regionName
            }
        }).then(res => res.data);
        
    }
}

export default employeeService;
