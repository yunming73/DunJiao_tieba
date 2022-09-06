// 提供首页相关API函数
import request from '@/utils/request'

/**
 * 获取吧列表
 * @returns Promise
 */
export const getBas = ({ query, pagesize = 10, pagenum = 1 }) => {
        return request('/bas', 'get', { query, pagesize, pagenum })
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
     * 获取关注吧的用户列表
     * @param {String} id -贴吧id
     * @returns Promise
     */
export const getBaUsers = (id) => {
        return request(`/bas/getBaUsers/${id}`, 'get')
    }
    /**
     * 获取吧所属帖子列表
     * @returns Promise
     */
export const getBaContents = ({ query, pagesize = 10, pagenum = 1 }) => {
        return request('/bass/contenss', 'get', { query, pagesize, pagenum })
    }
    /**
     *  查询贴吧加精帖子
     * @returns Promise
     */
export const getBaEssence = (id) => {
        return request(`/bas/essence/${id}`, 'get')
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
     * 用户点击关注对应吧
     * @returns Promise
     */
export const addbaCollect = ({ baid, userid }) => {
        return request('/bas/collect', 'post', { baid, userid })
    }
    /**
     * 用户点击取消关注对应吧
     * @returns Promise
     */
export const delbaCollect = ({ baid, userid }) => {
        return request('/bas/delCollect', 'delete', { baid, userid })
    }
    /**
     *  查询主贴(根据id)
     * @returns Promise
     */
export const searchContent = ({ id }) => {
        return request(`/bas/contents/${id}`, 'get')
    }
    /**
     *  获取主贴点赞数量 收藏数量 评论数量
     * @returns Promise
     */
export const getContentStats = (id) => {
        return request(`/bas/content/stats/${id}`, 'get')
    }
    /**
     *  删除主贴(根据主贴id)
     * @returns Promise
     */
export const delContent = (id) => {
        return request(`/bas/content/del/${id}`, 'delete')
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
     *  获取从贴点赞数量 评论数量
     * @returns Promise
     */
export const getContentCommentStats = (id) => {
        return request(`/bas/content/comment/stats/${id}`, 'get')
    }
    /**
     *  删除主贴的从贴(根据从贴id)
     * @returns Promise
     */
export const delContentComment = (id) => {
        return request(`/bas/content/comment/del/${id}`, 'delete')
    }
    /**
     * 获取从贴的评论列表
     * @returns Promise
     */
export const getContentsComments = ({ query, pagesize, pagenum }) => {
        return request('/bas/content/comment/s', 'get', { query, pagesize, pagenum })
    }
    /**
     *  删除从贴的评论(根据从贴的评论id)
     * @returns Promise
     */
export const DelContentComments = (id) => {
        return request(`/bas/content/comment/s/del/${id}`, 'delete')
    }
    /**
     * 用户评论从贴
     * @returns Promise
     */
export const addContentsComments = ({ content, userid, fatherid, postid, mainid }) => {
        return request('/bas/content/comment/s/add', 'post', { content, userid, fatherid, postid, mainid })
    }
    /**
     * 用户回复评论
     * @returns Promise
     */
export const readdContentsComments = ({ content, userid, fatherid, postid, mainid, respond }) => {
        return request('/bas/content/comment/s/readd', 'post', { content, userid, fatherid, postid, mainid, respond })
    }
    /**
     * 帖子发送图片给后台
     * @returns Promise
     */
export const uploadContent = (form) => {
        return request('/upload/content', 'post', form)
    }
    /**
     * 用户发表主贴
     * @returns Promise
     */
export const addMainComment = ({ title, content, baid, userid, img }) => {
        return request('/bas/content/add', 'post', { title, content, baid, userid, img })
    }
    /**
     * 用户发表从贴
     * @returns Promise
     */
export const addFollowComment = ({ content, fatherid, userid, postid, img }) => {
        return request('/bas/content/follow/add', 'post', { content, fatherid, userid, postid, img })
    }
    /**
     * 查询用户是否收藏这个帖子
     * @returns Promise
     */
export const seaContentComments = ({ contentid, userid }) => {
        return request('/bas/content/seaCollect', 'get', { contentid, userid })
    }
    /**
     * 用户收藏主贴
     * @returns Promise
     */
export const addContentCollect = ({ contentid, userid }) => {
        return request('/bas/content/addCollect', 'post', { contentid, userid })
    }
    /**
     * 用户取消收藏主贴
     * @returns Promise
     */
export const delContentCollect = ({ contentid, userid }) => {
        return request('/bas/content/delCollect', 'delete', { contentid, userid })
    }
    /**
     * 查询用户是否点赞这个帖子
     * @returns Promise
     */
export const seaContentLike = ({ contentid, userid }) => {
        return request('/bas/content/seaCollectLike', 'get', { contentid, userid })
    }
    /**
     * 用户点赞主贴
     * @returns Promise
     */
export const addContentLike = ({ contentid, userid }) => {
        return request('/bas/content/addCollectLike', 'post', { contentid, userid })
    }
    /**
     * 用户取消点赞主贴
     * @returns Promise
     */
export const delContentLike = ({ contentid, userid }) => {
        return request('/bas/content/delCollectLike', 'delete', { contentid, userid })
    }
    /**
     * 查询用户是否点赞这个从贴
     * @returns Promise
     */
export const seaContentCommentLike = ({ commentid, userid }) => {
        return request('/bas/content/comment/seaCollectLike', 'get', { commentid, userid })
    }
    /**
     * 用户点赞从贴
     * @returns Promise
     */
export const addContentCommentLike = ({ commentid, userid }) => {
        return request('/bas/content/comment/addCollectLike', 'post', { commentid, userid })
    }
    /**
     * 用户取消点赞从贴
     * @returns Promise
     */
export const delContentCommentLike = ({ commentid, userid }) => {
    return request('/bas/content/comment/delCollectLike', 'delete', { commentid, userid })
}