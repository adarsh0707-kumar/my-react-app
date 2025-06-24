import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import useStore from '../../store/index.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { BiLoader } from 'react-icons/bi';
import { toast } from 'sonner';
import api from '../../libs/apiCall.js';

// Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '../../components/ui/card';
import Seporator from "../../components/Separator.jsx";
import Input from "../../components/ui/input.jsx";
import PasswordInput from "../../components/HideAndShowPassword.jsx"; // Import the PasswordInput
import { SocialAuth } from "../../components/social-auth.jsx";
import { Button } from '../../components/ui/button.jsx';

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
      required_error: "First name is required"
    })
    .min(3, "First name must be at least 3 characters"),
  lastName: z
    .string(),
  password: z
    .string({
      required_error: "Password is required"
    })
    .min(8, "Password must be at least 8 characters")
});

const SignUp = () => {
  const { user } = useStore(state => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    user && navigate("/");
  }, [user]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.post("/auth/signup", data);

      if (res?.data) {
        toast.success("Account created successfully. You can now login...");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='flex items-center justify-center w-full min-h-screen py-10'>
      <Card
        className='w-[400px] bg-white dark:bg-black/20 shadow-md overflow-hidden'>
        <div
          className='p-6 md:p-8'>
          <CardHeader
            className='py-0'>
            <CardTitle
              className='mb-8 text-center dark:text-white'>
              Create Account
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
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
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="Jon"
                  error={errors?.firstName?.message}
                  {...register("firstName")}
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
                />

                <Input
                  disabled={loading}
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Snow"
                  error={errors?.lastName?.message}
                  {...register("lastName")}
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
                />

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

                <PasswordInput
                  disabled={loading}
                  label="Password"
                  {...register("password")}
                  error={errors?.password?.message}
                  placeholder="Snow@1234"
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-violet-800 cursor-pointer"
                disabled={loading}
              >
                {
                  loading ? (
                    <BiLoader className="text-2xl text-white animate-spin"/>
                  ) : (
                    "Create an account"
                  )
                }
              </Button>
            </form>
          </CardContent>
        </div>

        <CardFooter
          className="justify-center gap-2">
          <p
            className="text-sm text-gray-600">
            Already have an account?
          </p>
          <Link
            to="/login"
            className="text-sm font-semibold text-violet-600 hover:underline"
          >
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
