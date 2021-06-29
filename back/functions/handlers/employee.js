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
        .catch((err) => {
            console.log(err.code)
            return res.status(500).json({ error: err.code });
        });
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
                .catch((err) => {
                    console.log(err.code)
                    return res.status(500).json({ error: err.code });
                });
            } else {
                return res.status(403).json({ error: 'Unauthorized'});
            }
        })
    }
}

exports.getEmployee = (req, res) => {
    const companyName = req.params.companyName;
    const employee = db.doc(`${COLLECTION.EMPLOYEE}/${req.params.employeeEmail}`);

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
        .catch((err) => {
            console.log(err.code)
            return res.status(500).json({ error: err.code });
        });
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
                .catch((err) => {
                    console.log(err.code)
                    return res.status(500).json({ error: err.code });
                });
            } else {
                return res.status(403).json({ error: 'Unauthorized'});
            }
        })
    } 
}

exports.updateSchedule = (req, res) => {
    let schedule = req.body.schedule;
    const { valid, errors } = validateSchedule(schedule);
    if (!valid) {
        return res.status(400).json(errors);
    } else {
        for (let i = 0; i < schedule.length; i++) {
            schedule[i] = schedule[i].replace("+", "-");
        }
    }
    
    let ceoId, link;

    db.doc(`/${COLLECTION.EMPLOYEE}/${req.user.email}`)
    .update({
        schedule,
        boarded: true,
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

            return db.doc(`/${COLLECTION.CEO}/${ceoEmail}`).update({
                generatedLink: link
            });
        }
    })
    .then(() => {
        res.status(200).json({ message: 'Schedule added successfully.' });
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
}

exports.setAvailability = (req, res) => {

    db.doc(`/${COLLECTION.EMPLOYEE}/${req.user.email}`)
    .update({
        available: req.body.available
    })
    .then(() => {
        res.status(200).json({ message: `Employee set available:${req.body.available} successfully.` });
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
}

exports.getAllEmployees = (req, res) => {
    db.collection(COLLECTION.EMPLOYEE)
      .get()
      .then((data) => {
        let employees = [];
        data.forEach((document) => {
          employees.push({
            ...document.data(),
            employeeId: document.id,
          });
        });
        return res.json(employees);
      })
      .catch((err) => {
        console.log(err.code)
        return res.status(500).json({ error: err.code });
      });
};
