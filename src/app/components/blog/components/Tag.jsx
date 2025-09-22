export default function Tag({ text }) {
  return (
    <span className="bg-gray-100 px-3 py-1 text-sm rounded-full cursor-pointer hover:bg-lime-200">
      {text}
    </span>
  );
}
