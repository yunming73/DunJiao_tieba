// 提供用户相关的API函数
import request from '@/utils/request'

/**
 * 获取吧列表
 * @returns Promise
 */
export const getBas = ({ query, pagesize, pagenum }) => {
    return request('/bas', 'get', { query, pagesize, pagenum })
}

/**
 * 添加贴吧
 * @returns Promise
 */
export const addBas = ({ name, userid }) => {
        return request('/addbas', 'post', { name, userid })
    }
    /**
     * 删除贴吧
     * @returns Promise
     */
export const delBas = (id) => {
        return request('/delbas', 'delete', { id })
    }
    /**
     * 查询吧信息--单个贴吧
     * @param {String} id -贴吧id
     * @returns Promise
     */
export const basSearch = (id) => {
        return request(`/bas/${id}`, 'get')
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
        // console.log({ id, name, signature, img });
        return request(`/user/submitba/${id}`, 'put', { name, signature, img })
    }
    /**
     * 获取吧所属帖子列表
     * @returns Promise
     */
export const getBaContents = ({ query, pagesize = 10, pagenum = 1 }) => {
        return request('/bass/contenss', 'get', { query, pagesize, pagenum })
    }
    /**
     *  查询主贴(根据id)
     * @returns Promise
     */
export const searchContent = ({ id }) => {
        return request(`/bas/contents/${id}`, 'get')
    }
    /**
     *  删除主贴(根据主贴id)
     * @returns Promise
     */
export const delContent = (id) => {
        return request(`/bas/content/del/${id}`, 'delete')
    }
    /**
     *  获取主贴点赞数量 收藏数量 评论数量
     * @returns Promise
     */
export const getContentStats = (id) => {
        return request(`/bas/content/stats/${id}`, 'get')
    }
    /**
     *  加精帖子
     * @returns Promise
     */
export const addEssenceComment = (id) => {
        return request(`/bas/content/Essence/${id}`, 'put')
    }
    /**
     *  取消加精帖子
     * @returns Promise
     */
export const delEssenceComment = (id) => {
        return request(`/bas/content/delEssence/${id}`, 'put')
    }
    /**
     * 帖子发送图片给后台
     * @returns Promise
     */
export const uploadContent = (form) => {
        return request('/upload/content', 'post', form)
    }
    /**
     *  修改主贴
     * @returns Promise
     */
export const submitMainComment = ({ id, title, content, img }) => {
        return request(`/bas/content/submit/${id}`, 'put', { title, content, img })
    }
    /**
     *  查询从贴列表
     * @returns Promise
     */
export const getContentsComment = ({ query, pagesize, pagenum, sort }) => {
        return request('/bas/content/comment', 'get', { query, pagesize, pagenum, sort })
    }
    /**
     *  获取楼主发言的从贴列表
     * @returns Promise
     */
export const getLandlordContentComment = ({ query, pagesize, pagenum, sort, userid }) => {
        return request('/bas/content/landlordComment', 'get', { query, pagesize, pagenum, sort, userid })
    }
    /**
     * 获取从贴的评论列表
     * @returns Promise
     */
export const getContentsComments = ({ query, pagesize, pagenum }) => {
        return request('/bas/content/comment/s', 'get', { query, pagesize, pagenum })
    }
    /**
     *  获取从贴点赞数量 评论数量
     * @returns Promise
     */
export const getContentCommentStats = (id) => {
        return request(`/bas/content/comment/stats/${id}`, 'get')
    }
    /**
     *  删除从贴的评论(根据从贴的评论id)
     * @returns Promise
     */
export const DelContentComments = (id) => {
        return request(`/bas/content/comment/s/del/${id}`, 'delete')
    }
    /**
     *  删除主贴的从贴(根据从贴id)
     * @returns Promise
     */
export const delContentComment = (id) => {
        return request(`/bas/content/comment/del/${id}`, 'delete')
    }
    /**
     * 搜索主贴--模糊搜索
     * @returns Promise
     */
export const homeSearchContent = ({ query, pagesize, pagenum }) => {
    return request('/home/search/content', 'get', { query, pagesize, pagenum })
}