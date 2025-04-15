"use client";

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SignUpFunction({ searchParams }: { searchParams: Message }) {
  const [mounted, setMounted] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const redirectedFrom = params.get("redirectedFrom") || "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${firstname} ${lastname}`.trim();

    if (!email || !password || !name) {
      throw new Error("Missing required fields");
    }

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name
    }, {
      onRequest: (ctx) => {
        // For example, you might set a loading flag in a context – in this server action,
        // you can’t directly update UI state, so this callback is primarily conceptual.
        console.log("Signing up user...");
      },
      onSuccess: (ctx) => {
        // You can perform any server-side logic needed on success.
        console.log("Sign-up successful, redirecting...");
      },
      onError: (ctx) => {
        // Log the error or handle it in a custom way.
        console.error("Error during sign up:", ctx.error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col min-w-64 max-w-64 mx-auto">
      <h1 className="text-2xl font-medium">Sign up</h1>
      <p className="text-sm text text-foreground">
        Already have an account?{" "}
        <Link className="text-primary font-medium underline" href="/sign-in">
          Sign in
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="lastname">Name</Label>
        <Input
          name="lastname"
          onChange={(e) => {
            setLastname(e.target.value);
          }}
          required
        />
        <Label htmlFor="firstname">First name</Label>
        <Input
          name="firstname"
          onChange={(e) => {
            setFirstname(e.target.value);
          }}
          required
        />
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          placeholder="you@example.com"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          minLength={6}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />
        <SubmitButton pendingText="Signing up...">Sign up</SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}

export default function Signup({ searchParams }: { searchParams: Message }) {
  return (
    <Suspense>
      <SignUpFunction searchParams={searchParams} />
    </Suspense>
  );
}
