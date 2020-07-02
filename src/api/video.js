import request from "@/utils/request";

export function getVideoList(query){
    return request({
        url:'/api/video/lists',
        method:'get',
        params: query
        }
    )
}

export function addData(data){
    return request({
        url:'/api/video/add',
        method:'post',
        data
        }
    )
}

export function delOne(query){
    return request({
        url:'/api/video/delete',
        method:'get',
        params: query
        }
    )
}

export function delMore(query){
    return request({
        url:'/api/video/batches_delete',
        method:'get',
        params: query
        }
    )
}

export function updateData(data){
    return request({
        url:'/api/video/update',
        method:'post',
        data
        }
    )
}

export function searchByCriteria(query){
    return request({
        url:'/api/video/search_by_criteria',
        method:'get',
        params: query
        }
    )
}