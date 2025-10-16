import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { googleAuth } from "../Service/auth.service";
import  app  from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {

  const dispatch = useDispatch();  
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        const result = await signInWithPopup(auth, provider);
        const res = await googleAuth({
            name:result.user.displayName,
            email:result.user.email,
            img:result.user.photoURL
        })
        const data = await res.data;
        dispatch(signInSuccess(data));
        navigate("/");
    } catch (err) {
      console.log("error with google sign in", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="bg-red-700 p-3 w-full text-white font-semibold rounded-full flex justify-center items-center hover:bg-red-800 active:scale-95 transition-all duration-200"
    >
      Continue with Google
    </button>
  );
};

export default GoogleAuth;
