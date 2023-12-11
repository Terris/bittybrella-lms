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
  TextLink,
} from "@/lib/ui";
import Link, { LinkProps } from "next/link";
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
    <div className="flex flex-row items-center justify-between w-full px-8 py-2 border-b text-sm leading-none">
      <Link href="/" className="mr-6">
        <PocketKnife className="text-primary" />
      </Link>

      {isAuthenticated && (
        <div className="flex flex-row gap-8 mr-auto ml-4">
          <TextLink
            href="/my-courses"
            onClick={() => trackNavigationEvent("my courses")}
            className="font-bold"
          >
            My Courses
          </TextLink>
        </div>
      )}
      {isAdmin && (
        <div className="flex flex-row gap-8 items-center ml-auto mr-16">
          <TextLink href="/admin" className="font-bold">
            Admin
          </TextLink>
          <TextLink href="/admin/courses" className="font-bold">
            Courses
          </TextLink>
          <TextLink href="/admin/modules" className="font-bold">
            Modules
          </TextLink>
          <TextLink href="/admin/assessments" className="font-bold">
            Assessments
          </TextLink>
        </div>
      )}
      <div className="flex flex-row items-center justify-between gap-4">
        <ModeToggle />
        <div className="items-center">
          {isAuthenticated ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonPopoverCard: "rounded shadow-md",
                },
              }}
            />
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
