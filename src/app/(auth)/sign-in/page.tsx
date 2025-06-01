"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiResponse } from "@/types/ApiResponse";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
function page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    if (result?.error) {
      toast.error(result.error);
    }

    if (result?.url) {
      toast.success("Login successful!");
      router.replace("/profile");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800">
      <div className="w-full max-w-md p-10 backdrop-blur-sm bg-zinc-900/80 rounded-3xl shadow-2xl border border-zinc-700">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Create an Account
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-300">
                    Email/Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email or username"
                      {...field}
                      className="w-full px-4 py-2.5 mt-1 bg-zinc-800/70 text-white placeholder-gray-500 border border-zinc-700  shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-300">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="w-full px-4 py-2.5 mt-1 bg-zinc-800/70 text-white placeholder-gray-500 border border-zinc-700  shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-gradient-to-r bg-white hover:bg-gray-400 text-black font-bold shadow-md transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Please Wait
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default page;
