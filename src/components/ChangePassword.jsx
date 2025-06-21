import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../libs/apiCall';
import { toast } from 'sonner';
import Button from './ui/button';
import { BiLoader } from 'react-icons/bi';
import PasswordInput from '../components/HideAndShowPassword';

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const submitPasswordHandler = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.put("/users/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if(res?.status === "success") {
        toast.success(res?.message);
        reset();
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='py-20'>
      <form onSubmit={handleSubmit(submitPasswordHandler)}>
        <div>
          <p className="text-xl font-bold text-black dark:text-white mb-1 mt-10">
            Change Password
          </p>
          <span className="lableStyles">
            This will be used to log into your account and complete high
            severity actions.
          </span>

          <div className='mt-6 space-y-6'>
            <PasswordInput
              disabled={loading}
              label="Current Password"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              error={errors.currentPassword?.message}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 dark:focus:ring-violet-600"
            />

            <PasswordInput
              disabled={loading}
              label="New Password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              error={errors.newPassword?.message}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 dark:focus:ring-violet-600"
            />

            <PasswordInput
              disabled={loading}
              label="Confirm New Password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "Passwords do not match",
              })}
              error={errors.confirmPassword?.message}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 dark:focus:ring-violet-600"
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-end gap-5 pt-10">
          <Button
            variant="outline"
            loading={loading}
            type="reset"
            className="px-6 bg-transparent text-black dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Reset
          </Button>
          <Button
            variant="default"
            loading={loading}
            type="submit"
            className="px-6 bg-violet-800 text-white hover:bg-violet-700"
          >
            {loading ? <BiLoader className='animate-spin text-white' /> : "Change Password"}
          </Button>
        </div>
        
        <div className="border-b mt-8 border-gray-900 dark:border-gray-700"></div>
      </form>
    </div>
  );
};

export default ChangePassword;