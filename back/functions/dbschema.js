// index by token
accountRequest: {
    email,
    companyName,
    role
}

// index by email

user: {
    email,
    role,
    userId
}

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

// index by id
call: {
    createdAt,
    employeeEmail,
    companyName,
    duration,
    feedback,
    comments
}