const { db } = require('../util/functions/admin');
const { COLLECTION, ROLE } = require('../util/constants/constant');

exports.getCalls = (req, res) => {
    db
    .collection(COLLECTION.CALL)
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let calls = [];
        data.forEach(document => {
            calls.push({
                ...document.data(),
                callId: document.id
            }); 
        });
        return res.json(calls);
    })
    .catch(err => console.error(err));
}

exports.getCallsPerCompany = (req, res) => {
    const companyName = req.params.companyName;
    const calls = db.collection(COLLECTION.CALL)
                    .where('employeeCompanyName', '==', companyName)
                    .orderBy('employeeEmail')
                    .orderBy('createdAt', 'desc');

    if (req.user.role === ROLE.ADMIN) {
        calls.get()
        .then(data => {
            let calls = [];
            data.forEach(document => {
                calls.push({
                    ...document.data(),
                    callId: document.id
                }); 
            });
            return res.json(calls);
        })
        .catch(err => console.error(err));
    } else if (req.user.role === ROLE.CEO ) {
        db.doc(`/${COLLECTION.CEO}/${req.user.email}`).get()
        .then(doc => {
            if (doc.data().companyName === companyName) {
                calls.get()
                .then(data => {
                    let calls = [];
                    data.forEach(document => {
                        calls.push({
                            ...document.data(),
                            callId: document.id
                        }); 
                    });
                    return res.json(calls);
                })
                .catch(err => console.error(err));
            } else {
                return res.status(403).json({ error: 'Unauthorized'});
            }
        })
    } else if (req.user.role === ROLE.EMPLOYEE) {
        return res.status(403).json({ error: 'Unauthorized'});
    }
}

exports.getCallsPerEmployee = (req, res) => {
    const employeeEmail = req.params.employeeEmail;
    const companyName = req.params.companyName;

    const calls = db.collection(COLLECTION.CALL)
                    .where('employeeEmail', '==', employeeEmail)
                    .orderBy('createdAt', 'desc');

    if (req.user.role === ROLE.ADMIN) {
        calls.get()
        .then(data => {
            let calls = [];
            data.forEach(document => {
                calls.push({
                    ...document.data(),
                    callId: document.id
                }); 
            });
            return res.json(calls);
        })
        .catch(err => console.error(err));
    } else if (req.user.role === ROLE.CEO ) {
        db.doc(`/${COLLECTION.CEO}/${req.user.email}`).get()
        .then(doc => {
            if (doc.data().companyName === companyName) {
                calls.get()
                .then(data => {
                    let calls = [];
                    data.forEach(document => {
                        calls.push({
                            ...document.data(),
                            callId: document.id
                        }); 
                    });
                    return res.json(calls);
                })
                .catch(err => console.error(err));
            } else {
                return res.status(403).json({ error: 'Unauthorized'});
            }
        })
    } else if (req.user.role === ROLE.EMPLOYEE) {
        db.doc(`/${COLLECTION.EMPLOYEE}/${req.user.email}`).get()
        .then(doc => {
            if (doc.data().email === employeeEmail) {
                    calls.get()
                    .then(data => {
                        let calls = [];
                        data.forEach(document => {
                            calls.push({
                                ...document.data(),
                                callId: document.id
                            }); 
                        });
                        return res.json(calls);
                    })
                    .catch(err => console.error(err));
                } else {
                    return res.status(403).json({ error: 'Unauthorized'});
                }
        });
    }
}