import request from "@/utils/request";

export function login(data){
    return request({
        url:'/web/login',
        method:'post',
        data
        }
    )
}

export function getIndexData(query){
    return request({
        url:'/web/index',
        method:'get'
        }
    )
}

export function getCaptcha(query){
    return request({
        url:'/web/captcha',
        method:'get'
        }
    )
}