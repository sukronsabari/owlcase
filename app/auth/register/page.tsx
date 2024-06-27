import Image from "next/image";
import { redirect } from "next/navigation";
import { SectionWrapper } from "@/components/SectionWrapper";
import { RegisterForm } from "@/components/RegisterForm";
import SnakeImg from "@/public/images/snake-1.png";
import getSession from "@/lib/getSession";

export default async function RegisterPage() {
  const session = await getSession();

  if (session?.user) {
    redirect("/");
  }

  return (
    <SectionWrapper className="pt-14 pb-32">
      <div className="max-w-96 mx-auto">
        <div className="flex items-center justify-center gap-3">
          <h1 className="font-black text-3xl uppercase"></h1>
          <Image src={SnakeImg} className="w-10" alt="logo image" />
        </div>
        <p className="mt-6 mb-4">Create your account</p>
        <RegisterForm />
      </div>
    </SectionWrapper>
  );
}
