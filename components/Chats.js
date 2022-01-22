import styled from "styled-components"
import { useContext, useState, useEffect } from "react"
import AppContext from "../AppContext"
import { getDocs, collection, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { Avatar } from "@mui/material"
import { useRouter } from "next/router"

function Chats({ id, users }) {
    const [user, setUser] = useContext(AppContext)
    const [recipient, setRecipient] = useState("")
    const userRef = collection(db, "users")
    const router = useRouter()

    const recipientEmail = users?.filter(userToFilter => userToFilter !== user?.email);

    const q = query(
        userRef,
        where("email", "==", users?.filter(userToFilter => userToFilter !== user?.email)[0])
    )

    useEffect(() => {
        async function updateRecipient() {
            const data = await getDocs(q)
                .then(data => setRecipient(data?.docs[0]?.data()))
        }
        updateRecipient()
    }, [])
    // const recipient = getDocs(q)
    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    return (
        <Container onClick={enterChat}>
            {
                recipient
                    ? (<UserAvatar src={recipient?.photoURL} />)
                    : (<UserAvatar />)
            }
            {/* <UserAvatar /> */}
            <p>{recipientEmail}</p>
        </Container>
    )
}

export default Chats

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
`

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`