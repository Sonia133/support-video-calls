const { db, firebase, admin } = require('../util/functions/admin');
const config = require('../util/constants/config');
const bcrypt = require('bcrypt');

const { validateLoginData, validateEmail, validatePassword, validateNewPassword } = require('../util/functions/validators');

const { COLLECTION, ROLE } = require('../util/constants/constant');
const { onboardMail } = require('../util/functions/mailer');

exports.requestAccount = (req, res) => {
    const newUserRequest = {
        email: req.body.email,
        role: req.body.role,
        companyName: req.body.companyName
    };

    let token = bcrypt.hashSync(req.body.email, 10);

    const { valid, errors } = validateEmail(newUserRequest.email);
    if (!valid) return res.status(400).json(errors);

    db.collection(`/${newUserRequest.role}`).get()
        .then((data) => {
            let found = 0;
            data.forEach((document) => {
                if (document.data().email === newUserRequest.email) {
                    found = 1;
                    return res.status(400).json({ error: 'You have already signed up.' });
                } 
            })

            if (found === 0) {
                return db.collection(`/${COLLECTION.ACCOUNT_REQUEST}`).get();
            }
        })
        .then((data) => {
            let found = 0;
            data.forEach((document) => {
                if (document.data().email === newUserRequest.email) {
                    found = 1;
                    return res.status(400).json({ error: 'It was already sent a request from this email. Please check your inbox.' });
                } 
            })

            if (found === 0) {
                token = token.split("/").join("");
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
            console.log(err)
            return res.status(500).json({ error: 'Something went wrong. Please try again!' });
        });
};

exports.validateToken = (req, res) => {
    const token = req.params.token;

    db.doc(`/${COLLECTION.ACCOUNT_REQUEST}/${token}`)
    .get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ inexistent: 'Page not found!'} );
        } else {
            return res.status(201).json({ token });
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
    let token, userId, role, email, companyName;

    console.log(emailToken)
    db.doc(`/${COLLECTION.ACCOUNT_REQUEST}/${emailToken}`)
    .get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Page not found!'} );
        } else {
            email = doc.data().email;
            role = doc.data().role;
            companyName = doc.data().companyName;

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
                companyName: companyName,
                generatedLink: '',
                ceoId: userId
            }
        } else {
            newClient = {
                email: email,
                imageUrl: imageUrl,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                companyName: companyName,
                schedule: [], 
                available: false,
                boarded: false,
                currentCallId: '',
                employeeId: userId,
                ratedCalls: 0,
                feedback: 0
            }
        }

        return db.doc(`/${role}/${newClient.email}`).set(newClient);
    })
    .then(() => {
        const newUser = {
            userId,
            email,
            role
        };

        return db.doc(`/${COLLECTION.USER}/${newUser.email}`).set(newUser);
    })
    .then(() => {
        return res.status(201).json({ token });
    })
    .catch(err => {
        console.log(err)
        console.log(err.code)
        return res.status(500).json({ error: err.code });
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
            console.log(err.code)
            if (err.code === "auth/user-not-found") {
                return res.status(403).json({ error: 'This email does not exist.'})
            }
            if (err.code === "auth/wrong-password") {
                return res.status(403).json({ error: 'Wrong password.'})
            }
            return res.status(500).json({ error: err.code })
        });
};

exports.changePassword = (req, res) => {
    const changePasswordRequest = {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword
    };

    const { valid, errors } = validateNewPassword(changePasswordRequest.oldPassword, changePasswordRequest.newPassword);
    if (!valid) return res.status(400).json(errors);

    console.log(req.user.email)
    admin.auth().getUserByEmail(req.user.email)
    .then((user) => {
        return admin.auth().updateUser(user.uid, {
            password: changePasswordRequest.newPassword
        })        
    })
    .then(() => {
        res.status(200).json({ message: 'Password successfully changed.' });
    })
    .catch((err) => {
        console.log(err)
        console.log(err.code)
        return res.status(500).json({ error: err.code });
    });
}

exports.forgotPassword = (req, res) => {
    const auth = firebase.auth();
    const email = req.body.email;

    const { valid, errors } = validateEmail(email);
    if (!valid) return res.status(400).json(errors);

    auth.sendPasswordResetEmail(email)
    .then(() => {
        res.status(200).json({ message: 'Email for password update successfully changed.' });
    })
    .catch((err) => {
        console.log(err.code)
        if (err.code === "auth/invalid-email") {
            return res.status(403).json({ error: 'Invalid email.'})
        }
        if (err.code === "auth/user-not-found") {
            return res.status(403).json({ error: 'User not found.'})
        }
        return res.status(500).json({ error: err.code })
    })
}
