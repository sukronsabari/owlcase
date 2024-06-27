"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  CircleArrowLeft,
  Home,
  LogOut,
  Package,
  TabletSmartphone,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigationStore } from "@/stores";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface MenuItem {
  id: number;
  name: string;
  href: string;
  icon?: any;
  items?: MenuItem[];
}

export const links: MenuItem[] = [
  {
    id: 1,
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    id: 2,
    name: "Product",
    href: "#",
    icon: TabletSmartphone,
    items: [
      {
        id: 11,
        name: "Case List",
        href: "/case/lists",
      },
      {
        id: 12,
        name: "Case Atribut",
        href: "/case/attributes",
      },
    ],
  },
  {
    id: 3,
    name: "Order",
    href: "/orders",
    icon: Package,
  },
  {
    id: 4,
    name: "Customers",
    href: "/customers",
    icon: Users,
  },
];

export function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen] = useNavigationStore((state) => [state.isOpen]);

  const [activeSubmenus, setActiveSubmenus] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleSubmenu = (id: number) => {
    setActiveSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleMenuClick = (href: string) => {
    router.push(href);
  };

  const renderMenuItems = (menuItems: MenuItem[], depth = 0) => {
    return menuItems.map((link) => {
      const Icon = link.icon;
      const hasSubmenu = link.items && link.items.length > 0;

      return (
        <li className={`mb-1 pl-${depth * 4}`} key={link.id}>
          <div>
            <button
              onClick={() =>
                hasSubmenu ? toggleSubmenu(link.id) : handleMenuClick(link.href)
              }
              className={cn(
                "py-3 px-4 flex space-x-3 justify-start items-center font-medium text-sm text-gray-500 hover:text-white transition duration-300 w-full text-left",
                {
                  "text-white":
                    pathname === link.href ||
                    (hasSubmenu && activeSubmenus[link.id]),
                }
              )}
            >
              {Icon && <Icon size={24} />}
              <span>{link.name}</span>
              {hasSubmenu && (
                <span className="ml-auto">
                  {activeSubmenus[link.id] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              )}
            </button>
            {hasSubmenu && activeSubmenus[link.id] && (
              <ul className="ml-6">
                {renderMenuItems(link!.items!, depth + 1)}
              </ul>
            )}
          </div>
        </li>
      );
    });
  };

  return (
    <aside
      className={cn(
        "-translate-x-[120%] w-full max-w-56 fixed min-h-screen left-0 z-[49] bg-gray-900 transition-all duration-200 xl:translate-x-0 xl:rounded-none xl:m-0",
        {
          "translate-x-0": isOpen,
        }
      )}
    >
      <div className="px-4 h-16 flex items-center border-b border-b-gray-500 relative">
        <Link href="/" className="text-white font-semibold">
          Owlcase
        </Link>
      </div>

      <nav className="pt-4 h-full w-full flex flex-col">
        <ul className="flex flex-col">
          {renderMenuItems(links)}
          <li className="mt-auto pl-0">
            <button
              className="py-3 px-4 flex space-x-3 justify-start items-center font-medium text-sm text-gray-500 hover:text-white transition duration-300 w-full text-left"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-6 h-6" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
