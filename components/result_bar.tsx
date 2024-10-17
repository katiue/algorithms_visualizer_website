import React from "react";

export default function ResultBar({
  result,
  totalNodes,
  reachableGoals,
}: Readonly<{
  result: string[];
  totalNodes: number;
  reachableGoals: number[][];
}>) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-1/2">
      <h1 className="text-2xl font-bold">Result: </h1>
      <div>
        Total nodes go through:
        <span className="font-bold"> {totalNodes}</span>
      </div>
      <div className={`items-center justify-center w-full h-1/2 gap-x-2 overflow-y-auto ${result?.length>0 ? "grid grid-cols-10" : "flex"}`} >
        {result?.length > 0 ? result.map((res, index) => (
          <div key={index} className="text-xl">
            {res}
          </div>
        )) : <div>No path found</div>}
      </div>
      {reachableGoals.length > 0 ? (
        <div>
          Reachable goals:
          <div className="grid grid-cols-10 items-center justify-center w-full h-1/2 gap-x-2 overflow-y-auto">
            {reachableGoals.map((goal, index) => (
              <div key={index} className="text-xl">
                {`(${goal[0]}, ${goal[1]})`}
              </div>
            ))}
          </div>
        </div>) : (
        <div>No goal reachable</div>
        )}
    </div>
  );
}