// 提供用户相关的API函数
import request from '@/utils/request'
/**
 *账号密码登录
 * @param {String} username -账号
 * @param {String} password -密码
 * @returns Promise
 */
export const userAccountLogin = ({ username, password }) => {
        return request('/login', 'post', { username, password })
    }
    /**
     * 用户退出登录
     * @param {String} id -用户id
     * @returns Promise
     */
export const logout = (id) => {
        return request('/logout', 'put', id)
    }
    /**
     *注册用户
     * @param {String} username -账号
     * @param {String} password -密码
     * @returns Promise
     */
export const userRegister = ({ username, password }) => {
        return request('/users', 'post', { username, password })
    }
    /**
     * 查询用户信息
     * @param {String} id -用户id
     * @returns Promise
     */
export const userSearch = (id) => {
        return request(`/users/${id}`, 'get')
    }
    /**
     * 获取用户列表
     * @param {String} id -用户id
     * @returns Promise
     */
export const getUsers = ({ query, pagesize = 10, pagenum = 1 }) => {
        return request('/getusers', 'get', { query, pagesize, pagenum })
    }
    /**
     * 修改用户信息
     * @param {String} id -用户id
     * @returns Promise
     */
export const userRevise = ({ id, nickname, email, sex, signature }) => {
        return request(`/users/renew/${id}`, 'put', { nickname, email, sex, signature })
    }
    /**
     * 修改用户密码
     * @returns Promise
     */
export const putpassword = ({ userid, oldpwd, newpwd }) => {
        return request('/users/putpassword', 'put', { userid, oldpwd, newpwd })
    }
    /**
     * 获取用户帖子列表
     * @returns Promise
     */
export const userContent = ({ query, pagesize = 10, pagenum = 1 }) => {
        return request('/user/content', 'get', { query, pagesize, pagenum })
    }
    /**
     * 获取用户关注列表
     * @returns Promise
     */
export const userFocusOn = ({ query, pagesize = 10, pagenum = 1 }) => {
        return request('/user/focusOn', 'get', { query, pagesize, pagenum })
    }
    /**
     * 获取用户粉丝列表
     * @returns Promise
     */
export const userFan = ({ query, pagesize = 10, pagenum = 1 }) => {
        return request('/user/fan', 'get', { query, pagesize, pagenum })
    }
    /**
     * 获取用户收藏列表
     * @returns Promise
     */
export const userCollect = ({ query, pagesize = 10, pagenum = 1 }) => {
        return request('/user/collect', 'get', { query, pagesize, pagenum })
    }
    /**
     * 发送图片给后台
     * @returns Promise
     */
export const upload = (form) => {
        return request('/upload', 'post', form)
    }
    /**
     * 修改用户头像
     * @returns Promise
     */
export const reviseUserImg = ({ id, tmp_path }) => {
        return request(`/user/renew/img/${id}`, 'put', { id, tmp_path })
    }
    /**
     * 查询是否关注这个用户
     * @returns Promise
     */
export const seaLike = ({ memberid, userid }) => {
        return request('/user/seaLike', 'get', { memberid, userid })
    }
    /**
     * 关注这个用户
     * @returns Promise
     */
export const addLike = ({ memberid, userid }) => {
        return request('/user/addLike', 'post', { memberid, userid })
    }
    /**
     * 取消关注这个用户
     * @returns Promise
     */
export const delLike = ({ memberid, userid }) => {
        return request('/user/delLike', 'delete', { memberid, userid })
    }
    /**
     * 吧主添加小吧主
     * @returns Promise
     */
export const addBaTeam = ({ postid, takeoverid }) => {
        return request(`/user/ba/addTeam`, 'put', { postid, takeoverid })
    }
    /**
     * 吧主删除小吧主
     * @returns Promise
     */
export const delBaTeam = ({ postid, takeoverid }) => {
        return request('/user/ba/delTeam', 'put', { postid, takeoverid })
    }
    /**
     * 吧主处理接收的申请(修改申请状态+处理结果)
     * @returns Promise
     */
export const submitBaTeam = ({ id, result }) => {
        return request('/user/ba/submitTeam', 'put', { id, result })
    }
    /**
     * 用户发送申请小吧主
     * @returns Promise
     */
export const applicationTeam = ({ user_id, takeover_id, post_id, content }) => {
        return request('/user/ba/applicationTeam', 'post', { user_id, takeover_id, post_id, content })
    }
    /**
     * 查询用户是吧主的贴吧列表
     * @returns Promise
     */
export const getUserBaAdmin = (id) => {
        return request(`/user/admin/${id}`, 'get')
    }
    /**
     * 吧主接收的申请
     * @returns Promise
     */
export const getBaTeam = ({ id }) => {
        return request(`/user/ba/getTeam/${id}`, 'get')
    }
    /**
     * 用户申请小吧主的列表
     * @returns Promise
     */
export const getUserTeam = ({ id }) => {
        return request(`/user/getTeam/${id}`, 'get')
    }
    /**
     * 用户撤销申请小吧主
     * @returns Promise
     */
export const delTeam = ({ id, userid }) => {
        return request('/user/delTeam', 'delete', { id, userid })
    }
    /**
     * 用户申请创建贴吧
     * @returns Promise
     */
export const createBa = ({ user_id, ba_name, content }) => {
        return request('/user/ba/createBa', 'post', { user_id, ba_name, content })
    }
    /**
     * 用户申请创建贴吧的列表
     * @returns Promise
     */
export const getBaUserTeam = ({ id }) => {
        return request(`/user/ba/getBa/${id}`, 'get')
    }
    /**
     * 用户撤销申请创建贴吧
     * @returns Promise
     */
export const delBa = ({ id, userid }) => {
        return request('/user/ba/delBa', 'delete', { id, userid })
    }
    /**
     * 贴吧头像上传后台
     * @returns Promise
     */
export const UploadBaImg = (form) => {
        return request('/upload/ba', 'post', form)
    }
    /**
     * 修改吧基本信息
     * @returns Promise
     */
export const submitba = ({ id, name, signature, img }) => {
        return request(`/user/submitba/${id}`, 'put', { name, signature, img })
    }
    /**
     * 用户添加历史记录
     * @param {String} userid -用户id
     * @returns Promise
     */
export const addHistoryRecord = ({ userid, contentid }) => {
    return request('/user/addHistoryRecord', 'put', { userid, contentid })
}