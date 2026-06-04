import Image from "next/image";

interface SubPageHeaderProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: string;
}

export default function SubPageHeader({
  imageSrc,
  imageAlt = "",
  title,
  description,
}: SubPageHeaderProps) {
  return (
    <div className="flex items-center gap-3 md:gap-6.5">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={96}
        height={96}
        className="h-16 w-16 object-contain md:h-18 md:w-18"
      />
      <div className="flex flex-col gap-0.5 whitespace-nowrap">
        <p className="text-lg-semibold md:text-2xl-semibold text-gray-900">{title}</p>
        <p className="text-base-medium text-slate-500">{description}</p>
      </div>
    </div>
  );
}
