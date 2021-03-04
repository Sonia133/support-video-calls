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
    } else if (req.user.role === ROLE.CEO ) {
        db.doc(`/${COLLECTION.CEO}/${req.user.email}`).get()
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
    } else if (req.user.role === ROLE.EMPLOYEE) {
        db.doc(`/${COLLECTION.EMPLOYEE}/${req.user.email}`).get()
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

exports.getEmployeeDetails = (req, res) => {
    const companyName = req.params.companyName;

    const employees = db.collection(COLLECTION.EMPLOYEE)
                    .where('email', '==', req.params.employeeEmail)
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

exports.updateSchedule = (req, res) => {
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
            link = `http://localhost:3000/${doc.data().companyName}`;

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
        return res.status(500).json({ general: 'Something went wrong. Please try again!' });
    })
}