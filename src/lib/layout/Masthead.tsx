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
  Text,
} from "@/lib/ui";
import Link from "next/link";
import { useTracking } from "../hooks/useTracking";
import { useMe } from "../providers";

export function Masthead() {
  const { isAuthenticated, isAdmin } = useMe();
  const { trackEvent } = useTracking();

  const trackNavigationEvent = (navigationLabel: string) => {
    trackEvent({
      event: `clicked ${navigationLabel} link`,
      originatedFrom: "masthead",
    });
  };

  return (
    <div className="flex flex-row items-center justify-between w-full px-4 py-2 border-b lg:flex-col lg:w-auto lg:min-w-[260px] lg:border-b-0 lg:py-6 lg:px-8 lg:border-r lg:items-start lg:min-h-screen">
      <Link href="/">
        <PocketKnife className="text-emerald-700" />
      </Link>
      {isAuthenticated && (
        <div className="flex flex-row gap-8 lg:flex-col lg:gap-4 lg:mb-auto lg:mt-8">
          <Link
            href="/my-courses"
            onClick={() => trackNavigationEvent("my courses")}
          >
            My Courses
          </Link>
        </div>
      )}
      {isAdmin && (
        <div className="flex flex-row gap-8 items-center lg:items-start lg:flex-col lg:gap-4 lg:mb-8 lg:mt-auto">
          <Text className="text-xs tracking-widest">ADMIN MENU</Text>
          <Link href="/admin">Admin</Link>
          <Link href="/admin/courses">Courses</Link>
          <Link href="/admin/modules">Modules</Link>
        </div>
      )}
      <div className="flex flex-row items-center justify-between gap-4">
        <ModeToggle />
        {isAuthenticated ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <SignInButton mode="modal" />
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
        <Button variant="outline" className="rounded-full" size="icon">
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
