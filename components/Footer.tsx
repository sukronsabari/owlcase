import Link from "next/link";
import { SectionWrapper } from "./SectionWrapper";

export function Footer() {
  return (
    <footer className="bg-white border-t border-t-gray-200">
      <SectionWrapper className="py-3 text-muted-foreground text-sm">
        <div className="flex flex-col gap-1 items-center text-center md:flex-row md:justify-between">
          <p>&copy; {new Date().getFullYear()} All Right Reserved</p>
          <div className="flex items-center justify-center space-x-8">
            <Link href="#">Terms</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Cookie Policy</Link>
          </div>
        </div>
      </SectionWrapper>
    </footer>
  );
}
