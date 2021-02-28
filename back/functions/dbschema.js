// index by token
accountRequest: {
    email,
    companyName,
    role
}

// index by email

admin: {
    email, 
    firstname,
    lastname,
    adminId,
    createdAt,
    imageUrl
}

ceo: {
    email,
    firstname,
    lastname,
    companyName,
    generatedLink,
    imageUrl,
    ceoId
}

employee: {
    email,
    firstname,
    lastname,
    companyName,
    schedule, // ['9-5', '8-2', ..] if empty => notBoarded
    available,
    imageUrl,
    employeeId
}

call: {
    createdAt,
    employeeId,
    duration,
    callFeedback,
    employeeFeedback
}