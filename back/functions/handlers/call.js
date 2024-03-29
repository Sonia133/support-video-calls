const { db } = require("../util/functions/admin");
const { COLLECTION, ROLE } = require("../util/constants/constant");
const { chooseEmployee } = require("../util/functions/chooseEmployee");

var moment = require('moment');

const configTwilio = require('../util/constants/configTwilio'); 
const accountSid = configTwilio.twilio.accountSid;
const authToken = configTwilio.twilio.authToken;
const client = require('twilio')(accountSid, authToken);

var Twilio = require('twilio');
const clientDisconnect = new Twilio(configTwilio.twilio.apiKey, configTwilio.twilio.apiSecret, {accountSid: accountSid});

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
    .catch((err) => {
      console.log(err.code)
      return res.status(500).json({ error: err.code });
  });
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
      .catch((err) => {
        console.log(err.code)
        return res.status(500).json({ error: err.code });
      });
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
            .catch((err) => {
              console.log(err.code)
              return res.status(500).json({ error: err.code });
            });
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
  console.log('find')
  const roomName = req.body.roomName;
  const companyName = req.params.companyName;
  let employees = [];

  const date = new Date();
  const hour = date.getHours();
  const day = date.getDay();

  let chosenEmployee;

  if (5 < day) {
    return res.status(404).json({ hours: "We are sorry, but our hours are done for today. Please come back tomorrow. Have a good day!" });
  }

  db.collection(COLLECTION.EMPLOYEE)
    .where("companyName", "==", companyName)
    .get()
    .then((data) => {
      console.log('wtfffffffffffffffff')
      let endingHours = false;
      let promises = [];
        
      data.forEach((doc) => {
        if (doc.data().boarded === true) {
          let schedule = doc.data().schedule[day - 1].split("-");
          if (schedule[0] <= hour && hour <= schedule[1]) {
            endingHours = true;
            if (doc.data().available === true) {
              employees.push(doc.data());

              promises.push(
                db
                  .collection(COLLECTION.CALL)
                  .where("employeeEmail", "==", doc.data().email)
                  .orderBy("createdAt")
                  .get()
              );
            }
          }
        }
      });

      if (endingHours === false) {
        console.log('second')
        return res.status(404).json({ hours: "We are sorry, but our hours are done for today! Please come back tomorrow. Have a good day!" });
      }

      return Promise.all(promises);
    })
    .then((responses) => {
      console.log('third')
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

      console.log(employees)
      if (employees.length == 0) {
        return res.status(404).json({ error: "Employee not found" });
      }

      chosenEmployee = chooseEmployee(employees);
      console.log(chosenEmployee)
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
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

exports.addCallDetails = (req, res) => {
  employeeEmail = req.body.employeeEmail;
  companyName = req.body.companyName;
  remoteParticipant = req.body.remoteParticipant;
  localParticipant = req.body.localParticipant;

  let roomName;
  let duration, createdAt;

  db.doc(`${COLLECTION.EMPLOYEE}/${employeeEmail}`).get()
  .then(doc => {
    roomName = doc.data().currentCallId;
    return client.video.rooms.list({uniqueName: roomName, limit: 1});
  })
  .then(rooms => {
    const room = rooms[0];

    end = new Date(room.dateUpdated);
    start = new Date(room.dateCreated);
    duration = end - start;
    if (duration > 60e3) {
      duration = duration / 60e3;
    } else {
      duration = (1 / 60) * (duration / 1e3);
    }
    createdAt = room.dateCreated;

    db.doc(`/${COLLECTION.CALL}/${roomName}`)
    .set({
      employeeEmail,
      createdAt,
      companyName,
      duration,
      feedback: 0,
      comments: '',
    })
    .then(() => {
      return db.doc(`${COLLECTION.EMPLOYEE}/${employeeEmail}`).update({
        available: true,
        currentCallId: ''
      });
    })
    .then(() => {
      return clientDisconnect.video.rooms(roomName)
        .participants(remoteParticipant)
        .update({status: 'disconnected'})
    })
    .then(() => {
      return clientDisconnect.video.rooms(roomName)
        .participants(localParticipant)
        .update({status: 'disconnected'})
    })
    .then(() => {
      return res.status(200).json({ message: "Call updated successfully." });
    })
    .catch((err) => {
      console.log(err.code)
      return res.status(500).json({ error: err.code });
    });
  });
};

exports.addFeedback = (req, res) => {
  const { roomName, feedback, comments, call } = req.body;

  let ratedCalls, feedbackEmployee;
  let employeeEmail = "";

  db.doc(`/${COLLECTION.CALL}/${roomName}`).get()
  .then((doc) => {
    if (doc.exists) {
      employeeEmail = doc.data().employeeEmail;

      return db.doc(`/${COLLECTION.CALL}/${roomName}`).update({
        feedback,
        comments
      });
    } else {
      return db.doc(`/${COLLECTION.CALL}/${roomName}`)
      .set({
        employeeEmail: "",
        createdAt: new Date(),
        companyName: call.companyName,
        duration: -1,
        feedback,
        comments
      })
    }
  })
  .then(() => {
    return db.doc(`${COLLECTION.EMPLOYEE}/${employeeEmail}`).get()
  })
  .then((doc) => {
    if (doc.exists) {
      ratedCalls = doc.data().ratedCalls;
      feedbackEmployee = doc.data().feedback;

      if (feedback > 0) {
        feedbackEmployee = ((feedbackEmployee * ratedCalls) + feedback) / (ratedCalls + 1);
        ratedCalls += 1;
      }

      return db.doc(`${COLLECTION.EMPLOYEE}/${employeeEmail}`).update({
        available: true,
        currentCallId: '',
        feedback: feedbackEmployee,
        ratedCalls
      });
      
    } else {
      res.status(200).json({ message: 'Feedback sent successfully!' });
    }
  })
  .then(() => {
    res.status(200).json({ message: 'Feedback sent successfully!' });
  })
  .catch((err) => {
    console.log(err.code)
    return res.status(500).json({ error: err.code });
  });
}

exports.getFeedbackPerEmployee = (req, res) => {
  const companyName = req.params.companyName;
  const employeeEmail = req.params.employeeEmail;

  const calls = db.collection(COLLECTION.CALL).where("employeeEmail", "==", employeeEmail);

  let employeeData = {};

  if (req.user.role === ROLE.ADMIN) {
      employee.get()
      .then(doc => {
          if (!doc.exists) {
              return res.status(404).json({ error: 'Employee not found!'} );
          }
  
          return calls.get();
      })
      .then(data => {
        data.forEach(doc => {
          if (doc.data().feedback > 0) {
            let day = moment(new Date(doc.data().createdAt._seconds * 1000)).format('L');

            if (!employeeData.hasOwnProperty(day)) {
              employeeData[day] = {
                callsNumber: 0,
                callsFeedback: 0
              };
            }
            employeeData[day].callsNumber += 1;
            employeeData[day].callsFeedback = doc.data().feedback;
          }
        })

          return res.json(employeeData);
        })
        .catch((err) => {
          console.log(err.code)
          return res.status(500).json({ error: err.code });
        });
  } else if (req.user.role === ROLE.CEO) {
      db.doc(`/${req.user.role}/${req.user.email}`).get()
      .then(doc => {
          if (doc.data().companyName === companyName) {
              employee.get()
              .then(doc => {
                  if (!doc.exists) {
                      return res.status(404).json({ error: 'Employee not found!'} );
                  }
          
                  return calls.get();
              })
              .then(data => {
                data.forEach(doc => {
                  if (doc.data().feedback > 0) {
                    let day = moment(new Date(doc.data().createdAt._seconds * 1000)).format('L');
    
                    if (!employeeData.hasOwnProperty(day)) {
                      employeeData[day] = {
                        callsNumber: 0,
                        callsFeedback: 0
                      };
                    }
                    employeeData[day].callsNumber += 1;
                    employeeData[day].callsFeedback = doc.data().feedback;
                  }
                })
    
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
  } else if (req.user.role === ROLE.EMPLOYEE && req.user.email === employeeEmail) {
      calls.get()
      .then(data => {
        data.forEach(doc => {
          if (doc.data().feedback > 0) {
            let day = moment(new Date(doc.data().createdAt._seconds * 1000)).format('L');

            if (!employeeData.hasOwnProperty(day)) {
              employeeData[day] = {
                callsNumber: 0,
                callsFeedback: 0
              };
            }
            employeeData[day].callsNumber += 1;
            employeeData[day].callsFeedback = doc.data().feedback;
          }
        })

        return res.json(employeeData);
      })
      .catch((err) => {
        console.log(err.code)
        return res.status(500).json({ error: err.code });
      });
  } else {
      return res.status(403).json({ error: 'Unauthorized'});
  }
}

exports.getFeedbackPerCompany = (req, res) => {
  const companyName = req.params.companyName;

  const calls = db.collection(COLLECTION.CALL).where("companyName", "==", companyName);

  let companyData = {};

  if (req.user.role === ROLE.ADMIN) {
      calls.get()
      .then(data => {
        data.forEach(doc => {
          if (doc.data().feedback > 0) {
            let day = moment(new Date(doc.data().createdAt._seconds * 1000)).format('L');

            if (!companyData.hasOwnProperty(day)) {
              companyData[day] = {
                callsNumber: 0,
                callsFeedback: 0
              };
            }
            companyData[day].callsNumber += 1;
            companyData[day].callsFeedback = doc.data().feedback;
          }
        })

        return res.json(companyData);
      })
      .catch((err) => {
        console.log(err.code)
        return res.status(500).json({ error: err.code });
      });
  } else if (req.user.role === ROLE.CEO) {
      db.doc(`/${req.user.role}/${req.user.email}`).get()
      .then(doc => {
          if (doc.data().companyName === companyName) {
              calls.get()
              .then(data => {
                  data.forEach(doc => {
                      if (doc.data().feedback > 0) {
                        let day = moment(new Date(doc.data().createdAt._seconds * 1000)).format('L');

                        if (!companyData.hasOwnProperty(day)) {
                          companyData[day] = {
                            callsNumber: 0,
                            callsFeedback: 0
                          };
                        }
                        companyData[day].callsNumber += 1;
                        companyData[day].callsFeedback = doc.data().feedback;
                      }
                  })

                  return res.json(companyData);
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

exports.getFeedback = (req, res) => {
  const calls = db.collection(COLLECTION.CALL);

  let allData = {};

  calls.get()
  .then(data => {
    data.forEach(doc => {
      if (doc.data().feedback > 0) {
        let day = moment(new Date(doc.data().createdAt._seconds * 1000)).format('L');

        if (!allData.hasOwnProperty(day)) {
          allData[day] = {
            callsNumber: 0,
            callsFeedback: 0
          };
        }
        allData[day].callsNumber += 1;
        allData[day].callsFeedback = doc.data().feedback;
      }
    })

    return res.json(allData);
  })
  .catch((err) => {
    console.log(err.code)
    return res.status(500).json({ error: err.code });
  });
}

