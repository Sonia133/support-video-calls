const { db, firebase } = require('../util/functions/admin');
const config = require('../util/constants/config');

const emailEncoder = require('email-encoder');

const { validateEmail, validatePassword, validateNewPassword } = require('../util/functions/validators');

const { COLLECTION, ROLE } = require('../util/constants/constant');
const { onboardMail } = require('../util/functions/mailer');

exports.requestAccount = (req, res) => {
    const newUserRequest = {
        email: req.body.email,
        role: req.body.role,
        companyName: req.body.companyName
    };

    const token = emailEncoder(req.body.email);

    const { valid, errors } = validateEmail(newUserRequest.email);
    if (!valid) return res.status(400).json(errors);

    db.doc(`/${COLLECTION.ACCOUNT_REQUEST}/${newUserRequest.token}`).get()
        .then(doc => {
            if(doc.exists) {
                return res.status(400).json({ email: 'It was already sent a request from this email. Please check your inbox.' });
            } else {
                return db.doc(`/${COLLECTION.ACCOUNT_REQUEST}/${token}`).set(newUserRequest);
            }
        })
        .then(() => {
            const inviteLink = `http://localhost:3000/invite/${token}`;
            onboardMail(newUserRequest.email, inviteLink);
        })
        .then(() => {
            res.status(200).json({ message: 'Request successfully sent.' });
        })
        .catch((err) => {
            return res.status(500).json({ general: 'Something went wrong. Please try again!' });
        });
};

exports.validateToken = (req, res) => {
    const token = req.params.token;

    db.doc(`/${COLLECTION.ACCOUNT_REQUEST}/${token}`)
    .get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Page not found!'} );
        } else {
            return res.status(200).json({ message: 'Validation completed successfully.' });
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code });
    })
};

exports.signup = (req, res) => {
    const emailToken = req.params.token;

    const newUser = {
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    };

    const { valid, errors } = validatePassword(newUser);
    if (!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png';
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`;
    let token, userId, role;

    db.doc(`/${COLLECTION.ACCOUNT_REQUEST}/${emailToken}`)
    .get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Page not found!'} );
        } else {
            const email = doc.data().email;
            role = doc.data().role;

            return firebase.auth().createUserWithEmailAndPassword(email, newUser.password);
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idToken => {
        token = idToken;

        return db.doc(`/${COLLECTION.ACCOUNT_REQUEST}/${emailToken}`).delete();
    })
    .then(() => {
        let newClient;

        if (role === ROLE.CEO) {
            newClient = {
                email: email,
                imageUrl: imageUrl,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                companyName: req.body.companyName,
                generatedLink: '',
                ceoId: userId
            }
        } else {
            newClient = {
                email: email,
                imageUrl: imageUrl,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                companyName: req.body.companyName,
                schedule: [], 
                available: false,
                employeeId: userId
            }
        }

        return db.doc(`/${role}/${newClient.email}`).set(newClient);
    })
    .then(() => {
        return res.status(201).json({ token });
    })
    .catch(err => {
        return res.status(500).json({ general: 'Something went wrong. Please try again!' });
    })
}

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err);
            if (err.code === "auth/user-not-found") {
                return res.status(403).json({ general: 'This email does not exist.'})
            }
            if (err.code === "auth/wrong-password") {
                return res.status(403).json({ general: 'Wrong password.'})
            }
            return res.status(500).json({ error: err.code })
        });
};

exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });

    let imageFileName;
    let imageTeBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        
        if (mimetype !== 'image/type' && mimetype !== 'image/png') {
            return res.status(400).json({ error: 'Wrong file type submitted. '});
        }
        
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${Math.round(Math.random() * 100000000)}.${imageExtension}`;

        const filepath = path.join(os.tmpdir(), imageFileName);
        imageTeBeUploaded = {
            filepath,
            mimetype
        };

        file.pipe(fs.createWriteStream(filepath));
    })

    let imageUrl;

    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageTeBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageTeBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/${req.user.role}/${req.user.email}`).update({ imageUrl });
        })
        .then(() => {
            return res.json({ message: 'Image uploaded successfully!' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
    });
    busboy.end(req.rawBody);
}; 

exports.changePassword = (req, res) => {
    const changePasswordRequest = {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword
    };

    const { valid, errors } = validateNewPassword(changePasswordRequest.oldPassword, changePasswordRequest.newPassword);
    if (!valid) return res.status(400).json(errors);

    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider(user.email, changePasswordRequest.oldPassword);

    user.reauthenticateWithCredential(credential)
    .then(() => {
        return user.updatePassword(changePasswordRequest.newPassword);        
    })
    .then(() => {
        res.status(200).json({ message: 'Password successfully changed.' });
    }).catch(() => {
        return res.status(500).json({ general: 'Something went wrong. Please try again!' });
    });
}

exports.forgotPassword = (req, res) => {
    const auth = firebase.auth();
    const email = req.body.email;

    const { valid, errors } = validateEmail(email);
    if (!valid) return res.status(400).json(errors);

    auth.sendPasswordResetEmail(email)
    .then(() => {
        res.status(200).json({ message: 'Password successfully changed.' });
    })
    .catch((err) => {
        if (err.code === "auth/invalid-email") {
            return res.status(403).json({ general: 'Invalid email.'})
        }
        if (err.code === "auth/user-not-found") {
            return res.status(403).json({ general: 'User not found.'})
        }
        return res.status(500).json({ error: err.code })
    })
}
