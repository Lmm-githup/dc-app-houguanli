import axios from 'axios';
import store from "../store/index";

const instance = axios.create({
    baseURL: process.env.baseURL,
});

store.watch(state => {
    instance.defaults.headers = {
        Authorization: store.getters.token
    };
});

/** 数据导入服务 */
const impService = {
    /**
     * 获取导入url地址
     *
     * @returns
     */
    getImpStarUrl() {
        return process.env.baseURL + "/web/analysis/data/import/star";
    },

    /**
     * 获取导入url地址
     *
     * @returns
     */
    getImpGoldUrl() {
        return process.env.baseURL + "/web/analysis/data/import/gold";
    },
    /**
     * 删除
     * @param {string} dataType 
     */
    deleteAll(dataType){
        return instance.post('/web/analysis/data/deleteAll', { dataType }).then(res => res.data);
    },

    /**
     * 获取导入模板url地址
     *
     * @returns
     */
    getImpStarTempUrl() {
        return process.env.importStarTempUrl;
    },

        /**
     * 获取导入模板url地址
     *
     * @returns
     */
    getImpGoldTempUrl() {
        return process.env.importGoldTempUrl;
    },

    /**
     * 查询列表
     *
     * @param {string} [dataType] 类型
     *
     * @returns
     */
    list(currentPage,pageSize,dataType) {
        return instance.post('/web/analysis/data/list', {currentPage,pageSize,dataType}).then(res => res.data);
    },

    /**
     * 删除
     *
     * @param {number} id ID
     * @returns
     */
    delete(id) {
        return instance.post('/web/analysis/data/delete', { id }).then(res => res.data);
    }
}

export default impService;
