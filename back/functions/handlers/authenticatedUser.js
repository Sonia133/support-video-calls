const { admin, db } = require("../util/functions/admin");
const config = require("../util/constants/config");
const { COLLECTION } = require("../util/constants/constant");

exports.getAuthenticatedUser = (req, res) => {
  const email = req.user.email;
  let resUser = {};

  db.doc(`${COLLECTION.USER}/${email}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const role = doc.data().role;
        if ([COLLECTION.EMPLOYEE, COLLECTION.CEO].includes(role)) {
          resUser = doc.data();
          return db.doc(`${role}/${email}`).get();
        } else {
          return res.json(doc.data());
        }
      }
    })
    .then((doc) => res.status(200).json({ ...resUser, ...doc.data() }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageTeBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/type" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted. " });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${Math.round(
      Math.random() * 100000000
    )}.${imageExtension}`;

    const filepath = path.join(os.tmpdir(), imageFileName);
    imageTeBeUploaded = {
      filepath,
      mimetype,
    };

    file.pipe(fs.createWriteStream(filepath));
  });

  let imageUrl;

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageTeBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageTeBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db
          .doc(`/${req.user.role}/${req.user.email}`)
          .update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfully!" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};
