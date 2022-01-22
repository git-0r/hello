import '../styles/globals.css'
import { auth, db } from "../firebase"
import Login from './login'
import { useState, useEffect } from "react"
import { doc, setDoc } from "firebase/firestore"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import AppContext from '../AppContext'


function MyApp({ Component, pageProps }) {

  const [user, setUser] = useState(() => auth.currentUser)

  useEffect(() => {
    if (user) {
      setDoc(doc(db, "users", user.uid), {
        email: user.email,
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL,
      },
        { merge: true }
      )
    }
  }, [user])

  return (
    < AppContext.Provider
      value={[
        user, setUser
      ]}
    >
      {!auth.currentUser ? <Login /> : <Component {...pageProps} />}
      {/* if (!auth.currentUser) return <Login />
      return <Component {...pageProps} /> */}
    </AppContext.Provider >
  )
}

export default MyApp
