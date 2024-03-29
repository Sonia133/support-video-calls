const { admin, db } = require('../admin'); 
const { COLLECTION } = require('../../constants/constant');

module.exports = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found.')
        return res.status(403).json({ error: 'Unauthorized'});
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            return db
                .collection(COLLECTION.USER)
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            if (data.docs.length > 0) {
                req.user.email = data.docs[0].data().email;
                req.user.imageUrl = data.docs[0].data().imageUrl;
                req.user.role = data.docs[0].data().role;
                
                return next();
            }
            
            return res.status(403).json({ error: 'Unauthorized'});
        })
        .catch(err => {
            console.error('Error while veryfying token.', err)
            return res.status(403).json(err);
        });
};