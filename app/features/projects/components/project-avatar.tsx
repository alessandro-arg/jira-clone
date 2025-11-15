import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProjectAvatarProps {
  name: string;
  image?: string;
  className?: string;
}

export const ProjectAvatar = ({
  name,
  image,
  className,
}: ProjectAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn("relative size-10 rounded-md overflow-hidden", className)}
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="sm"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-10 rounded-md", className)}>
      <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md">
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
