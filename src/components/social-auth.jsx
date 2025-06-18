import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth"
import { auth } from "../libs/firebaseConfig.js"
import { useState } from "react"
import useStore from "../store/index.js"
import { useNavigate } from "react-router-dom"
import api from "../libs/apiCall.js"
import { toast } from "sonner"
import { Button } from "../components/ui/button.jsx"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export const SocialAuth = ({ isLoading, setLoading }) => {
  const { setCredentials } = useStore((state) => state);
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const handleSocialSignIn = async (provider) => {
    try {
      // Sign out any existing sessions first
      // await signOut(auth);
      
      // Start new sign-in
      provider === 'google' ? setGoogleLoading(true) : setGithubLoading(true);
      setLoading(true);

      const authProvider = provider === 'google' 
        ? new GoogleAuthProvider() 
        : new GithubAuthProvider();

      const result = await signInWithPopup(auth, authProvider);

      await saveUserToDb(result.user, provider);
    } catch (err) {
      console.error(`${provider} sign in error:`, err);
      toast.error(`${provider} sign in failed: ${err.message}`);
    } finally {
      setLoading(false);
      setGoogleLoading(false);
      setGithubLoading(false);
    }
  };

  const saveUserToDb = async (user, provider) => {
    try {
      setLoading(true);
      const [firstName, ...lastNameParts] = user.displayName?.split(' ') || ['', ''];
      const lastName = lastNameParts.join(' ') || '';

      // Try login first
      try {
        const { data: loginRes } = await api.post('/auth/login', {
          email: user.email,
          password: user.uid // Using UID as password for social auth
        });
        
        const userInfo = { ...loginRes.data.user, token: loginRes.data.token };
        
        localStorage.setItem("user", JSON.stringify(userInfo));
        setCredentials(userInfo);
        toast.success("Login successful");
        navigate("/overview");
        return;
      } catch (loginErr) {
        if (loginErr.response?.status !== 404) throw loginErr;
      }

      // If login failed (404), try signup
      const userData = {
        firstName,
        lastName,
        email: user.email,
        password: user.uid,
        provider
      };

      const { data: res } = await api.post("/auth/signup", userData);
      
      const userInfo = { ...res.user, token: res.token };
      localStorage.setItem("user", JSON.stringify(userInfo));
      setCredentials(userInfo);
      toast.success("Account created successfully");
      navigate("/overview");
    } catch (err) {
      // Sign out from Firebase if DB operation fails
      await signOut(auth);
      toast.error(err.response?.data?.message || "Authentication failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => handleSocialSignIn('google')}
        disabled={isLoading || googleLoading}
        variant="outline"
        className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
        type="button"
      >
        {googleLoading ? (
          <span className="animate-spin">↻</span>
        ) : (
          <>
            <FcGoogle className="mr-2 size-5" />
            Google
          </>
        )}
      </Button>

      <Button
        onClick={() => handleSocialSignIn('github')}
        disabled={isLoading || githubLoading}
        variant="outline"
        className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
        type="button"
      >
        {githubLoading ? (
          <span className="animate-spin">↻</span>
        ) : (
          <>
            <FaGithub className="mr-2 size-5" />
            GitHub
          </>
        )}
      </Button>
    </div>
  )
}

export default SocialAuth