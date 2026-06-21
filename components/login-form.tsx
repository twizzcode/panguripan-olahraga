"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackURL = useMemo(
    () => searchParams.get("next") || "/admin",
    [searchParams]
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")?.toString().trim() ?? ""
    const password = formData.get("password")?.toString() ?? ""
    const name = formData.get("username")?.toString().trim() ?? ""
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? ""

    if (isSignUp && password !== confirmPassword) {
      setMessage("Password confirmation does not match.")
      return
    }

    startTransition(async () => {
      try {
        if (isSignUp) {
          await authClient.signUp.email(
            {
              name,
              email,
              password,
              callbackURL,
            },
            {
              onSuccess: () => {
                router.push(callbackURL)
                router.refresh()
              },
              onError: (context) => {
                setMessage(context.error.message)
              },
            }
          )

          return
        }

        await authClient.signIn.email(
          {
            email,
            password,
            callbackURL,
          },
          {
            onSuccess: () => {
              router.push(callbackURL)
              router.refresh()
            },
            onError: (context) => {
              setMessage(context.error.message)
            },
          }
        )
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Authentication failed."
        )
      }
    })
  }

  const handleGoogleSignIn = () => {
    setMessage(null)

    startTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: "google",
          callbackURL,
        })
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Google sign-in failed."
        )
      }
    })
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {isSignUp ? "Create your account" : "Login to your account"}
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            {isSignUp
              ? "Enter your details below to create your account"
              : "Enter your email below to login to your account"}
          </p>
        </div>

        {message ? (
          <p className="rounded-2xl border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
            {message}
          </p>
        ) : null}

        {isSignUp && (
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              required={isSignUp}
              minLength={2}
              className="bg-background"
            />
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            {!isSignUp && (
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            )}
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="bg-background"
          />
        </Field>

        {isSignUp && (
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required={isSignUp}
              className="bg-background"
            />
          </Field>
        )}

        <Field className="pt-1 md:pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Please wait..."
              : isSignUp
                ? "Sign up"
                : "Login"}
          </Button>
        </Field>
        <FieldSeparator className="my-0.5 md:my-1.5">Or continue with</FieldSeparator>
        <Field className="gap-2.5 pt-0.5 md:gap-4 md:pt-1">
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={handleGoogleSignIn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M21.805 10.023h-9.8v3.955h5.623c-.242 1.272-.968 2.35-2.057 3.072v2.55h3.33c1.949-1.794 3.074-4.439 3.074-7.577 0-.68-.061-1.334-.17-1.977Z"
                fill="#4285F4"
              />
              <path
                d="M12.005 22c2.79 0 5.13-.924 6.84-2.5l-3.33-2.55c-.924.62-2.105.987-3.51.987-2.698 0-4.984-1.822-5.8-4.27H2.766v2.63A10.32 10.32 0 0 0 12.005 22Z"
                fill="#34A853"
              />
              <path
                d="M6.205 13.667a6.2 6.2 0 0 1-.324-1.967c0-.683.118-1.345.324-1.967V7.103H2.766A10.32 10.32 0 0 0 1.68 11.7c0 1.65.395 3.213 1.086 4.597l3.439-2.63Z"
                fill="#FBBC05"
              />
              <path
                d="M12.005 5.463c1.518 0 2.88.522 3.95 1.548l2.963-2.963C17.13 2.38 14.794 1.4 12.005 1.4a10.32 10.32 0 0 0-9.239 5.703l3.439 2.63c.816-2.448 3.102-4.27 5.8-4.27Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
          <FieldDescription className="pt-1 text-center md:pt-2">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp((current) => !current)
                setMessage(null)
              }}
              className="underline underline-offset-4"
            >
              {isSignUp ? "Login" : "Sign up"}
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
