const admin = require('firebase-admin');
const logger = require('./logger');

const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const audiences = db.collection('audiences');

const addAudiences = data => {
    return audiences.add(data);
};

// const setCartState = (isOpen) => {
//     return cartOpener.set({cart: isOpen}).catch((err) => {
//         logger.error(`Error setCartState to ${isOpen}: ${err}`);
//         throw err;
//     });
// };

// const orderObserver = order.onSnapshot(querySnapshot => {
//     const size = querySnapshot.size;
//     logger.info(`Received order query snapshot of size ${size}`);
//     if (lastOrderSize === -1) {
//         lastOrderSize = size;
//         return;
//     }
//     if (size > lastOrderSize) {

//         logger.info('Opening cart ...');
//         setCartState(true)
//             .then(() => {
//                 setTimeout(() => {
//                     logger.info('Closing cart ...');
//                     setCartState(false);
//                     logger.info('Resetting cart ...');
//                     lastSize = 0;
//                 }, openOrderDelay);
//             });
//     }
//     lastSize = size;
// }, err => {
//     console.log(`Encountered error: ${err}`);
// });

module.exports = {
    db,
    audiences,
    addAudiences,
};
