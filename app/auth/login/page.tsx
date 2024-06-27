import Image from "next/image";
import getSession from "@/lib/getSession";
import SnakeImg from "@/public/images/snake-1.png";
import { SectionWrapper } from "@/components/SectionWrapper";
import { LoginForm } from "@/components/LoginForm";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();

  // if (session?.user) {
  //   redirect("/");
  // }

  return (
    <SectionWrapper className="pt-14 pb-32">
      <div className="max-w-96 mx-auto">
        <div className="flex items-center justify-center gap-3">
          <h1 className="font-black text-3xl uppercase">Owlcase</h1>
          <Image src={SnakeImg} className="w-10" alt="logo image" />
        </div>
        <p className="mt-6 mb-4">Hey friend! Welcome back</p>
        <LoginForm />
      </div>
    </SectionWrapper>
  );
}
