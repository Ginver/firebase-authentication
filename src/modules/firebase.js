// import and init firebase
import firebase from 'firebase';
import 'firebase/firestore';

const app = firebase.initializeApp({
    apiKey: "AIzaSyBqX3Ux2E5BamL01Vhqz6_Muqc6ZvDiYrI",
    authDomain: "food-operator.firebaseapp.com",
    projectId: "food-operator",
    storageBucket: "food-operator.appspot.com",
    messagingSenderId: "570748431927",
    appId: "1:570748431927:web:3e0ff549fe1e6335c159b2"
});



export default app;