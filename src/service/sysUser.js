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

/** 用户服务 */
const sysUserService = {
    /**
     * 修改密码
     *
     * @param {string} oldPwd 原密码
     * @param {string} loginPwd 新密码
     * @returns
     */
    updatePwd(oldPwd, loginPwd) {
        oldPwd = md5(oldPwd);
        loginPwd = md5(loginPwd);
        return instance.post('/web/user/update/pwd', { oldPwd, loginPwd }).then(res => res.data);
    },
    /**
     * 重置密码
     *
     * @param {string} userNo 用户编号
     * @returns
     */
    resetPwd(userNo) {
        return instance.post('/web/user/reset/pwd', { userNo }).then(res => res.data);
    },
    /**
     * 查看个人信息
     *
     * @returns
     */
    userInfo() {
        return instance.post('/web/user/info').then(res => res.data);
    },
    /**
     * 帐号列表
     *
     * @param {number} [currentPage]
     * @param {number} [pageSize]
     * @param {string} [loginName] 账号
     * @returns
     */
    userList(currentPage, pageSize, loginName) {
        return instance.post('/web/user/list', { currentPage, pageSize, loginName }).then(res => res.data);
    },
    /**
     * 账号
     *
     * @param {string} userNo
     * @param {string} loginName
     * @param {string} loginPwd
     * @param {string} userName
     * @param {string} mobile
     * @returns
     */
    save(userNo, loginName, loginPwd, userName, mobile) {
        loginPwd = md5(loginPwd);
        return instance.post('/web/user/save', { userNo, loginName, loginPwd, userName, mobile }).then(res => res.data);
    },
    /**
     * 修改账号
     *
     * @param {string} userNo
     * @param {string} operType
     * @returns
     */
    updateUserStatus(userNo, operType) {
        return instance.post('/web/user/update/status', { userNo, operType }).then(res => res.data);
    },
}

export default sysUserService;
