export default function LoadingMarker() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center">
      <div className="flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#8d65e3] border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    </div>
  );
} 