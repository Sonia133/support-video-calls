const { db, firebase, admin } = require('../util/functions/admin');
const { COLLECTION, MAILER, ROLE } = require('../util/constants/constant');
const config = require('../util/constants/config');

exports.addAdmin = () => {
    const noImg = 'no-img.png';

    let adminId;

    firebase.auth().createUserWithEmailAndPassword(MAILER.EMAIL, MAILER.PASSWORD)
    .then(data => {
        adminId = data.user.uid;

        const userCredentials = {
            email: MAILER.EMAIL,
            firstname: 'Sorina',
            lastname: 'Andrei',
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            adminId
        };

        return db.doc(`/${COLLECTION.ADMIN}/${MAILER.EMAIL}`).set(userCredentials);
    })
    .then(() => {
        const newUser = {
            email: MAILER.EMAIL,
            userId: adminId,
            role: ROLE.ADMIN
        }

        return db.doc(`/${COLLECTION.USER}/${MAILER.EMAIL}`).set(newUser);
    })
    .then(() => {
        console.log('Admin initialized successfully!');
    })
    .catch((err) => {
        console.error(err);
    });
}

exports.deleteCeo = (req, res) => {
    const document = db.doc(`/${COLLECTION.CEO}/${req.params.ceoEmail}`);
    let companyName;
    let employeeEmails = [];
    let emails = [];
    let promises = [];

    document.get()
        .then(doc => {
            if(!doc.exists) {
                return res.status(404).json({ error: 'Ceo not found.' });
            }

            companyName = doc.data().companyName;

            return document.delete();
        })
        .then(() => {
            const batch = db.batch();
    
            return db.collection(COLLECTION.EMPLOYEE).where('companyName', '==', companyName)
                .get()
                .then(data => {
                    data.forEach(doc => {
                        employeeEmails.push(doc.data().email);
                        batch.delete(db.doc(`/${COLLECTION.EMPLOYEE}/${doc.data().email}`));
                    })
    
                    return batch.commit();
                })
        })
        .then(() => {
            emails = [...employeeEmails, req.params.ceoEmail];
            emails.forEach((email) => {
                promises.push(
                    admin.auth().getUserByEmail(email)
                );
            })

            return Promise.all(promises);
        })
        .then((responses) => {
            responses.forEach((response, index) => {
                admin.auth().deleteUser(response.uid);
            });
        })
        .then(() => {
            res.json({ employeeEmails })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
}