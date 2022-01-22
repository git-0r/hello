import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore"
import Head from "next/head"
import styled from "styled-components"
import ChatScreen from "../../components/ChatScreen"
import Sidebar from "../../components/Sidebar"
import { db } from "../../firebase"
import { useContext } from "react"
import AppContext from "../../AppContext"



function Chat({ messages, chat }) {
    const [user, setUser] = useContext(AppContext)

    const recipientEmail = chat?.users?.filter(userToFilter => userToFilter !== user?.email);

    return (
        <Container>
            <Head>
                <title>Chat with {recipientEmail}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context) {
    const ref = collection(db, `chats/${context.query.id}/messages`)
    const q = query(ref, orderBy("timestamp", "asc"))

    const messageRes = await getDocs(q)
    // const messageRes = await getDocs(collection(db, `chats/${context.query.id}/messages`), orderBy("timestamp", "asc"))

    const messages = messageRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
        .map(messages => ({
            ...messages,
            timestamp: messages.timestamp.toDate().getTime()
        }))


    const chatRes = await getDoc(doc(db, "chats", context.query.id))
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }


    return {
        props: {
            messages: JSON.stringify(messages),
            chat
        }
    }

    // return {}
}

const Container = styled.div`
    display: flex;
`

const ChatContainer = styled.div`
    flex:1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar{
        display: none;
    }
`