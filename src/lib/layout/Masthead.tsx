"use client";

import * as React from "react";
import { Moon, Sun, PocketKnife } from "lucide-react";
import { useTheme } from "next-themes";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/ui";
import Link from "next/link";
import { useConvexAuth } from "convex/react";

export function Masthead() {
  const { isAuthenticated } = useConvexAuth();
  return (
    <div className="flex flex-row items-center justify-between w-full px-4 py-2 border-b lg:flex-col lg:w-auto lg:min-w-[260px] lg:border-b-0 lg:py-6 lg:px-8 lg:border-r lg:items-start lg:min-h-screen">
      <Link href="/">
        <PocketKnife className="text-emerald-700" />
      </Link>
      {isAuthenticated && (
        <div className="flex flex-row gap-8 lg:flex-col lg:gap-4 lg:mb-auto lg:mt-8">
          <Link href="/courses">My Courses</Link>
        </div>
      )}
      <div className="flex flex-row justify-between gap-4">
        <ModeToggle />
        {isAuthenticated ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <Button>
            <SignInButton mode="modal" />
          </Button>
        )}
      </div>
    </div>
  );
}

function ModeToggle() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
