import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB8UTMOVLTXFi0gF_CL8UUqnagCCOXY42k",
  authDomain: "superchat-app-12956.firebaseapp.com",
  projectId: "superchat-app-12956",
  storageBucket: "superchat-app-12956.appspot.com",
  messagingSenderId: "357168777937",
  appId: "1:357168777937:web:922ad33ba9afb06017d3f0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
      <h1>⚛️🔥💬  React-Firebase Chatroom</h1>
      <SignOut />
      </header>
      <section>
        {user ? <Chatroom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
   auth.signInWithPopup(provider);
  }
  return(
    <button onClick = {signInWithGoogle}> Sign In with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick = {() => auth.signOut()} Sign Out>SignOut</button>
  )
}

function Chatroom() {

  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState();

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text : formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    
    dummy.current.scrollIntoView({ behaviour: 'smooth'});
  }

  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref={dummy}></div>
    </main>
    <form onSubmit={sendMessage}>
      <input valur={formValue} onChange={(e) => setFormValue(e.target.value)} />

      <button  type="submit"> Send</button>

    </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';

  return (
  <div className={`message ${messageClass}`}>
    <img src={ photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
    <p>{text}</p>
  </div>
  )
}

export default App;
