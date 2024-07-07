import Image from "next/image";
import Link from "next/link";
import ArrowImg from "@/public/images/arrow.png";
import HorseImg from "@/public/images/horse.jpg";
import LineImg from "@/public/images/line.png";
import Owl1 from "@/public/images/owl/owl-1.svg";
import YourImagesImg from "@/public/images/your-image.png";
import { ArrowRight, Check, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reviews } from "@/components/Gallery";
import { Icons } from "@/components/Icons";
import { Phone } from "@/components/Phone";
import { ProfilePicture } from "@/components/ProfilePicture";
import { SectionWrapper } from "@/components/SectionWrapper";

export default function HomePage() {
  return (
    <div className="bg-gray-50 grainy-light">
      <SectionWrapper className="pt-10 pb-32">
        <>
          <div className="grid grid-col-1 gap-4 lg:grid-cols-2 lg:pt-32">
            <div className="px-4 flex flex-col items-center text-center relative lg:text-left lg:items-start">
              <div className="absolute -top-36 left-4 hidden lg:block">
                <div className="absolute h-32 inset-x-0 bottom-0 bg-gradient-to-t from-gray-50 to-gray-50/10"></div>
                <Image src={Owl1} className="w-28" alt="owl image" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-balance !leading-tight md:text-6xl xl:text-7xl">
                Ciptakan{" "}
                <span className="text-white bg-teal-600 px-2">Custom Case</span>{" "}
                Unik Anda
              </h1>
              <p className="mt-8 text-lg max-w-prose text-balance md:text-wrap">
                Ekspresikan gaya unik Anda dengan case ponsel kustom dari{" "}
                <span className="font-medium">Owlcase</span>. Pilih desain,
                warna, dan material sesuai selera Anda dan buat case yang
                benar-benar personal. Dengan kualitas terbaik dan ketahanan yang
                luar biasa, case ponsel Anda akan melindungi dan memperindah
                ponsel Anda setiap hari.
              </p>
              <ul className="mt-8 flex flex-col space-y-2 text-left">
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5 shrink-0 text-teal-600" />
                  <span>Bahan berkualitas tinggi dan tahan lama</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5 shrink-0 text-teal-600" />
                  <span>Garansi 1 minggu setelah pembelian</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5 shrink-0 text-teal-600" />
                  <span>Banyak variant model</span>
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-5 items-center sm:flex-row">
                <div className="flex -space-x-4">
                  <Image
                    src="/images/users/user-1.png"
                    width={40}
                    height={40}
                    alt="img"
                    className="rounded-full ring-2 ring-gray-100 object-cover"
                  />
                  <Image
                    src="/images/users/user-2.png"
                    width={40}
                    height={40}
                    alt="img"
                    className="rounded-full ring-2 ring-gray-100 object-cover"
                  />
                  <Image
                    src="/images/users/user-3.png"
                    width={40}
                    height={40}
                    alt="img"
                    className="rounded-full ring-2 ring-gray-100 object-cover"
                  />
                  <Image
                    src="/images/users/user-4.jpg"
                    width={40}
                    height={40}
                    alt="img"
                    className="rounded-full ring-2 ring-gray-100 object-cover"
                  />
                  <Image
                    src="/images/users/user-5.jpg"
                    width={40}
                    height={40}
                    alt="img"
                    className="rounded-full ring-2 ring-gray-100 object-cover"
                  />
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <div className="flex gap-0.5">
                    <Star className="h-4 w-4 text-teal-600 fill-teal-600" />
                    <Star className="h-4 w-4 text-teal-600 fill-teal-600" />
                    <Star className="h-4 w-4 text-teal-600 fill-teal-600" />
                    <Star className="h-4 w-4 text-teal-600 fill-teal-600" />
                    <Star className="h-4 w-4 text-teal-600 fill-teal-600" />
                  </div>

                  <p>
                    <span className="font-semibold">700++</span> orang merasa
                    puas
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center sm:pt-32 lg:pt-0">
              <div className="relative max-w-xl">
                <Image
                  src={YourImagesImg}
                  alt="image"
                  className="w-40 absolute -top-20 left-56 select-none hidden sm:block"
                />
                <Image
                  src={LineImg}
                  alt="image"
                  className="w-20 absolute -left-6 -bottom-6 select-none"
                />
                <Phone className="w-64" imgSrc="/images/testimonials/1.jpg" />
              </div>
            </div>
          </div>
          <div className="text-center">
            <Button
              variant="default"
              className="mt-12 text-white bg-teal-600 hover:bg-teal-600/90"
              asChild
            >
              <Link href="/configure/upload" className="flex">
                <span className="mr-px">Create case</span>
                <ArrowRight size={24} />
              </Link>
            </Button>
          </div>
        </>
      </SectionWrapper>

      {/* CUSTOMER REVIEW */}
      <div className="bg-gray-100 grainy-dark">
        <SectionWrapper className="pt-24 pb-32">
          <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
            <h2 className="text-5xl text-center font-bold tracking-tight text-balance !leading-tight md:text-6xl lg:order-2 xl:text-7xl">
              Apa yang{" "}
              <span className="relative px-2">
                customer{" "}
                <Icons.underline className="hidden sm:block pointer-events-none absolute inset-x-0 -bottom-6 text-teal-600" />
              </span>{" "}
              kami katakan
            </h2>
          </div>
          <div className="mt-16 max-w-2xl mx-auto grid grid-cols-1 px-4 gap-16 sm:mt-32 lg:grid-cols-2 lg:max-w-none lg:mx-0 lg:gap-10 lg:px-0">
            <div className="flex flex-col flex-auto gap-4">
              <div className="flex gap-0.5 mb-2">
                <Star className="h-5 w-5 text-teal-600 fill-teal-600" />
                <Star className="h-5 w-5 text-teal-600 fill-teal-600" />
                <Star className="h-5 w-5 text-teal-600 fill-teal-600" />
                <Star className="h-5 w-5 text-teal-600 fill-teal-600" />
                <Star className="h-5 w-5 text-teal-600 fill-teal-600" />
              </div>
              <p className="text-lg leading-8">
                &quot; Kualitas case ini terasa sangat kuat dan saya bahkan
                mendapatkan pujian untuk desainnya. Saya sudah menggunakan case
                ini selama dua setengah bulan sekarang dan gambarnya tetap
                sangat jelas. Pada case yang saya miliki sebelumnya, gambarnya
                mulai memudar menjadi warna kekuningan setelah beberapa
                minggu.&quot;
              </p>
              <div className="flex items-center space-x-4">
                <ProfilePicture src="/images/users/user-1.png" />
                <div className="flex flex-col">
                  <p className="font-medium">Jonathan</p>
                  <div className="flex gap-1.5 items-center">
                    <Check className="h-4 w-4 stroke-[3px] text-teal-600" />
                    <p className="text-sm text-muted-foreground">
                      Verified Purchase
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-auto gap-4">
              <div className="flex gap-0.5 mb-2">
                <Star className="h-5 w-5 text-teal-600 fill-teal-600" />
                <Star className="h-5 w-5 text-teal-600 fill-teal-600" />
                <Star className="h-5 w-5 text-teal-600 fill-teal-600" />
                <Star className="h-5 w-5 text-teal-600 fill-teal-600" />
                <Star className="h-5 w-5 text-teal-600 fill-teal-600" />
              </div>
              <p className="text-lg leading-8">
                &quot; Saya biasanya menyimpan ponsel saya bersama kunci di
                saku, yang membuat case-case sebelumnya penuh dengan goresan.
                Namun, case yang satu ini, kecuali sedikit goresan di sudut yang
                hampir tidak terlihat, masih tampak baru setelah sekitar
                setengah tahun pemakaian. Saya sangat suka dengan case ini
                &quot;
              </p>
              <div className="flex items-center space-x-4">
                <ProfilePicture src="/images/users/user-3.png" />
                <div className="relative flex flex-col">
                  <p className="font-medium">Arisu</p>
                  <div className="flex gap-1.5 items-center">
                    <Check className="h-4 w-4 stroke-[3px] text-teal-600" />
                    <p className="text-sm text-muted-foreground">
                      Verified Purchase
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-16">
            <Reviews />
          </div>
        </SectionWrapper>
      </div>

      {/* END  */}
      <SectionWrapper className="pt-24 pb-32">
        <>
          <div className="mb-16">
            <h2 className="text-5xl text-center font-bold tracking-tight text-balance !leading-tight md:text-6xl lg:order-2 xl:text-7xl">
              Unggah foto,{" "}
              <span className="bg-teal-600 text-white">Custom</span> casing anda
            </h2>
          </div>
          <div className="px-6 lg:px-8">
            <div className="flex flex-col items-center gap-40 md:grid md:grid-cols-2">
              <div className="relative flex-1 flex flex-col items-center">
                <Image
                  src={HorseImg}
                  alt="image"
                  className="aspect-[3/4] max-w-96 w-full rounded-lg ring-gray-200 object-cover shadow-md"
                />

                <Image
                  src={ArrowImg}
                  alt="arrow image"
                  className="absolute z-10 -bottom-24 left-1/2 -translate-x-1/2 rotate-90 md:rotate-0 md:top-1/2 md:left-[110%] md:translate-x-0"
                />
              </div>
              <div className="flex flex-col items-center">
                <Phone
                  className="max-w-64 shadow-md"
                  imgSrc="/images/horse_phone.jpg"
                />
              </div>
            </div>
          </div>
          <div className="px-6 mt-16 lg:px-8 flex flex-col items-center">
            <ul className="flex flex-col space-y-2 text-left">
              <li className="flex items-center space-x-2">
                <Check className="h-5 w-5 shrink-0 text-teal-600" />
                <span>Bahan berkualitas tinggi</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-5 w-5 shrink-0 text-teal-600" />
                <span>Lapisan anti gores dan sidik jari</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-5 w-5 shrink-0 text-teal-600" />
                <span>Kompatibel dengan pengisian daya nirkabel</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-5 w-5 shrink-0 text-teal-600" />
                <span>Garansi 1 minggu setelah pembelian</span>
              </li>
            </ul>
            <Button
              variant="default"
              size="sm"
              className="mt-12 text-white bg-teal-600 hover:bg-teal-600/90"
              asChild
            >
              <Link href="/configure/upload" className="flex">
                <span className="mr-px">Create your case now</span>
                <ArrowRight size={24} />
              </Link>
            </Button>
          </div>
        </>
      </SectionWrapper>
    </div>
  );
}
