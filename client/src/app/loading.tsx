import { Skeleton } from "@/components/ui/skeleton";

function Loading({text = "Loading Please Wait"}) {
  return (
    <div className="w-screen h-screen bg-red-500 absolute left-0 top-0 flex items-center justify-center z-50">
      {/* <Skeleton className="w-[80%] h-[80%]" /> */}
      <h1>{text}</h1>
    </div>
  );
}

export default Loading;
