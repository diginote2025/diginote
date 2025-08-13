

import Image from "next/image";

export default function BlogCard({ category, date, title, excerpt, image }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
      <div className="relative">
        <Image src={image} alt={title} width={800} height={500} className="w-full h-auto" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="bg-lime-300 text-black text-sm px-3 py-1 rounded">
            {category}
          </span>
          <span className="bg-lime-300 text-black text-sm px-3 py-1 rounded">
            {date}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600 mt-2">{excerpt}</p>
        <a href={"/blog/"+title.toLowerCase().replace(/\s+/g, "-")} className="text-lime-500 font-medium mt-3 inline-block">
          Read More →
        </a>
      </div>
    </div>
  );
}
