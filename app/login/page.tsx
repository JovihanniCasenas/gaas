"use client"

import { logInUser, signUpUser } from "@/lib/utils/auth/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { EyeIcon } from "@/components/icons/lucide-eye"
import { EyeOffIcon } from "@/components/icons/lucide-eye-off"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const username = formData.get("username") as string

    var error
    if (isLogin) {
      ({ error } = await logInUser(email, password))
    } else {
      ({ error } = await signUpUser(email, password, { username }))
    }
    if (error) {
      console.error("Authentication error:", error)
      toast.error(`Failed to ${isLogin ? "login" : "sign up"}. ${error}.`)
    } else {
      router.push("/")
    }
    setIsLoading(false)
  }
  
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{isLogin ? "Login to your account" : "Create a new account"}</CardTitle>
          <CardDescription>
            {isLogin ? "Enter your email below to login to your account" : "Enter your details below to create a new account"}
          </CardDescription>
            <CardAction>
              <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Sign Up" : "Login"}
              </Button>
            </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {!isLogin && (
                <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  required
                />
              </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <InputGroup>
                  <InputGroupInput id="password" type={showPassword ? "text" : "password"} name="password" required />
                  <InputGroupButton type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroup>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full flex-col gap-2 mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                </div>
              ) : isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
