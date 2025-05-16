import { Skeleton } from "../ui/skeleton";

function LoadingCard() {
  return (
    <div className="w-full rounded-xl shadow-lg flex flex-col  hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105">
      <div className="w-full h-32 sm:h-46 overflow-hidden rounded-t-xl">
        <Skeleton className="w-full h-full bg-gray-300" />
      </div>
      <div className="w-full flex items-center justify-between text-center p-2 sm:p-2 space-y-0.5">
        <div className="flex flex-col items-start justify-center py-1">
          <div className="text-sm sm:text-lg">
            <Skeleton className="w-14 md:w-20 h-2 md:h-4 bg-gray-200" />
          </div>

          <div className="text-gray-800  flex mt-1">
            <Skeleton className="w-12 md:w-16 h-2 md:h-4 bg-gray-200" />
          </div>

          <div className="flex items-center justify-center mt-1">
            <Skeleton className="w-12 md:w-16 h-2 md:h-4 bg-gray-200" />
          </div>
        </div>
        <div>
          <Skeleton className="w-14 md:w-20 h-6 md:h-10 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default LoadingCard;
