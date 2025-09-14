"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { Sparkle } from "lucide-react";
import Link from "next/link";
import React from "react";

export function Subscribepart() {
  const { state } = useSidebar();
  // console.log("state=", state);

  return (
    <>
      {state === "expanded" ? (
        <Card className="gap-3  shadow-md border rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
          <CardHeader className="px-5 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Available Credits: <span className="text-blue-600">5</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Manage your usage and upgrade for more credits
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 space-y-3">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500 transition-all"
                style={{ width: "45%" }}
              />
            </div>

            {/* Usage Info */}
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
              <span>0 used</span>
              <span>5 total</span>
            </div>

            {/* CTA */}
            <Link href="/subscribe">
              <Button
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
              >
                Upgrade Plan
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <SidebarMenuButton
          tooltip="Subscribe"
          asChild
          className="z-30 h-12 w-full px-3 flex items-center gap-2 transition-all hover:bg-blue-600 hover:text-white rounded-lg"
        >
          <Link
            href="/subscribe"
            className="flex items-center gap-2 w-full px-3"
          >
            <Sparkle className="h-4 w-4" aria-hidden="true" />
            <span>Upgrade</span>
          </Link>
        </SidebarMenuButton>
      )}
    </>
  );
}
