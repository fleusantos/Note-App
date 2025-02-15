import Image from 'next/image';

interface AuthHeaderProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}

export function AuthHeader({ 
  title, 
  imageSrc, 
  imageAlt, 
  imageWidth, 
  imageHeight 
}: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
        className="mb-4"
      />
      <h2 className="text-center text-[48px] font-bold text-[#88642A] font-inria font-[700]">
        {title}
      </h2>
    </div>
  );
}
