const { db, admin } = require('../util/functions/admin');
const { COLLECTION } = require('../util/constants/constant');

exports.deleteEmployee = (req, res) => {
    const document = db.doc(`/${COLLECTION.EMPLOYEE}/${req.params.employeeEmail}`);
    const companyName = req.user.companyName;

    document.get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Employee not found.' });
            }
            
            if (doc.data().companyName !== companyName) {
                return res.status(403).json({ error: 'Unauthorized' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            return admin.auth().getUserByEmail(req.params.employeeEmail);
        })
        .then((user) => {
            return admin.auth().deleteUser(user.uid);
        })
        .then(() => {
            res.json({ message: 'Employee deleted successfully!' })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
}

exports.getCeo = (req, res) => {
    const ceoEmail = req.params.ceoEmail;

    db.doc(`${COLLECTION.CEO}/${ceoEmail}`)
    .get()
    .then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Ceo not found!'} );
        }

        ceoData = doc.data();
        ceoData.ceoId = doc.id; 
        
        return res.json(ceoData);
    })
    .catch((err) => {
        console.log(err.code)
        return res.status(500).json({ error: err.code });
    });
}

exports.getCeos = (req, res) => {
    db.collection(COLLECTION.CEO)
    .get()
    .then(data => {
        let ceos = [];
        data.forEach(document => {
            ceos.push({
                ...document.data(),
                ceoId: document.id
            }); 
        });
        return res.json(ceos);
    })
    .catch((err) => {
        console.log(err.code)
        return res.status(500).json({ error: err.code });
    });
}