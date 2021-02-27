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

    if (isEmpty(data.password)) errors.password = 'Must not be empty.'
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match.'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateSchedule = (data) => {
    let errors = {};

    if (isEmpty(data)) errors.schedule = 'Must not be empty.'
    if (data.length !== 5) errors.days = 'Schedule should have an entrance for each of the five working days'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateNewPassword = (oldPassword, newPassword) => {
    let errors = {};

    if (oldPassword === newPassword) errors.password = 'New password can\'t be one of the old passwords'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}