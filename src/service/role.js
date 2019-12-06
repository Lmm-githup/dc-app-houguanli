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

/** 角色管理服务 */
const roleService = {
    /**
     * 查看角色详情
     *
     * @returns
     */
    info() {
        return instance.post('/web/role/info').then(res => res.data);
    },
    
    /**
     * 角色
     *
     * @param {number} [currentPage]
     * @param {number} [pageSize]
     * @param {string} [roleName] 账号
     * @returns
     */
    list(currentPage, pageSize, roleName) {
        return instance.post('/web/role/list', { currentPage, pageSize, roleName }).then(res => res.data);
    },

    /**
     * 保存角色
     *
     * @param {string} rowNo
     * @param {string} roleName
     * @param {string} remark
     * @returns
     */
    save(rowNo, roleName, remark) {
        return instance.post('/web/role/save', {rowNo, roleName, remark }).then(res => res.data);
    },
    /**
     * 修改角色
     *
     * @param {string} rowNo
     * @param {string} operType
     * @returns
     */
    status(rowNo, operType) {
        return instance.post('/web/role/update/status', { rowNo, operType }).then(res => res.data);
    },
    /**
     * 查询角色对应的功能列表
     *
     * @param {number} rowNo 角色ID
     * @returns
     */
    moduleList(rowNo) {
        return instance.post('/web/role/module/list', { rowNo }).then(res => res);
    },

    /**
     * 保存角色和功能关系
     *
     * @param {number} roleNo 角色ID
     * @param {array} viewList 功能列表
     * @returns
     */
    saveReoleModule(roleNo, viewList) {
        return instance.post('/web/role/module/save', { roleNo, viewList }).then(res => res);
    }
}

export default roleService;
