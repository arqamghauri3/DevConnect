"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import {
  Bell,
  MessageSquare,
  Moon,
  PlusCircle,
  Search,
  Sun,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTheme } from "@/context/ThemeProvider";

const Navbar2 = ({data }: {data: any}) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <header className="bg-white text-black dark:bg-black dark:text-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
              DEV
            </div>
            <span className="font-bold text-xl hidden sm:block">Connect</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search posts, developers, topics..."
                className="pl-10 bg-gray-50 "
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <PlusCircle className="w-4 h-4 mr-2" />
              Write Post
            </Button>

            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm">
              <MessageSquare className="w-5 h-5" />
            </Button>

            {isDarkMode ? (
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                <Sun className="w-5 h-5" />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                <Moon className="w-5 h-5" />
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Profile"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <Link href={`/${data?.username}`} className="flex items-center space-x-2">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar2;
