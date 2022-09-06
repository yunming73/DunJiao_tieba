// 提供用户相关的API函数
import request from '@/utils/request'
/**
 *后台管理员登录
 * @param {String} username -账号
 * @param {String} password -密码
 * @returns Promise
 */
export const AdminLogin = ({ username, password }) => {
        return request('/admin/login', 'post', { username, password })
    }
    /**
     * 获取用户列表
     * @param {String} id -用户id
     * @returns Promise
     */
export const getUsers = ({ query, pagesize, pagenum }) => {
        return request('/getusers', 'get', { query, pagesize, pagenum })
    }
    /**
     * 查询用户信息
     * @param {String} id -用户id
     * @returns Promise
     */
export const userSearch = (id) => {
        return request(`/users/${id}`, 'get', id)
    }
    /**
     * 查询用户是吧主的贴吧列表
     * @returns Promise
     */
export const getUserBaAdmin = (id) => {
        return request(`/user/admin/${id}`, 'get')
    }
    /**
     * 查询用户是小吧主的贴吧列表
     * @returns Promise
     */
export const getUserBaTeam = (id) => {
        return request(`/user/team/${id}`, 'get')
    }
    /**
     * 修改用户封禁状态
     * @returns Promise
     */
export const submitUserBlack = ({ id, black }) => {
        return request(`/user/black/${id}`, 'put', { black })
    }
    /**
     * 删除用户
     * @returns Promise
     */
export const delUsers = (id) => {
        return request('/delusers', 'delete', { id })
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
     * 用户申请创建贴吧的全部列表
     * @returns Promise
     */
export const getBaApplication = ({ query, pagesize, pagenum }) => {
        return request('/user/getBa/application', 'get', { query, pagesize, pagenum })
    }
    /**
     * 处理创建贴吧的申请(修改申请状态+处理结果)
     * @returns Promise
     */
export const submitBaCreate = ({ id, result }) => {
        return request('/user/ba/submitCreate', 'put', { id, result })
    }
    /**
     * 撤销申请创建贴吧
     * @returns Promise
     */
export const delBa = ({ id, userid }) => {
    return request('/user/ba/delBa', 'delete', { id, userid })
}