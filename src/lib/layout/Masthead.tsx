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
    <div className="flex flex-row items-center justify-between w-full px-4 py-2 border-b lg:fixed lg:flex-col lg:w-[160px] lg:border-b-0 lg:py-8 lg:px-8 lg:border-r lg:items-start lg:h-screen">
      <Link href="/" className="lg:w-full lg:flex lg:justify-center">
        <PocketKnife className="text-emerald-700" />
      </Link>

      {isAuthenticated && (
        <div className="flex flex-row gap-8 mr-auto ml-4 lg:mx-0 lg:flex-col lg:w-full lg:gap-4 lg:mt-6 lg:border-t lg:pt-4">
          <Link
            href="/my-courses"
            onClick={() => trackNavigationEvent("my courses")}
          >
            My Courses
          </Link>
        </div>
      )}
      {isAdmin && (
        <div className="flex flex-row gap-8 items-center mr-4 lg:mr-0 lg:flex-col lg:items-start lg:gap-4 lg:mt-16 lg:mb-auto">
          <Text className="text-xs tracking-widest font-bold hidden lg:block">
            ADMIN MENU
          </Text>
          <Link href="/admin">Admin</Link>
          <Link href="/admin/courses">Courses</Link>
          <Link href="/admin/modules">Modules</Link>
        </div>
      )}
      <div className="flex flex-row items-center justify-between mt-auto gap-4 lg:w-full lg:flex-col">
        <ModeToggle />
        <div className="lg:w-full lg:flex lg:flex-col items-center lg:border-t lg:py-4">
          {isAuthenticated ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal" />
          )}
        </div>
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
      <DropdownMenuContent align="center">
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
