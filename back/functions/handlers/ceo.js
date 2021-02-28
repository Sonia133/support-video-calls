const { db } = require('../util/functions/admin');
const { COLLECTION } = require('../util/constants/constant');

exports.deleteEmployee = (req, res) => {
    const document = db.doc(`/${COLLECTION.EMPLOYEE}/${req.params.employeeEmail}`);
    let companyName;

    document.get()
        .then(doc => {
            if(!doc.exists) {
                return res.status(404).json({ error: 'Employee not found.' });
            }

            companyName = doc.data().companyName;

            return db.doc(`/${COLLECTION.CEO}/${req.user.email}`).get();
        })
        .then(doc => {
            if(doc.data().companyName !== companyName) {
                return res.status(403).json({ error: 'Unauthorized' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: 'Employee deleted successfully!' })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
}