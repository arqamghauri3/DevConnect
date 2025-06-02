"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
import axios from "axios";
import { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const page = () => {
  const router = useRouter();
  const param = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code,
      });
      toast.success(response.data.message);
      router.replace("/landing");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-300">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="code"
                      {...field}
                      className="w-full px-4 py-2.5 mt-1 bg-zinc-800/70 text-white placeholder-gray-500 border border-zinc-700  shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </FormControl>
                  <p></p>

                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r bg-white hover:bg-gray-400 text-black font-bold shadow-md transition-all duration-200"
            >
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
