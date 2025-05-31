"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import {AxiosError} from "axios";
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
function page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          console.log(error);
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast.success(response.data.message);
      router.replace(`/verify-code?username=${data.username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error in signup", error);
      toast.error("Error in signup");
      setIsSubmitting(false);
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-300">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. johndoe"
                      {...field}
                      className="w-full px-4 py-2.5 mt-1 bg-zinc-800/70 text-white placeholder-gray-500 border border-zinc-700  shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <Loader className="w-4 h-4 animate-spin" />
                  )}
                  <p>
                    {usernameMessage && (
                      <span
                        className={`text-sm ${
                          usernameMessage.includes("Username is available")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {usernameMessage}
                      </span>
                    )}
                  </p>

                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-300">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g. john@example.com"
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
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default page;
