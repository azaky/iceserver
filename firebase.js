const admin = require('firebase-admin');
const logger = require('./logger');

const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const audiences = db.collection('audiences');

const addAudiences = (id, data) => {
    return audiences.doc(id).set(data)
        .then(res => {
            const id = res._referencePath.segments[1];
            return id;
        });
};

const rsvps = db.collection('rsvps');

const addRsvps = data => {
    return rsvps.add(data)
        .then(res => {
            const id = res._referencePath.segments[1];
            return id;
        });
};

const polls = db.collection('pollAnswers');

const addPoll = (id, answer) => {
    return polls.doc(id).set({ answer });
};

const interests = db.collection('interests');

const addInterests = (id, options) => {
    return interests.doc(id).set({ options });
}

const colors = db.collection('colors');

const getColor = (id) => {
    return colors.doc(id).get()
        .then(doc => {
            if (!doc.exists) {
                return false;
            }
            return doc.data().color;
        });
}

module.exports = {
    db,
    audiences,
    addAudiences,
    addPoll,
    addInterests,
    getColor,
    addRsvps,
};

