// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
  apiKey: 'AIzaSyDivpbTgFSsLjy8V8ghdQ38WumhGGv0nyQ',
  authDomain: 'expence-tracker-1bd9c.firebaseapp.com',
  projectId: 'expence-tracker-1bd9c',
  storageBucket: 'expence-tracker-1bd9c.firebasestorage.app',
  messagingSenderId: '696461135980',
  appId: '1:696461135980:web:6ea92459372213c9440849',
  // measurementId: 'G-6L675LP7BS'
}



const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

export { app, auth };

