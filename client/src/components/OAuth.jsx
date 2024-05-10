import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {signInFailure, signInSuccess} from '../redux/user/userSlice'
import { useNavigate } from "react-router-dom";

export default function OAuth() {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    try {
      const provide = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provide);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
      
    } catch (err) {
      console.log("Could sign in with google", err);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white text-center rounded-lg uppercase p-3 hover:opacity-95"
    >
      Continue with Google
    </button>
  );
}
