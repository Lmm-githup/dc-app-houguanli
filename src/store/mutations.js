export default {
  updateToken(state, token) {
    state.token = token;
  },

  updateMessageCount(state, messageNum) {
    state.messageNum = messageNum;
  },

  updateUserInfo(state, newUserInfo) {
    const oldUserInfo = state.userInfo;
    for (const k in oldUserInfo) {
      if (newUserInfo.hasOwnProperty(k)) {
        oldUserInfo[k] = newUserInfo[k];
      }
    }
  },

  resetState(state) {
    state.token = "";
    resetUserInfo();

    function resetUserInfo() {
      const userInfo = state.userInfo;
      for (const k in userInfo) {
        if (userInfo.hasOwnProperty(k)) {
          userInfo[k] = '';
        }
      }
    }
  },
}
