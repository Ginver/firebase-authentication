import './App.css';
import { useState, useEffect } from "react";

// Firebase configuration
import app from './modules/firebase';
const db = app.firestore();

function App() {

    // state management
    const [ userIntent, setUserIntent ] = useState( 'Register');
    const [ appUser, setAppUser ] = useState( undefined );
    const [ address, setAddress ] = useState( '');
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ userName, setUserName ] = useState('');
    const [ loading, toggleLoading ] = useState( 'Initialising')

    //on the mount of the component, ask firebase to tell us whether we are logged in
    //if we are logged in, set the user to state
    useEffect( () => {
        app.auth().onAuthStateChanged(user => {

            //set the user to state
            setAppUser(user);

            //disable loader
            toggleLoading(false);

            //check if address is in database
            //if not logged in > stop there
            if(!user) return

            //if logged in, ask database for our address
            db.collection('addresses').doc(user.email).get()
                .then(doc => {
                if(!doc.exists) return

            //if there is a document, get the data
            const knownAddress = doc.data() //{ address: 'address'}
            const knownFirstName= doc.data()
            const knownLastName = doc.data()
            const knownUserName = doc.data()

                    //if I typed and saved address, set it to state
            if(knownAddress && knownAddress.address) setAddress(knownAddress.address)
            if(knownFirstName && knownFirstName.firstname) setFirstName(knownFirstName.firstname)
            if(knownLastName && knownLastName.lastname) setLastName(knownLastName.lastname)
            if(knownUserName && knownUserName.username) setUserName(knownUserName.username)

            })
        })
    }, [])

    // function submit handler
    const onSubmit = async event => {

        //prevent reload
        console.log('Submit event', event)
        event.preventDefault()
        // console.log(event)

        //isolate email and password from event
        console.log('Event target', event.target)
        const [email, password] = event.target;

        //login or register
        if (userIntent == 'Register') {

            const response = await app.auth().createUserWithEmailAndPassword(email.value, password.value);
            console.log('Authentication response: ', response)
            setAppUser(response.user)
        } else {

            const response = await app.auth().signInWithEmailAndPassword(email.value, password.value);
            console.log('Authentication response: ', response)
            setAppUser(response.user)
        }

        console.log(appUser)
    }

    //handle the saving of an address
    const saveUserInfo = async () => {

        await db.collection('addresses').doc(appUser.email).set({address: address, firstname: firstName, lastname: lastName, username: userName })
        alert('Data saved')

    }

    return(
        <main>
            { loading && <p>{loading}</p> }
            {/*if not logged in yet*/}
            {!loading && !appUser && <form onSubmit={onSubmit} id="login-form">
                <h1>{userIntent}</h1>
                <input type="email" placeholder="email"/>
                <input type="password" placeholder="password"/>
                <input type="submit" value={userIntent}/>
                <button onClick={ () => setUserIntent(userIntent == 'Register' ? 'Login' : 'Register')}>
                    {userIntent == 'Register' ? 'Login' : 'Register'} instead
                </button>
            </form> }

            {/*if logged in*/}
            {!loading && appUser && <div>
                <h2>Welcome {firstName}</h2>
                <input value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="address"/>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="first name"/>
                <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="lastname"/>
                <input value={userName} onChange={e => setUserName(e.target.value)} type="text" placeholder="username"/>

                <button onClick={saveUserInfo}>
                    save
                </button>
            </div>}
        </main>
    )
};

export default App;