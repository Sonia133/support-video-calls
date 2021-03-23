const { db } = require("../util/functions/admin");
const { COLLECTION, ROLE } = require("../util/constants/constant");
const { chooseEmployee } = require("../util/functions/chooseEmployee");

const configTwilio = require('../util/constants/configTwilio'); 
const accountSid = configTwilio.twilio.accountSid;
const authToken = configTwilio.twilio.authToken;
const client = require('twilio')(accountSid, authToken);

exports.getCalls = (req, res) => {
  db.collection(COLLECTION.CALL)
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let calls = [];
      data.forEach((document) => {
        calls.push({
          ...document.data(),
          callId: document.id,
        });
      });
      return res.json(calls);
    })
    .catch((err) => console.error(err));
};

exports.getCallsPerCompany = (req, res) => {
  const companyName = req.params.companyName;
  const calls = db
    .collection(COLLECTION.CALL)
    .where("companyName", "==", companyName)
    .orderBy("employeeEmail")
    .orderBy("createdAt", "desc");

  if (req.user.role === ROLE.ADMIN) {
    calls
      .get()
      .then((data) => {
        let calls = [];
        data.forEach((document) => {
          calls.push({
            ...document.data(),
            callId: document.id,
          });
        });
        return res.json(calls);
      })
      .catch((err) => console.error(err));
  } else if (req.user.role === ROLE.CEO) {
    db.doc(`/${COLLECTION.CEO}/${req.user.email}`)
      .get()
      .then((doc) => {
        if (doc.data().companyName === companyName) {
          calls
            .get()
            .then((data) => {
              let calls = [];
              data.forEach((document) => {
                calls.push({
                  ...document.data(),
                  callId: document.id,
                });
              });
              return res.json(calls);
            })
            .catch((err) => console.error(err));
        } else {
          return res.status(403).json({ error: "Unauthorized" });
        }
      });
  } else if (req.user.role === ROLE.EMPLOYEE) {
    return res.status(403).json({ error: "Unauthorized" });
  }
};

exports.getCallsPerEmployee = (req, res) => {
  const employeeEmail = req.params.employeeEmail;
  const companyName = req.params.companyName;

  const calls = db
    .collection(COLLECTION.CALL)
    .where("employeeEmail", "==", employeeEmail)
    .orderBy("createdAt", "desc");

  if (req.user.role === ROLE.ADMIN) {
    calls
      .get()
      .then((data) => {
        let calls = [];
        data.forEach((document) => {
          calls.push({
            ...document.data(),
            callId: document.id,
          });
        });
        return res.json(calls);
      })
      .catch((err) => console.error(err));
  } else if (req.user.role === ROLE.CEO) {
    db.doc(`/${COLLECTION.CEO}/${req.user.email}`)
      .get()
      .then((doc) => {
        if (doc.data().companyName === companyName) {
          calls
            .get()
            .then((data) => {
              let calls = [];
              data.forEach((document) => {
                calls.push({
                  ...document.data(),
                  callId: document.id,
                });
              });
              return res.json(calls);
            })
            .catch((err) => console.error(err));
        } else {
          return res.status(403).json({ error: "Unauthorized" });
        }
      });
  } else if (req.user.role === ROLE.EMPLOYEE) {
    db.doc(`/${COLLECTION.EMPLOYEE}/${req.user.email}`)
      .get()
      .then((doc) => {
        if (doc.data().email === employeeEmail) {
          calls
            .get()
            .then((data) => {
              let calls = [];
              data.forEach((document) => {
                calls.push({
                  ...document.data(),
                  callId: document.id,
                });
              });
              return res.json(calls);
            })
            .catch((err) => console.error(err));
        } else {
          return res.status(403).json({ error: "Unauthorized" });
        }
      });
  }
};

exports.findEmployee = (req, res) => {
  const roomName = req.body.roomName;
  const companyName = req.params.companyName;
  let employees = [];

  const date = new Date();
  const hour = date.getHours();
  const day = date.getDay();

  let chosenEmployee;

  db.collection(COLLECTION.EMPLOYEE)
    .where("companyName", "==", companyName)
    .where("available", "==", true)
    .get()
    .then((data) => {
      let promises = [];
        
      data.forEach((doc) => {
        let schedule = doc.data().schedule[day - 1].split("-");
        if (schedule[0] <= hour && hour <= schedule[1]) {
          employees.push(doc.data());

          promises.push(
            db
              .collection(COLLECTION.CALL)
              .where("employeeEmail", "==", doc.data().email)
              .orderBy("createdAt")
              .get()
          );
        }
      });
      return Promise.all(promises);
    })
    .then((responses) => {
      responses.forEach((response, index) => {
        if (Array.isArray(response.data)) {
          response.data.forEach((call) => {
            let callDate = call.data().createdAt;
            let duration = call.data().duration;

            employees[index].lastWorked = new Date(
              callDate.getTime() + duration * 60000
            );
          });
        }
      });
      if (employees.length == 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      chosenEmployee = chooseEmployee(employees);
      return db
        .doc(`${COLLECTION.EMPLOYEE}/${chosenEmployee.email}`)
        .update({
          available: false,
          currentCallId: roomName
        });
    })
    .then(() => {
      return res.status(200).json(chosenEmployee);
    })
    .catch((err) => console.error(err));
};

exports.addCallDetails = (req, res) => {
  // feedback = req.body.feedback;
  // comments = req.body.comments;
  employeeEmail = req.body.employeeEmail;
  companyName = req.body.companyName;
  roomName = req.body.roomName;

  let duration, createdAt;
  client.video.rooms.list({uniqueName: roomName, limit: 1})
  .then(rooms => {
    const room = rooms[0];
    duration = room.duration;
    createdAt = room.dateCreated;

    db.doc(COLLECTION.CALL)
    .add({
      employeeEmail,
      createdAt,
      companyName,
      duration,
      feedback: '',
      comments: [],
    })
    .then(() => {
      return db.doc(`${COLLECTION.EMPLOYEE}/${employeeEmail}`).update({
        available: true,
      });
    })
    .then(() => {
      return res.status(200).json({ message: "Call updated successfully." });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ general: "Something went wrong. Please try again!" });
    });
  });
};
