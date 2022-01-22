import styled from "styled-components"
import AppContext from "../AppContext"
import { useState, useContext, useEffect, useRef } from "react"
import { Avatar, IconButton } from "@mui/material"
import { AttachFile, InsertEmoticon, MicOutlined, MoreVert, Router } from "@mui/icons-material"
import { useRouter } from "next/router"
import Message from "./Message"
import { doc, setDoc, addDoc, collection, serverTimestamp, getDocs, getDoc, where, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import TimeAgo from "timeago-react"

function ChatScreen({ messages, chat }) {
    const [input, setInput] = useState("")
    const [recipientSnapshot, setRecipientSnapshot] = useState("")
    // const [messagesSnapshot, setMessagesSnapshot] = useState("")
    const endOfMessagesRef = useRef(null)
    const [user] = useContext(AppContext)
    const router = useRouter()
    let messagesSnapshot

    function getRecipientEmail(chat, user) {
        return chat?.users?.filter(userToFilter => userToFilter !== user?.email)[0]
    }
    const recipientEmail = getRecipientEmail(chat, user);

    const q = query(
        collection(db, "users"),
        where("email", "==", getRecipientEmail(chat, user))
    )

    useEffect(() => {
        async function updateSnapshot() {
            await getDocs(q).then(data => {
                setRecipientSnapshot(data?.docs[0]?.data())
            })
        }
        updateSnapshot()
    }, [recipientEmail])


    const ref = collection(db, `chats/${router.query.id}/messages`)
    const messagesQuery = query(ref, orderBy("timestamp", "asc"))

    // const messageRes = getDocs(messagesQuery)
    // useEffect(() => {
    //     async function updateSnapshot() {
    //         await getDocs(messagesQuery).then(data => {
    //             setMessagesSnapshot(data)
    //         })
    //     }
    //     updateSnapshot()
    // }, [])

    // const unsub = onSnapshot(messagesQuery, (snapshot) => {
    //     if (messagesSnapshot && messagesSnapshot?.docs?.length !== snapshot?.docs?.length) {
    //         console.log(messagesSnapshot?.docs?.length, snapshot?.docs?.length)
    //         setMessagesSnapshot(snapshot)
    //     }
    // })

    // const [messagesSnapshot] = useCollection(
    //     db
    //         .collection("chats")
    //         .doc(router.query.id)
    //         .collection("messages")
    //         .orderBy("timestamp", "asc")
    // )
    // console.log(recipientSnapshot)

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot?.docs?.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }}
                />
            ))
        }
        else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }

    }

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behaviour: "smooth",
            block: "start"
        })
    }

    const sendMessage = (e) => {

        e.preventDefault()
        const userRef = doc(db, "users", user.uid)

        setDoc(userRef,
            { lastSeen: serverTimestamp() },
            { merge: true }
        )

        addDoc(collection(db, "chats", router.query.id, "messages"), {
            timestamp: serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        }, { merge: true }
        )

        setInput("")
        scrollToBottom()
    }
    // console.log(recipientSnapshot)

    return (
        <Container>
            <Header>
                {
                    recipientSnapshot
                        ? <Avatar src={recipientSnapshot?.photoURL} />
                        : <Avatar />
                }
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {
                        recipientSnapshot
                            ? (
                                <p>
                                    Last active: {" "}
                                    {recipientSnapshot?.lastSeen?.toDate() ? (
                                        <TimeAgo datetime={recipientSnapshot?.lastSeen?.toDate()} />
                                    ) : ("Unavailable")
                                    }
                                </p>
                            ) : (
                                <p>Unavailable</p>
                            )
                    }
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef} />
            </MessageContainer>
            <InputContainer>
                <InsertEmoticon />
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>send message</button>
                <MicOutlined />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container = styled.div``

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }
    > p {
        font-size: 14px;
        color: gray;
    }
`

const HeaderIcons = styled.div``

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`

const EndOfMessage = styled.div``

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
    /* align-items: center; */
    /* position: sticky; */
    /* bottom: 0; */
`
