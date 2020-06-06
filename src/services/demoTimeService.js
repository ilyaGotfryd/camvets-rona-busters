var demo_start_time = new Date(Date.parse('2020-05-29T10:00:00Z'))
var real_start_time = new Date()

export const demo_now = () =>
{
    let now = new Date();
    let offset = now.getTime() - real_start_time.getTime();
    return new Date(demo_start_time.getTime() + offset)
}