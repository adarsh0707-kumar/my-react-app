import React, { useState } from 'react';
import { BiShow, BiHide } from 'react-icons/bi';

const PasswordInput = React.forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  const [
    showPassword,
    setShowPassword
  ] = useState(false);
  
  return (
    <div
      className="relative">
      <label
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <div
        className="relative">
        <input
          ref={ref}
          type={
            showPassword ? "text" : "password"
          }
          className={`
            ${className} w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 dark:focus:ring-violet-600 pr-10`
          }
          {...props}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {
            showPassword ?
              <BiHide size={20} />
              : <BiShow size={20}
              />
          }
        </button>
      </div>
      {
        error && (
        <p className="mt-1 text-sm text-red-600 transition-all duration-200">
          {error}
        </p>
        )
      }
    </div>

  );

});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
