import React, { useState } from 'react';
import './HoverComponent.css'; // import your CSS file
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,updateProfile } from "@firebase/auth";
import { useNavigate } from "react-router-dom";
const AuthComponent = () => {
    const [isSignUp, setIsSignUp] = useState(true); // true for sign up, false for sign in
//create the navigate object 
  const navigate = useNavigate();

  //a stateful variable for each input
  const [confirmPassword, setConfirmPassword] = useState("")
  const [newAuthor, setNewAuthor]= useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

  const handleSubmit = (e) => {
      e.preventDefault(); // Prevents the default form submission behavior

      // Perform validation checks here
      // For example, checking if all fields are filled, if passwords match, etc.

      // If validation passes, process the form data
      // This could involve sending a request to a server or handling data in some other way
//
    //get the auth object
     const auth = getAuth();

    //if on sign up page create a new user
    if(isSignUp){

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 


          const user = userCredential.user;

          //add the userName to the users profile it can't be added when the user is created
          updateProfile(user, {
            displayName: userName
          }).then(() => {
            console.log('Username updated successfully!');
          }).catch((error) => {
            console.error('Error updating username:', error);
          });
          console.log(user)

          //navigate to the home page on successful user creation
          navigate("/")
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
           console.log(errorMessage)
          // ..
        });
    }else{

      //if on the sign in page just sign them in
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;


        //navigate to the home page on succesful sign in
        navigate("/")
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
      });
    }
      console.log("Form Submitted");


  };


    return (
      <main>
        <h1> TERAPHY </h1>
        <p> "Did you just stumble upon a video so cringe-worthy that even your brain is giving you side-eye? Fear not! Introducing TERAPY – the ultimate solution for embarrassing brain moments! Sign up now, and lets us help decringe your mind. Because life is too short to carry around embarrassing memories. Let TERAPY turn your cringe into a chuckle today!"</p>
        <div className="hover-component">
            <div className="toggle-switch">
                <button onClick={toggleForm}>
                    {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
                </button>
            </div>
          {/*if signUp is true it shows the div with className signup-form if false it shows the div with className signin-form */}
            {isSignUp ? (
                <div className="signup-form">
                  <form onSubmit={handleSubmit} className="form">
                      <h2>Sign Up</h2>
                     <input type="text" placeholder="Username"
                       value={userName}
                       onChange={(e) => setUserName(e.target.value)}

                       required />
                      <input type="email" placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

                        required />
                      <input type="password" placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                      <input type="password" placeholder="Confirm Password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required />
                      <button type="submit">Sign Up</button>
                  </form>
                </div>
            ) : (
                <div className="signin-form">
                    <form onSubmit={handleSubmit} className="form">
                        <h2>Sign In</h2>
                        <input type="email" placeholder="Email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required />
                        <input type="password" placeholder="Password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required />
                        <button type="submit">Sign In</button>
                    </form>
                </div>
            )}
        </div>
          <h3>
            WARNING: "Posting cringy videos on this platform would lead to serious punishment and Banishment from platform".
          </h3>
      </main>
    );
};

export default AuthComponent;
