// 用户模块
export default {
    namespaced: true,
    state() {
        return {
            // 用户信息
            profile: {
                id: '',
                username: '',
                nickname: '',
                face: '',
                sex: '',
                email: '',
                signature: '',
                add_time: '',
                token: ''
            },
            // 登录后回调路径
            redirectUrl: '/'
        }
    },
    mutations: {
        // 修改用户信息，payload就是用户信息对象
        setUser(state, payload) {
            // console.log(payload);
            state.profile = payload
        },
        setRedirectUrl(state, url) {
            state.redirectUrl = url
        }
    }
}