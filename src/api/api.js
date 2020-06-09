import request from "@/utils/request";

export function login(data){
    return request({
        url:'/web/login',
        method:'post',
        data
        }
    )
}

export function courseUpdate(data){
    return request({
        url:'/api/course/update',
        method:'post',
        data
        }
    )
}

export function selectCourse(data){
    return request({
        url:'/api/course/sel_by_name_or_status_price_teacher',
        method:'get',
        params: data
        }
    )
}

export function delCourse(id){
    return request({
        url:'/api/course/delect',
        method:'get',
        params: {id}
        }
    )
}

export function getCourseList(query){
    return request({
        url:'/api/course/lists',
        method:'get',
        params: query
        }
    )
}

export function delMoreCourse(data){
    return request({
        url:'/api/course/batches_deletes',
        method:'get',
        params: data
        }
    )
}

export function addCourse(data){
    return request({
        url:'/api/course/add',
        method:'post',
        data
        }
    )
}

export function getLogList(query){
    return request({
        url:'/api/logs/lists',
        method:'get',
        params: query
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