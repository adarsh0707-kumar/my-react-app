import React, {useEffect, useState} from 'react'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import useStore  from '../../store/index.js'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { BiLoader } from 'react-icons/bi'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card'
import Seporator from "../../components/Separator.jsx"
import Input from "../../components/ui/input.jsx"
import { SocialAuth } from "../../components/social-auth.jsx"
import { Button } from '../../components/ui/button.jsx'
import { toast } from 'sonner'
import api from '../../libs/apiCall.js'


// import { Button } from "../../components/ui/button.jsx"


const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required"
    })
    .email({
      message: "Invalid email address"
    }),
  password: z
    .string({
      required_error: "Password is required"
    })
    .min(6, "Password is required")

})

const Login = () => {
  const { user, setCredentials } = useStore(state => state)
  const {
    register,
    handleSubmit,
    formState: { errors , isValid},
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onChange"
  })

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [submitError, setSubmitError] = useState(null)
  
    useEffect(() => {
      user && navigate("/")
    }, [user])
  
  const onSubmit = async (data) => {

      try {
        setLoading(true)
        setSubmitError(null)

        const response = await api.post("/auth/login",data)
        if (response.data?.data.user) {
          toast.success("Account Login successfully...", response?.message);


          const userInfo = {
            ...response.data.data.user,
            token: response.data.data.token
          }

          localStorage.setItem("user", JSON.stringify(userInfo))

          setCredentials(userInfo)

          
          navigate("/overview")
          
        }

      }
      catch (err) {
        console.error("Login error: ", err)
        setSubmitError(err.response?.data?.message || err.message)
        toast.error(err.response?.data?.message || err.message || "Login failed" )
      }
      finally {
        setLoading(false)
      }
    }

  return (
    <div className='flex items-center justify-center w-full min-h-screen py-10'>
      <Card className='w-[400px] bg-white dark:bg-black/20 shadow-md overflow-hidden'>
        <div className='p-6 md:p-8'>
          <CardHeader className='py-0'>
            <CardTitle className='mb-8 text-center dark:text-white'>
              Login Account
            </CardTitle>
          </CardHeader>

          <CardContent
            className="p-0"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div
                className="mb-8 space-y-6">
                <SocialAuth
                  isLoading={loading}
                  setLoading={setLoading}

                />
                <Seporator />


                <Input
                  disabled={loading}
                  id="email"
                  label="Email"
                  name="email"
                  
                  type="email"
                  placeholder="jonsnow@gmail.com"
                  error={errors?.email?.message}
                  {...register("email")}
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
                />

                <Input
                  disabled={loading}
                  id="password"
                  label="Password"
                  name="password"
                  
                  type="password"
                  placeholder="Snow@1234"
                  error={errors?.password?.message}
                  {...register("password")}
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
                />
                {submitError && (
                  <p className="text-sm text-red-500"> { submitError}</p>
                )}

              </div>

              <Button
                type="submit"
                className="w-full bg-violet-800 cursor-pointer"
                disabled={loading || !isValid}
              >
                {loading ? <BiLoader className="text-2xl text-white animate-spin"/> : "Login an account"}
              </Button>

            </form>

          </CardContent>
        </div>

        <CardFooter
          className="justify-center gap-2"
        >
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <Link
            to="/signup"
            className="text-sm font-semibold text-violet-600 hover:underline"
          >
            Sign Up
          
          </Link>

        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
