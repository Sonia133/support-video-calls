import moment from "moment";

export const groupFeedback = (feedback) => {
    let groupedFeedback = {};

    for (let i = 0; i < 7; i ++) {
        let day = moment(new Date()).subtract(i, 'days').format('L');
        groupedFeedback[day] = 0;
    }


    for (let day in feedback) {
        if (groupedFeedback.hasOwnProperty(day)) {
            groupedFeedback[day] = feedback[day].callsFeedback / feedback[day].callsNumber;
        }
    }

    return groupedFeedback;
}