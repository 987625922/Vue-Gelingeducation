import request from "@/utils/request";
import { searchByCriteria } from "./video";

export function getTeacherList(query) {
    return request({
        url: '/api/teacher/lists',
        method: 'get',
        params: query
    }
    )
}

export function deleteTeacher(query) {
    return request({
        url: '/api/teacher/delete',
        method: 'get',
        params: query
    }
    )
}

export function addTeacher(data) {
    return request({
        url: '/api/teacher/add',
        method: 'post',
        data
    }
    )
}

export function searchTeacher(query) {
    return request({
        url: '/api/teacher/search',
        method: 'get',
        params: query
    }
    )
}