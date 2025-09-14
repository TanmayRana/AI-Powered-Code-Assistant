"use client";

import * as React from "react";
import {
  BookOpen,
  MessageCircle,
  Code,
  Trophy,
  FolderOpen,
  Settings,
  User,
  SquareTerminal,
  Brain,
  Binoculars,
  FileCode,
  Sparkle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { motion } from "framer-motion";
import { Subscribepart } from "./Subscribepart";
import Image from "next/image";
// import Subscribepart from "./Subscribepart";

// Sidebar navigation data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      badge: null,
    },
    {
      title: "AI Assistant",
      url: "/assistant",
      icon: MessageCircle,
      badge: "New",
    },
    { title: "Code Editor", url: "/editor", icon: Code, badge: null },
    { title: "Lessons", url: "/lessons", icon: BookOpen, badge: "3" },
    { title: "Challenges", url: "/challenges", icon: Trophy, badge: null },
    {
      title: "Explore Sheets",
      url: "/explore-sheets",
      icon: Binoculars,
      badge: null,
    },
    { title: "My Sheet", url: "/my-sheet", icon: FileCode, badge: null },
    // { title: "Projects", url: "/projects", icon: FolderOpen, badge: null },
    { title: "Profile", url: "/profile", icon: User, badge: null },
    { title: "Subscribe", url: "/subscribe", icon: Sparkle, badge: null },
    // { title: "Settings", url: "/settings", icon: Settings, badge: null },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className={`
            group flex items-center gap-3 rounded-xl px-3 py-2
            transition-all duration-200 ease-in-out
            hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
            data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground
            ${state === "collapsed" ? "justify-center px-0" : ""}
          `}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            // className="flex h-11 w-11 items-center justify-center rounded-xl
            //            bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
          >
            {/* <Brain className="h-6 w-6 text-white" /> */}
            <Image
              src="/logoipsum.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </motion.div>
          {state !== "collapsed" && (
            <div className="flex flex-col text-left">
              <span className="truncate text-sm font-medium">
                AI Code Assistant
              </span>
              <span className="text-xs text-muted-foreground">
                Your smart helper
              </span>
            </div>
          )}
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <div className="p-1">
          <Subscribepart />
        </div>
      </SidebarFooter> */}
      {/* Ref suitably typed for SidebarRail */}
      <SidebarRail ref={buttonRef} />
    </Sidebar>
  );
}
