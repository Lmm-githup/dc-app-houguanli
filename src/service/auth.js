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

/** 职位服务 */
const authService = {
    /**
     * 保存职位类型与角色关系
     *
     * @param {string} [positionType]  职位类型
     * @param {string} [roleNo]  角色编号
     */
    save(positionType, roleNo) {
        return instance.post('/web/role/type/save', { positionType, roleNo }).then(res => res.data);
    },

    /**
     * 查询职位类型列表
     *
     * @param {string} [dataType] 类型
     *
     * @returns
     */
    list(currentPage,pageSize,positionTypeName) {
        return instance.post('/web/role/type/list', {currentPage,pageSize,positionTypeName}).then(res => res.data);
    },

    /**
     * 删除
     *
     * @param {number} id ID
     * @returns
     */
    delete(id) {
        return instance.post('/web/role/type/delete', { id }).then(res => res.data);
    }
}

export default authService;
