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

/** 公共服务 */
const commonService = {
    /**
     * 获取验证码
     *
     * @returns
     */
    code() {
        return instance.post('/common/code').then(res => res.data)
    },
    /**
     * lov
     *
     * @returns
     */
    lov(dataType) {
        return instance.post('/common/lov',{dataType}).then(res => res.data)
    },

    /**
     * lov by key
     *
     * @returns
     */
    getLovByKey(dataType,dataKey) {
        return instance.post('/common/lov/key',{dataType,dataKey}).then(res => res.data)
    },

    /**
     * save
     *
     * @returns
     */
    saveLov(dataType,dataKey,dataValue) {
        return instance.post('/common/lov/add',{dataType,dataKey,dataValue}).then(res => res.data)
    },
    /**
     * 用户登录
     *
     * @param {string} loginName 用户名
     * @param {string} loginPwd 密码
     * @param {string} code 随机验证码
     * @param {string} random 随机数
     * @returns
     */
    login(loginName, loginPwd, code, random) {
        loginPwd = md5(loginPwd);
        return instance.post('/web/user/login', { loginName, loginPwd, code, random }).then(res => res.data);
    },
}

export default commonService;
