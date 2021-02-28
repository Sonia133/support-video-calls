const { db } = require('../util/functions/admin');
const { COLLECTION, MAILER } = require('../util/constants/constant');

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
        console.log('Admin initialized successfully!');
    })
    .catch((err) => {
        console.error(err);
    });
}

exports.deleteCeo = (req, res) => {
    const document = db.doc(`/${COLLECTION.CEO}/${req.params.ceoEmail}`);
    let companyName;

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
                        batch.delete(db.doc(`/${COLLECTION.EMPLOYEE}/${doc.data().email}`));
                    })
    
                    return batch.commit();
                })
        })
        .then(() => {
            res.json({ message: 'Ceo deleted successfully!' })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
}