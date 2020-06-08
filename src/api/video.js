import request from "@/utils/request";

export function getVideoList(query){
    return request({
        url:'/api/video/lists',
        method:'get',
        params: query
        }
    )
}