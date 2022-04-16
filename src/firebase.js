import firebase from 'firebase/app';
import 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyCFO7umBYXIwjJwrGKANCk6sj8PYsuO1ZA",
    authDomain: "crud-3-firestore-5a568.firebaseapp.com",
    projectId: "crud-3-firestore-5a568",
    storageBucket: "crud-3-firestore-5a568.appspot.com",
    messagingSenderId: "296636975087",
    appId: "1:296636975087:web:0039eb70e1217faca0181a"
  };
  
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

export {firebase}