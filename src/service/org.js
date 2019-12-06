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

/** 部门管理服务 */
const orgService = {
    /**
     * 查看部门详情
     *
     * @returns
     */
    info() {
        return instance.post('/web/org/info').then(res => res.data);
    },
    
    /**
     * 部门列表
     *
     * @param {number} [currentPage]
     * @param {number} [pageSize]
     * @param {string} [orgCode] 
     * @param {string} [orgName] 
     * @returns
     */
    list(currentPage, pageSize, orgCode,orgName) {
        return instance.post('/web/org/list', { currentPage, pageSize, orgCode,orgName }).then(res => res.data);
    },

    /**
     * 保存部门
     *
     * @param {string} rowNo
     * @param {string} orgCode
     * @param {string} orgName
     * @param {string} parentRow
     * @param {number} sortSn
     * @returns
     */
    save(rowNo, orgCode, orgName, parentRow,sortSn) {
        return instance.post('/web/org/save', { rowNo, orgCode, orgName, parentRow,sortSn }).then(res => res.data);
    },
    /**
     * 修改部门状态
     *
     * @param {string} rowNo
     * @param {string} operType
     * @returns
     */
    status(rowNo, operType) {
        return instance.post('/web/org/update/status', { rowNo, operType }).then(res => res.data);
    },
}

export default orgService;
