import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex);

const state = {

    cookiePrefix: "dgb_", // cookie前缀

    token: "", // 通讯令牌

    messageNum: "", // 消息数量

    userInfo: {
        id: "", //	用户ID
        userName: "", //	姓名
        userType: "", //	用户类型
        loginName: "", // 账号
    }


};


export default new Vuex.Store({
    state,
    mutations,
    getters,
    plugins: [createPersistedState()]
});
