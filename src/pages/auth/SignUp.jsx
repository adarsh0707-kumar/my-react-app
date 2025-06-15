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


const RegisterSchema = z.object({
  email: z
    .string({
      required_error: "Email is required"
    })
    .email({
      message: "Invalid email address"
    }),
  firstName: z
    .string({
      required_error: "Name is required"
    })
    .min(3, "FirstName is required"),
  lastName: z
    .string(),
  password: z
    .string({
      required_error: "Password is required"
    })
    .min(8, "Password must be 8 characters")

})

const SignUp = () => {
  const { user } = useStore(state => state)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  })

    const navigate = useNavigate()
    const [loading, setLoading] = useState()
  
    useEffect(() => {
      user && navigate("/")
    }, [user])
  
    const onSubmit = async (data) => {
      try {
        setLoading(true)

        const {data:res} = await api.post("/auth/signup",data)

        if (res?.user) {
          toast.success("Account created successfully. You can now login...");
          setTimeout(() => {
            navigate("/login")
          }, 1500)
        }

      }
      catch (err) {
        console.error(err)
        toast.error(err.response?.data?.message || err.message )
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
              Create Account
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
                  disable={loading}
                  id="firstName"
                  label="FirstName"
                  name="firstName"
                  
                  type="text"
                  placeholder="Jon"
                  error={errors?.firstName?.message}
                  {...register("firstName")}
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
                />

                <Input
                  disable={loading}
                  id="lastName"
                  label="LastName"
                  name="lastName"
                  
                  type="text"
                  placeholder="Snow"
                  error={errors?.lastName?.message}
                  {...register("lastName")}
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
                />

                <Input
                  disable={loading}
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
                  disable={loading}
                  id="password"
                  label="Password"
                  name="password"
                  
                  type="password"
                  placeholder="Snow@1234"
                  error={errors?.password?.message}
                  {...register("password")}
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
                />

              </div>

              <Button
                type="submit"
                className="w-full bg-violet-800 cursor-pointer"
                disable={loading}
              >
                {loading ? <BiLoader className="text-2xl text-white animate-spin"/> : "Create an account"}
              </Button>

            </form>

          </CardContent>
        </div>

        <CardFooter
          className="justify-center gap-2"
        >
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Link
            to="/login"
            className="text-sm font-semibold text-violet-600 hover:underline"
          >
            Login
          
          </Link>

        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUp
