"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LogIn, ShoppingCart } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { cartCount } from "@/actions/cartCount";
import { Button, buttonVariants } from "@/components/ui/button";
import { SectionWrapper } from "@/components/SectionWrapper";
import { LoginModal } from "./LoginModal";
import { UserLoggedIn } from "./UserLoggedIn";

export function Navbar() {
  const session = useSession();
  const user = session?.data?.user || null;
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || undefined;
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (callbackUrl && !user && session.status !== "loading") {
      setOpenModal(true);
    }
  }, [callbackUrl, session.status, user]);

  const { data: cart } = useQuery({
    queryKey: ["cart-count"],
    queryFn: async () => await cartCount(),
  });

  return (
    <nav className="sticky z-[99999] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <SectionWrapper>
        <div className="h-full flex items-center justify-between">
          <Link href="/" className="font-semibold">
            <span className="text-teal-600">Owl</span>
            case
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Logout
                </Button> */}
                {user.role === "ADMIN" && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard">Dashboard 🚀</Link>
                  </Button>
                )}
                <Button variant="outline" size="icon" asChild>
                  <Link href="/cart" className="relative">
                    <>
                      <div className="absolute top-[-4px] right-[-4px]">
                        {cart && cart?.items.length > 0 && (
                          <div className="h-3 w-3 flex items-center justify-center bg-teal-600 text-white rounded-full text-[8px]">
                            {cart?.items.length}
                          </div>
                        )}
                      </div>
                      <ShoppingCart className="h-4 w-4" />
                    </>
                  </Link>
                </Button>
                <div className="pl-2">
                  <UserLoggedIn user={user} />
                </div>
              </>
            ) : null}

            {!user && session.status !== "loading" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenModal(true)}
              >
                <>
                  <LogIn className="w-4 h-4 inline mr-1.5" />
                  Login
                </>
              </Button>
            )}

            {!user && session?.status === "loading" && (
              <div
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "sm",
                  }),
                  "animate-pulse"
                )}
              >
                <div className="h-4 w-16 bg-gray-200 rounded-sm"></div>
              </div>
            )}

            <LoginModal
              callbackUrl={callbackUrl}
              title="Login"
              description="to order your custom case"
              isOpen={openModal}
              setIsOpen={setOpenModal}
            />

            {/* <div className="h-8 w-px bg-gray-200 hidden sm:block" /> */}
            {/* <Button
              variant="default"
              size="sm"
              className="hidden sm:inline-flex text-white bg-teal-600 hover:bg-teal-600/90"
              asChild
            >
              <Link href="/configure/upload" className="flex">
                <span className="mr-px">Create case</span>
                <ArrowRight size={24} />
              </Link>
            </Button> */}
          </div>
        </div>
      </SectionWrapper>
    </nav>
  );
}
