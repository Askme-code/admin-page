
"use client";
import Image from 'next/image'; // Added Image import
import { UserLoginForm } from "@/components/forms/UserLoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/'); // Redirect to homepage if already logged in
      }
    };
    checkSession();
  }, [router]);


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
           <Link href="/" className="mx-auto mb-4 flex items-center justify-center">
            <Image src="/webicon/website icon.png" alt="Tanzania Tourist Trails Logo" width={48} height={48} className="h-12 w-12" />
          </Link>
          <CardTitle className="text-2xl font-headline">Welcome Back!</CardTitle>
          <CardDescription>Log in to your Tanzania Tourist Trails account.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
