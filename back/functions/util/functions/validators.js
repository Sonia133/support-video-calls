const isEmpty = (value) => {
    if (value.trim() === '') return true;
    else return false;
}

const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true;
    else return false;
}

exports.validateEmail = (email) => {
    let errors = {};

    if (isEmpty(email)) errors.email = 'Must not be empty.'
    else if (!isEmail(email)) errors.email = 'Must be a valid email.'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

exports.validatePassword = (data) => {
    let errors = {};

    if (isEmpty(data.password) || isEmpty(data.confirmPassword)) errors.password = 'Must not be empty.'
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match.'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateSchedule = (data) => {
    let errors = {};

    if (data.length !== 5) errors.days = 'Schedule should have an entrance for each of the five working days'
    data.forEach(day => {
        if (isEmpty(day)) errors.schedule = 'Day must not be empty.'

        let hours = day.split("+");

        if ((parseInt(hours[0]) < 0 || parseInt(hours[0]) > 23) || (parseInt(hours[1]) < 0 || parseInt(hours[1]) > 23)) errors.hour = 'Hour should be between 0 and 23.'
        if (parseInt(hours[0]) >= parseInt(hours[1])) errors.inconsistency = 'Ending hour should be bigger than starting hour.'
    }) 
    
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateNewPassword = (oldPassword, newPassword) => {
    let errors = {};
    console.log(oldPassword)
    console.log(newPassword)

    if (isEmpty(oldPassword) || isEmpty(newPassword)) errors.empty = 'Must not be empty.'
    if (oldPassword === newPassword) errors.password = 'New password can\'t be one of the old passwords'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLoginData = (data) => {
    let errors = {};
    
    if (isEmpty(data.email)) errors.email = 'Must not be empty.'
    else if (!isEmail(data.email)) errors.email = 'Must be a valid email.'

    if (isEmpty(data.password)) errors.password = 'Must not be empty.'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}