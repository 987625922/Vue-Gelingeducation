import request from "@/utils/request";

export function getSubjectList(query){
    return request({
        url:'/api/subject/lists',
        method:'get',
        params: query
        }
    )
}