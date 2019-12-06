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

/** 
 * 内容管理服务 
 * 培训 + 会员权益 + 通告
 */
const contentService = {
    /**
     * 查看内容详情
     *
     * @returns
     */
    info() {
        return instance.post('/web/content/info').then(res => res.data);
    },
    
    /**
     * 内容列表
     *
     * @param {number} [currentPage]
     * @param {number} [pageSize]
     * @param {string} [title] 
     * @returns
     */
    list(currentPage, pageSize,contentType, title) {
        return instance.post('/web/content/list', { currentPage, pageSize,contentType, title }).then(res => res.data);
    },

    /**
     * 保存内容
     *
     * @param {object} contentForm
     * @returns
     */
    save(contentForm) {
        return instance.post('/web/content/save', contentForm).then(res => res.data);
    },
    /**
     * 修改状态
     *
     * @param {string} rowNo
     * @param {string} operType
     * @returns
     */
    status(rowNo, operType) {
        return instance.post('/web/content/update/status', { rowNo, operType }).then(res => res.data);
    },

   /** 
    * 详情
    * @param {string} rowNo
    * @returns
    */
   detail(rowNo) {
       return instance.post('/web/content/info', { rowNo }).then(res => res.data);
   },
}

export default contentService;
