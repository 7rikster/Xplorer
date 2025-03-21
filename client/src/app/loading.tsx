import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="w-screen h-screen bg-black">
      {/* <Skeleton className="w-[80%] h-[80%]" /> */}
      <h1>Loading Please Wait</h1>
    </div>
  );
}

export default Loading;
