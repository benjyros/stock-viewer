"use client";

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/hooks/use-toast"
import LoadingOverlay from "@/components/loading-overlay";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Suspense, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

function LoginFunction({ searchParams }: { searchParams: Message }) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()
  const params = useSearchParams();
  const redirectedFrom = params.get("redirectedFrom") || "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      throw new Error("Missing email or password.");
    }

    setLoading(true);
    await authClient.signIn.email({
      email,
      password,
    }, {
      onRequest: (ctx) => {
        toast({
          description: <div className="flex gap-2 content-center"><Loader2 className="animate-spin" />Signing in...</div>,
        })
      },
      onSuccess: (ctx) => {
        toast({
          title: "Sign in successful!",
          description: "Redirecting...",
        })
        setTimeout(() => {
          window.location.href = redirectedFrom;
        }, 1000);
      },
      onError: (ctx) => {
        setLoading(false);
        if (ctx.error.status === 403) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Please verify your email address",
            action: <Button onClick={resendVerificationLink} variant="outline" className="bg-transparent text-white">Resent link</Button>,
          })
        }
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: ctx.error.message,
        })
        console.error("Error during sign in:", ctx.error.message);
      },
    });
  };

  const resendVerificationLink = async () => {
    await authClient.sendVerificationEmail({
      email,
      callbackURL: redirectedFrom, // The redirect URL after verification
    });
  }

  return (
    <>
      {loading && <LoadingOverlay />}
      <form onSubmit={handleSignIn} method="post" className="flex flex-col min-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-sm text-foreground">
          Don't have an account?{" "}
          <Link className="text-foreground font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-2 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            placeholder="you@example.com"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link className="text-xs text-foreground underline" href="/forgot-password">
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <SubmitButton pendingText="Signing in...">Sign in</SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}

export default function Login({ searchParams }: { searchParams: Message }) {
  return (
    <Suspense>
      <LoginFunction searchParams={searchParams} />
    </Suspense>
  );
}
