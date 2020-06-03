import request from "@/utils/request";

export function login(data){
    return request({
        url:'/web/login',
        method:'post',
        data
        }
    )
}

export function getTeacherList(query){
    return request({
        url:'/api/teacher/lists',
        method:'get',
        params: query
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