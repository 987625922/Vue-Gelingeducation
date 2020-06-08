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

export function delMoreUser(query){
    return request({
        url:'/api/user/batches_deletes',
        method:'get',
        params: query
        }
    )
}

export function selByName(query){
    return request({
        url:'/api/user/sel_by_name',
        method:'get',
        params: query
        }
    )
}

export function editUser(data){
    return request({
        url:'/api/user/edit_info',
        method:'post',
        data
        }
    )
}

export function getInfo(){
    return request({
        url:'/api/user/get_info',
        method:'get'
        }
    )
}

export function updatePassword(data){
    return request({
        url:'/api/user/update_password',
        method:'post',
        data
        }
    )
}