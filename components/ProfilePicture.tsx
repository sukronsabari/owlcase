import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfilePicture({ src }: { src: string }) {
  return (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>USR</AvatarFallback>
    </Avatar>
  );
}
