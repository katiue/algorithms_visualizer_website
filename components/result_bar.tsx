import React from "react";

export default function ResultBar({
  result,
  totalNodes,
}: Readonly<{
  result: string[];
  totalNodes: number;
}>) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-1/4">
      <h1 className="text-2xl font-bold">Result: </h1>
      <div>
        Total nodes go through:
        <span className="font-bold"> {totalNodes}</span>
      </div>
      <div className="grid grid-cols-10 items-center justify-center w-full h-1/2 gap-x-2 overflow-y-auto">
        {result && result.map((res, index) => (
          <div key={index} className="text-xl">
            {res}
          </div>
        ))}
      </div>
    </div>
  );
}