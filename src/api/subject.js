import request from "@/utils/request";

export function getSubjectList(query){
    return request({
        url:'/api/subject/lists',
        method:'get',
        params: query
        }
    )
}

export function addsubject(data) {
    return request({
        url: '/api/subject/add',
        method: 'post',
        data
    }
    )
}

export function updateSubject(data) {
    return request({
        url: '/api/subject/update',
        method: 'post',
        data
    }
    )
}

export function delMoreSubject(query){
    return request({
        url:'/api/subject/batches_deletes',
        method:'get',
        params: query
        }
    )
}

export function delSubject(query){
    return request({
        url:'/api/subject/delete',
        method:'get',
        params: query
        }
    )
}

export function searchCriteria(query){
    return request({
        url:'/api/subject/search_criteria',
        method:'get',
        params: query
        }
    )
}