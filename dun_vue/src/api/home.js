// 提供首页相关API函数
import request from '@/utils/request'

/**
 * 获取广告区轮播图
 * @returns Promise
 */
export const findBanner = () => {
        return request('/home/banner', 'get')
    }
    /**
     * 获取吧列表
     * @returns Promise
     */
export const getBas = ({ query, pagesize = 10, pagenum = 1 }) => {
        return request('/bas', 'get', { query, pagesize, pagenum })
    }
    /**
     * 获取粉丝关注帖子数量
     * @returns Promise
     */
export const getstats = ({ id }) => {
        return request('/home/stats', 'get', { id })
    }
    /**
     * 获取热门帖子列表
     * @returns Promise
     */
export const getHot = () => {
        return request('/home/hot', 'get')
    }
    /**
     * 获取热门贴吧列表
     * @returns Promise
     */
export const getBasHot = () => {
        return request('/home/hotbas', 'get')
    }
    /**
     * 获取最新帖子列表
     * @returns Promise
     */
export const getContents = ({ pagesize, pagenum }) => {
        return request('/home/contents', 'get', { pagesize, pagenum })
    }
    /**
     * 获取用户关注吧列表
     * @returns Promise
     */
export const getBasCollect = (id) => {
        return request(`/home/basCollect/${id}`, 'get')
    }
    //     /**
    //      * 搜索吧--模糊搜索
    //      * @returns Promise
    //      */
    // export const searchBa = ({ query, pagesize, pagenum }) => {
    //         // console.log({ query, pagesize, pagenum });
    //         return request('/home/search/ba', 'get', { query, pagesize, pagenum })
    //     }
    /**
     * 搜索主贴--模糊搜索
     * @returns Promise
     */
export const searchContent = ({ query, pagesize, pagenum }) => {
    return request('/home/search/content', 'get', { query, pagesize, pagenum })
}