import request from "@/utils/request";

export function getCourseListBySubjectId(query) {
    return request({
        url: '/api/course/getCourseListBySubjectId',
        method: 'get',
        params: query
    }
    )
}