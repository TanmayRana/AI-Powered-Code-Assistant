// "use client";

// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { AppSidebar } from "./AppSidebar";
// import { ModeToggle } from "./ModeToggle";
// import { UserButton } from "@clerk/nextjs";
// import { usePathname } from "next/navigation";

// type DashboardProviderProps = {
//   children: React.ReactNode;
// };

// export default function DashboardProvider({
//   children,
// }: DashboardProviderProps) {
//   const path = usePathname() || "/";
//   const pathSegments = path.split("/").filter(Boolean);
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-40 justify-between">
//           <div className="flex items-center gap-2">
//             <SidebarTrigger className="-ml-1" />
//             <Separator orientation="vertical" className="mr-2 h-4" />
//             <Breadcrumb>
//               <BreadcrumbList>
//                 {pathSegments.map((segment, index) => {
//                   const href = "/" + pathSegments.slice(0, index + 1).join("/");
//                   const isLast = index === pathSegments.length - 1;
//                   return (
//                     <BreadcrumbItem key={index}>
//                       {isLast ? (
//                         <BreadcrumbPage>
//                           {decodeURIComponent(segment)}
//                         </BreadcrumbPage>
//                       ) : (
//                         <BreadcrumbLink href={href}>
//                           {decodeURIComponent(segment)}
//                         </BreadcrumbLink>
//                       )}
//                       {!isLast && <BreadcrumbSeparator />}
//                     </BreadcrumbItem>
//                   );
//                 })}
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//           <div className="flex items-center gap-2 pr-4">
//             <UserButton />
//             <ModeToggle />
//           </div>
//         </header>
//         <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ModeToggle } from "./ModeToggle";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

type DashboardProviderProps = {
  children: React.ReactNode;
};

// Helper function to capitalize the first letter of a string
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function DashboardProvider({
  children,
}: DashboardProviderProps) {
  const path = usePathname() || "/";
  const pathSegments = path.split("/").filter(Boolean);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-40 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {pathSegments.map((segment, index) => {
                  const href = "/" + pathSegments.slice(0, index + 1).join("/");
                  const isLast = index === pathSegments.length - 1;
                  const label = capitalize(decodeURIComponent(segment));

                  return (
                    <BreadcrumbItem key={index}>
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                      )}
                      {!isLast && <BreadcrumbSeparator />}
                    </BreadcrumbItem>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 pr-4">
            <UserButton />
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
