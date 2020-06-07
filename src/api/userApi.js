import request from "@/utils/request";

export function addUser(data){
    return request({
        url:'/api/user/add',
        method:'post',
        data
        }
    )
}

export function getUserList(query){
    return request({
        url:'/api/user/lists',
        method:'get',
        params: query
        }
    )
}

export function delUser(query){
    return request({
        url:'/api/user/del',
        method:'get',
        params: query
        }
    )
}