import request from "@/utils/request";

export function getCourseListBySubjectId(query) {
    return request({
        url: '/api/course/getCourseListBySubjectId',
        method: 'get',
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

export function selectCourse(data){
    return request({
        url:'/api/course/searchCriteria',
        method:'get',
        params: data
        }
    )
}

export function delCourse(id){
    return request({
        url:'/api/course/delete',
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
        url:'/api/course/batches_delete',
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

export function getCourseListByVideoId(query) {
    return request({
        url: '/api/course/getCourseListByVideoId',
        method: 'get',
        params: query
    }
    )
}
