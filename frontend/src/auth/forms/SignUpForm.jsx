import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { toast } from "sonner";
import GoogleAuth from '@/components/shared/GoogleAuth'

import ReCAPTCHA from "react-google-recaptcha";

 
const formSchema = z.object({
  username: z
  .string()
  .min(2, {message: "Username must be at least 2 characters."}),

  email: z.string().email({ message: "Invalid email address. "}),

  password: z.string().min(8, {message: "Password must be at least 8 characters. "}),
  
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match!",
});

const SignUpForm = () => {

  const [captchaToken, setCaptchaToken] = useState("");

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  async function onSubmit(values) {
    if (!captchaToken) {
      toast("Please complete the reCAPTCHA verification!");
      return;
    }

    try {
      setLoading(true)
      setErrorMessage(null)

      const payload = {
        ...values,
        captchaToken,
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      })
      
      const data = await res.json()

      if (data.success === false) {
        setLoading(false)
        toast("Sign up failed! Please try again.")
        return setErrorMessage(data.message)
      }

      setLoading(data)

      if (res.ok) {
        toast("Sign up Successful!")
        navigate("/sign-in")
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
      toast("Something went wrong!")
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl sm:max-w-5xl mx-auto flex-col md:flex-row
      md:items-center gap-5'>
        {/* left */}
        <div className="flex-1">
          <Link to={"/"} className='font-bold text-2xl sm:text-4xl flex flex-wrap'>
            <span className='text-slate-500'>Travel</span>
            <span className='text-slate-900'>Dispatch</span>
          </Link>

          <h2 className='text-[24px] md:text-[30px] font-bold leading-[140%]
          tracking-tighter pt-5 sm:pt-12'>
            Create a new account
          </h2>

          <p className="text-slate-500 text-[14px] font-medium leading-[140%] md:text-[16px] md:font-normal mt-2">
            Welcome to Travel Dispatch, Please provide your details
            </p>        
          </div>

          {/* Right */}

          <div className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>

                      <FormControl>
                        <Input type="text" placeholder="Username" {...field} />
                      </FormControl>
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>

                      <FormControl>
                        <Input type="email" placeholder="xyz@example.com" {...field} />
                      </FormControl>
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>

                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      
                      <FormControl>
                        <Input type="password" placeholder="Confirm Password" {...field} />
                      </FormControl>
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                />

                <Button type="submit" className="bg-blue-500 w-full" disabled={loading}>
                  {loading ? (
                    <span className='animate-pulse'>Loading...</span>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </Button>

                <GoogleAuth />
              </form>
            </Form>

            <div className="flex gap-2 text-sm mt-5">
              <span>Have an account?</span>

              <Link to="/sign-in" className='text-blue-500'>
                  Sign In
              </Link>
            </div>

            {errorMessage && <p className='mt-5 text-red-500'>{errorMessage}</p>}
          </div>
      </div>
    </div>
  )
}

export default SignUpForm