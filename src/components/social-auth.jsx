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
import { Button } from "@headlessui/react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export const Socialauth = ({ isLoading, setLoading }) => {
  const [user] = useAuthState(auth)
  const [selectedProvider, setSelectedProvider] = useState("google")
  const { setCredentails } = useStore((state) => state)
  const navigate = useNavigate()

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()

    setSelectedProvider("google")

    try {
      
      const res = await signInWithPopup(auth, provider)
      console.log(res)

    }
    catch (err) {
      console.error("Error signing in with google", err)
    }
  }

  const signInWithGithub = async() => {
    const provider = GithubAuthProvider()

    setSelectedProvider("github");
    try {
      
      const res = await signInWithPopup(auth, provider)
      console.log(res)

    }
    catch (err) {
      console.error("Error signing in with github", err)
    }
  }

  useEffect(() => {
    const saveUserToDb = async () => {
      try {
        const userData = {
          name: user.displayName,
          email: user.email,
          provider: selectedProvider,
          uid: user.uid
        };

        setLoading(true)

        const { data: res } = await api.post("/auth/login", userData)
        console.log(res)

        if (res?.user) {
          toast.success(res?.message);
          const userInfo = { ...res?.user, token: res?.token }
          localStorage.setItem("user", JSON.stringify(userInfo))

          setCredentails(userInfo)

          setTimeout(() => {
            navigate("/overview")
          }, 1500)
        }
      }
      catch (err) {
        console.error("Something went wrong", err)
        toast.error(err?.response?.data?.message || err.message)
      }
      finally {
        setLoading(false)
      }
    };

    if (user) {
      saveUserToDb()
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
        Continue with Google
      </Button>

       <Button
        onClick={signInWithGithub}
        disabled={isLoading}
        variant="outline"
        className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
        type="button"
      >
        <FaGithub className="mr-2 size-5" />
        Continue with GitHub
      </Button> 


      



    </div>
  )

}