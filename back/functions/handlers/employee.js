const { db } = require('../util/functions/admin');
const { COLLECTION, ROLE } = require('../util/constants/constant');
const { generatedLinkMail } = require('../util/functions/mailer');
const { validateSchedule } = require('../util/functions/validators');

exports.getEmployees = (req, res) => {
    const companyName = req.params.companyName;
    const employees = db.collection(COLLECTION.EMPLOYEE)
                    .where('companyName', '==', companyName)
                    .orderBy('lastname');

    if (req.user.role === ROLE.ADMIN) {
        employees.get()
        .then(data => {
            let employees = [];
            data.forEach(document => {
                employees.push({
                    ...document.data(),
                    employeeId: document.id
                }); 
            });
            return res.json(employees);
        })
        .catch(err => console.error(err));
    } else if (req.user.role === ROLE.CEO || req.user.role === ROLE.EMPLOYEE) {
        db.doc(`/${req.user.role}/${req.user.email}`).get()
        .then(doc => {
            if (doc.data().companyName === companyName) {
                employees.get()
                .then(data => {
                    let employees = [];
                    data.forEach(document => {
                        employees.push({
                            ...document.data(),
                            employeeId: document.id
                        }); 
                    });
                    return res.json(employees);
                })
                .catch(err => console.error(err));
            } else {
                return res.status(403).json({ error: 'Unauthorized'});
            }
        })
    }
}

exports.getEmployee = (req, res) => {
    const companyName = req.params.companyName;
    const employee = db.collection(`${COLLECTION.EMPLOYEE}/${req.params.employeeEmail}`);

    let employeeData;
    if (req.user.role === ROLE.ADMIN) {
        employee.get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Employee not found!'} );
            }
    
            employeeData = doc.data();
            employeeData.employeeId = doc.id; 
            
            return res.json(employeeData);
        })
        .catch(err => console.error(err));
    } else if (req.user.role === ROLE.CEO || req.user.role === ROLE.EMPLOYEE) {
        db.doc(`/${req.user.role}/${req.user.email}`).get()
        .then(doc => {
            if (doc.data().companyName === companyName) {
                employee.get()
                .then(doc => {
                    if (!doc.exists) {
                        return res.status(404).json({ error: 'Employee not found!'} );
                    }
            
                    employeeData = doc.data();
                    employeeData.employeeId = doc.id;

                    return res.json(employeeData);
                })
                .catch(err => console.error(err));
            } else {
                return res.status(403).json({ error: 'Unauthorized'});
            }
        })
    } 
}

exports.updateSchedule = (req, res) => {
    console.log(req.body)
    console.log(req.body.schedule)
    const { valid, errors } = validateSchedule(req.body.schedule);
    if (!valid) return res.status(400).json(errors);

    let ceoId, link;

    db.doc(`/${COLLECTION.EMPLOYEE}/${req.user.email}`)
    .update({
        schedule: req.body.schedule,
        available: true
    })
    .then(() => {
        return db.collection(COLLECTION.CEO).where('companyName', '==', req.user.companyName).get();
    })
    .then(data => {
        const doc = data.docs[0];
        ceoEmail = doc.data().email;

        if (doc.data().generatedLink === '') {
            link = `http://localhost:3000/call/${doc.data().companyName}`;

            generatedLinkMail(doc.data().email, link);
        }
        
        return db.doc(`/${COLLECTION.CEO}/${ceoEmail}`).update({
            boarderUsers: doc.data().boardedUsers + 1,
            generatedLink: link
        });
    })
    .then(() => {
        res.status(200).json({ message: 'Schedule added successfully.' });
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong. Please try again!' });
    })
}

exports.getFeedback = (req, res) => {
    const companyName = req.params.companyName;
    const employeeEmail = req.params.employeeEmail;

    const employee = db.collection(`${COLLECTION.EMPLOYEE}/${employeeEmail}`);
    const calls = db.collection(COLLECTION.CALL).where("employeeEmail", "==", employeeEmail);

    let employeeData;
    let callsNumber = 0;
    let feedbackGrade = 0;

    if (req.user.role === ROLE.ADMIN) {
        employee.get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Employee not found!'} );
            }
    
            employeeData = doc.data();
            employeeData.employeeId = doc.id; 
            employeeData.comments = [];

            calls.get()
            .then(data => {
                data.forEach(doc => {
                    employeeData.comments.push(doc.data().comments);
                    callsNumber += 1
                    feedbackGrade += doc.data().feedback;
                })

                employeeData.callsNumber = callsNumber;
                employeeData.feedback = feedbackGrade / callsNumber;
            })

            return res.json(employeeData);
        })
        .catch(err => console.error(err));
    } else if (req.user.role === ROLE.CEO) {
        db.doc(`/${req.user.role}/${req.user.email}`).get()
        .then(doc => {
            if (doc.data().companyName === companyName) {
                employee.get()
                .then(doc => {
                    if (!doc.exists) {
                        return res.status(404).json({ error: 'Employee not found!'} );
                    }
            
                    employeeData = doc.data();
                    employeeData.employeeId = doc.id; 
                    employeeData.comments = [];

                    calls.get()
                    .then(data => {
                        data.forEach(doc => {
                            employeeData.comments.push(doc.data().comments);
                            callsNumber += 1
                            feedbackGrade += doc.data().feedback;
                        })

                        employeeData.callsNumber = callsNumber;
                        employeeData.feedback = feedbackGrade / callsNumber;
                    })

                    return res.json(employeeData);
                })
                .catch(err => console.error(err));
            } else {
                return res.status(403).json({ error: 'Unauthorized'});
            }
        })
    } 
}