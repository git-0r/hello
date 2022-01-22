import { MoreVert, Chat, SearchRounded } from "@mui/icons-material";
import { Button, IconButton, Avatar } from "@mui/material";
import styled from "styled-components"
import * as EmailValidator from 'email-validator';
import { auth, db } from "../firebase"
import { useContext, useState, useEffect } from "react"
import AppContext from "../AppContext";
import { doc, setDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore"
import Chats from "./Chats"


export default function Sidebar() {
    const [user, setUser] = useContext(AppContext)
    const [chats, setChats] = useState(null)
    const userChatRef = collection(db, "chats")
    // let chatSnapshot

    const q = query(
        userChatRef,
        where("users", "array-contains", user.email)
    )

    async function updateChatSnapshot() {
        const chatSnapshot = await getDocs(q)
        setChats(chatSnapshot)
    }

    useEffect(() => {
        updateChatSnapshot()
    }, [])
    // updateChatSnapshot()


    const createChat = async () => {
        const input = prompt(
            "Please enter an email address for the user you wish to chat with"
        )

        if (!input) return null;

        if (EmailValidator.validate(input) && !chatAlreadyExists(input) && user.email !== input) {
            await addDoc(collection(db, "chats"), {
                users: [user.email, input]
            })
                .then(() => {
                    // console.log("added to db")
                    updateChatSnapshot()
                }
                )
        } else {
            console.log("failed to add to db")
        }
    }

    const chatAlreadyExists = (recipientEmail) => {

        // async function getData() {
        //     chatSnapshot = await getDocs(q)
        // }
        // getData()
        updateChatSnapshot()
        // console.log(chats.docs[0].data())
        // console.log(chatSnapshot.docs)

        return (
            // !!chatSnapshot?.docs
            //     .find(chat =>
            //         chat.data()
            //             .users.find(user => user === recipientEmail)?.length > 0
            //     )
            !!chats?.docs
                .find(chat =>
                    chat.data()
                        .users.find(user => user === recipientEmail)?.length > 0
                )
        )
    }



    const signOut = async () => {
        await auth.signOut();
        setUser(auth.currentUser)
    }


    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={signOut} />
                <IconContainer>
                    <IconButton>
                        <Chat />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </IconContainer>
            </Header>
            <Search>
                <SearchRounded />
                <SearchInput placeholder="Search in chats" />
            </Search>
            <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

            {
                chats?.docs.map(chat => <Chats key={chat.id} id={chat.id} users={chat.data().users} />)
            }
            {/* <Chats /> */}
        </Container>
    )
}


const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: none;

    ::-webkit-scrollbar{
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`
const SidebarButton = styled(Button)`
    width: 100%;


    &&&{
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover{
        opacity: 0.8;
    }
`

const IconContainer = styled.div``;
