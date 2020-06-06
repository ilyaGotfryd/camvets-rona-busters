import API, {API_URL} from './api'

export const spaces = () => {
    return API.get(API_URL+'spaces/')
}

export const counts = (space_id, start_time, end_time ) =>
{
    return API.get( `${API_URL}/spaces/${space_id}/counts/?start_time=${start_time}&end_time=${end_time}` )
}