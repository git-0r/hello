import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// import {getApps} from "firebase"
// const Firebase_API_KEY = process.env.API_KEY
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "hello-71515.firebaseapp.com",
    projectId: "hello-71515",
    storageBucket: "hello-71515.appspot.com",
    messagingSenderId: "31510362684",
    appId: "1:31510362684:web:284bd37da9c2c1e7dde139"
};

const app = !getApps.length
    ? initializeApp(firebaseConfig)
    : getApp()

const db = getFirestore()
const auth = getAuth()
const provider = new GoogleAuthProvider()

export { db, auth, provider }