import request from "@/utils/request";

export function addRole(data){
    return request({
        url:'/api/role/add',
        method:'post',
        data
        }
    )
}

export function getRoleList(){
    return request({
        url:'/api/role/lists',
        method:'get'
        }
    )
}

export function selByName(query){
    return request({
        url:'/api/role/find_by_name',
        method:'get',
        params: query
        }
    )
}

export function getRoleByIdForPermission(query){
    return request({
        url:'/api/role/find_permission_by_role_id',
        method:'get',
        params: query
        }
    )
}

export function delRole(query){
    return request({
        url:'/api/role/delete',
        method:'get',
        params: query
        }
    )
}

export function batchesDeletesRole(query){
    return request({
        url:'/api/role/batches_deletes',
        method:'get',
        params: query
        }
    )
}

export function getRoleByUserId(query){
    return request({
        url:'/api/role/find_by_user_id',
        method:'get',
        params: query
        }
    )
}

export function updateRole(data){
    return request({
        url:'/api/role/update',
        method:'post',
        data
        }
    )
}