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

/** 活动服务 */
const activityService = {
    /**
     * 保存
     *
     * @param {object} [activityForm]
     */
    save(activityForm) {
        return instance.post('/web/activity/save',activityForm).then(res => res.data);
    },

    /**
     * 查询
     *
     * @param {string} [activityName] 
     *
     * @returns
     */
    list(currentPage,pageSize,activityName,activityStatus) {
        return instance.post('/web/activity/list', {currentPage,pageSize,activityName,activityStatus}).then(res => res.data);
    },

    /**
     * 删除
     *
     * @param {string} rowNo
     * @returns
     */
    delete(rowNo) {
        return instance.post('/web/activity/delete', { rowNo }).then(res => res.data);
    }
}

export default activityService;
