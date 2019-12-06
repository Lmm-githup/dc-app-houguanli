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

/** 职位管理服务 */
const positionService = {
    /**
     * 查看职位详情
     *
     * @returns
     */
    info(rowNo) {
        return instance.post('/web/position/info',{rowNo}).then(res => res.data);
    },
    
    /**
     * 职位列表
     *
     * @param {number} [currentPage]
     * @param {number} [pageSize]
     * @param {string} [positionCode] 
     * @param {string} [positionName] 
     * @param {string} [orgName]
     * @param {string} [userName] 
     * @returns
     */
    list(currentPage, pageSize, positionCode, positionName, orgName,userName) {
        return instance.post('/web/position/list', { currentPage, pageSize, positionCode, positionName, orgName,userName }).then(res => res.data);
    },

    /**
     * 职位列表 - 未使用
     *
     * @param {number} [currentPage]
     * @param {number} [pageSize]
     * @param {string} [positionCode] 
     * @param {string} [positionName] 
     * @param {string} [orgName]
     * @param {string} [userName] 
     * @returns
     */
    noUseList(currentPage, pageSize, positionCode, positionName, orgName,userName) {
        return instance.post('/web/position/nouse/list', { currentPage, pageSize, positionCode, positionName, orgName,userName }).then(res => res.data);
    },

        /**
     * 职位列表 - 已使用
     *
     * @param {number} [currentPage]
     * @param {number} [pageSize]
     * @param {string} [positionCode] 
     * @param {string} [positionName] 
     * @param {string} [orgName]
     * @param {string} [userName] 
     * @returns
     */
    useList(currentPage, pageSize, positionCode, positionName, orgName,userName) {
        return instance.post('/web/position/use/list', { currentPage, pageSize, positionCode, positionName, orgName,userName }).then(res => res.data);
    },

    /**
     * 保存职位
     *
     * @param {string} rowNo
     * @param {string} positionCode
     * @param {string} positionName
     * @param {string} parentPositionNo
     * @param {string} orgNo
     * @returns
     */
    save(rowNo, positionCode, positionName, parentPositionNo, orgNo,positionType) {
        return instance.post('/web/position/save', { rowNo,  positionCode, positionName, parentPositionNo, orgNo,positionType }).then(res => res.data);
    },
    /**
     * 修改职位
     *
     * @param {string} rowNo
     * @param {string} operType
     * @returns
     */
    status(rowNo, operType) {
        return instance.post('/web/position/update/status', { rowNo, operType }).then(res => res.data);
    },
}

export default positionService;
