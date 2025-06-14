import React, {useEffect, useState} from 'react'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import useStore  from '../../store/index.js'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import Seporator from "../../components/Separator.jsx"
import Input from "../../components/ui/input.jsx"
import { SocialAuth } from "../../components/social-auth.jsx"

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
    }),
  password: z
    .string({
      required_error: "Password is required"
    })
    .min(1, "Password is required")

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
      console.log(data)
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
                  lable="Name"
                  name="firstName"
                  
                  type="text"
                  placeholder="Jon Snow"
                  error={errors?.firstName?.message}
                  {...register("firstName")}
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
                />

              </div>

            </form>

          </CardContent>
        </div>
      </Card>
    </div>
  )
}

export default SignUp
