import moment from "moment";

export const groupCalls = (calls) => {
    let groupedCalls = {};
    let comments = [];

    for (let i = 0; i < 7; i ++) {
        let day = moment(new Date()).subtract(i, 'days').format('L');
        groupedCalls[day] = 0;
    }


    for (let i = 0; i < calls.length; i++) {
        if (calls[i].comments !== "" && comments.length < 20) {
            let service = calls[i].employeeEmail === "" ? "no-answer" : calls[i].employeeEmail.split("@")[0];
            comments.push([calls[i].comments, service, calls[i].companyName]);
        }

        let day = moment(new Date(calls[i].createdAt._seconds * 1000)).format('L');
        calls[i].createdAt = day;
        if (groupedCalls.hasOwnProperty(day)) {
            groupedCalls[day] ++;
        }
    }

    let info = [comments, groupedCalls];

    return info;
}