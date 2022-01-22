import Head from "next/head"
import styled from "styled-components"
import { Button } from "@mui/material";
import { auth, db, provider } from "../firebase"
import { signInWithPopup } from "firebase/auth"
import { useEffect, useContext } from "react"
import AppContext from "../AppContext";

function Login() {

    const [user, setUser] = useContext(AppContext)
    const signIn = async () => {
        await signInWithPopup(auth, provider)
            .catch(alert)
        setUser(auth?.currentUser)
    }

    // useEffect(() => {
    //     if (user) {
    //         console.log("updating db")
    //         addDoc(collection(db, "users"), {
    //             email: user.email,
    //             lastSeen: serverTimestamp(),
    //             photoURL: user.photoURL,
    //         })
    //         { merge: true }
    //     }
    // }, [user])

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" />
                <Button onClick={signIn} variant="outlined">SIGN IN WITH GOOGLE</Button>
            </LoginContainer>
        </Container>
    )
}

export default Login

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 100px;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7);
`

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`