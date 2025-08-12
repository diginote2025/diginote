import Image from "next/image";

export default function RecentPostItem({ title, date, image }) {
  return (
    <div className="flex items-center gap-3">
      <Image src={image} alt={title} width={60} height={60} className="rounded" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
    </div>
  );
}
