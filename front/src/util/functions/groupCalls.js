import moment from "moment";

export const groupCalls = (calls) => {
    const days = [];
    let groupedCalls = {};

    for (let i = 0; i < 7; i ++) {
        let day = moment(new Date()).subtract(i, 'days').format('L');
        groupedCalls[day] = 0;
        days.push(day);
    }


    for (let i = 0; i < calls.length; i++) {
        let day = moment(new Date(calls[i].createdAt._seconds * 1000)).format('L');
        calls[i].createdAt = day;
        if (groupedCalls.hasOwnProperty(day)) {
            groupedCalls[day] ++;
        }
    }

    return groupedCalls;
}