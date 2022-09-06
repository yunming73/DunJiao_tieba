// 提供用户相关的API函数
import request from '@/utils/request'

/**
 * 获取广告区轮播图
 * @returns Promise
 */
export const findBanner = () => {
        return request('/home/banner', 'get')
    }
    /**
     *轮播图上传后台
     * @returns Promise
     */
export const UploadBanner = (form) => {
        return request('/upload/banner', 'post', form)
    }
    /**
     * 修改轮播图
     * @returns Promise
     */
export const subbanner = ({ id, img, url }) => {
    return request(`/home/subbanner/${id}`, 'put', { img, url })
}