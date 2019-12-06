import React from 'react';
import Firebase from './firebase';

const FirebaseContext = React.createContext<Firebase>({} as Firebase);

export default Firebase;
export { FirebaseContext };
