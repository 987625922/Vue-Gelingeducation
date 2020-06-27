import request from "@/utils/request";


export function getLogList(query){
    return request({
        url:'/api/logs/lists',
        method:'get',
        params: query
        }
    )
}

export function delOneLog(query){
    return request({
        url:'/api/logs/delete_one',
        method:'get',
        params: query
        }
    )
}

export function delMore(query){
    return request({
        url:'/api/logs/batches_delete',
        method:'get',
        params: query
        }
    )
}

export function solve(query){
    return request({
        url:'/api/logs/solve',
        method:'get',
        params: query
        }
    )
}

export function recurrent(query){
    return request({
        url:'/api/logs/recurrent',
        method:'get',
        params: query
        }
    )
}
