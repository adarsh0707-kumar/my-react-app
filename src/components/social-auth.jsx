import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { auth } from "../libs/firebaseConfig.js"
import {useAuthState} from "react-firebase-hooks/auth"
import { useEffect, useState } from "react"
import  useStore  from "../store/index.js"
import { useNavigate } from "react-router-dom"
import api from "../libs/apiCall.js"
import { toast } from "sonner"
import { Button } from "../components/ui/button.jsx"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export const SocialAuth = ({ isLoading, setLoading }) => {
  const [user] = useAuthState(auth);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const { setCredentials } = useStore((state) => state);
  const navigate = useNavigate();

  // Common sign-in handler
  const handleSignIn = async (provider) => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      console.log("Auth result:", result);
      return result.user;
    } catch (err) {
      console.error(`Error signing in with ${provider.providerId}:`, err);
      toast.error(`Failed to sign in with ${provider.providerId}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = () => {
    setSelectedProvider("google");
    return handleSignIn(new GoogleAuthProvider());
  };

  const signInWithGithub = () => {
    setSelectedProvider("github");
    return handleSignIn(new GithubAuthProvider());
  };

  // Save user to your backend
  const saveUserToDb = async (user) => {
    try {
      setLoading(true);
      const [firstName, ...lastNameParts] = user.displayName.split(' ');
      const lastName = lastNameParts.join(' ') || '';
  
      // First try to log in the user
      try {
        const { data: loginRes } = await api.post('/auth/login', {
          email: user.email,
          password: user.uid
        });
        
        const userInfo = { ...loginRes.user, token: loginRes.token };
        localStorage.setItem("user", JSON.stringify(userInfo));
        setCredentials(userInfo);
        toast.success(loginRes.message || "Login successful");
        navigate("/overview");
        return;
      } catch (loginErr) {
        // Only proceed to signup if login fails with 404 (user not found)
        if (loginErr.response?.status !== 404) {
          throw loginErr;
        }
      }
  
      // If login failed with 404, proceed with signup
      const userData = {
        firstName,
        lastName,
        email: user.email,
        password: user.uid,
        provider: user.providerData[0]?.providerId || selectedProvider
      };
  
      const { data: res } = await api.post("/auth/signup", userData);
      
      if (res?.user) {
        const userInfo = { ...res.user, token: res.token };
        localStorage.setItem("user", JSON.stringify(userInfo));
        setCredentials(userInfo);
        toast.success(res.message || "Login successful");
        navigate("/overview");
      }
    } catch (err) {
      // Handle other errors
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      saveUserToDb(user);
    }
  }, [user?.uid]);

  return (
    <div
      className="flex items-center gap-2"
    >
      <Button
        onClick={signInWithGoogle}
        disabled={isLoading}
        variant="outline"
        className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
        type="button"
      >
        <FcGoogle className="mr-2 size-5" />
        Google
      </Button>

       <Button
        onClick={signInWithGithub}
        disabled={isLoading}
        variant="outline"
        className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
        type="button"
      >
        <FaGithub className="mr-2 size-5" />
        GitHub
      </Button> 


      



    </div>
  )

}
export default SocialAuth
