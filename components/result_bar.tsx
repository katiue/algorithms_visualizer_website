import React from "react";
import { Cat } from "lucide-react";

interface ResultModel {
  path: string[],
  traversed: number[][],
  total_nodes: number,
  goal: number[], // Add this line
}

export default function ResultBar({
  result,
  totalNodes,
  reachableGoals,
}: Readonly<{
  result: ResultModel;
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
      {reachableGoals.length > 0 ? (
        <div className="w-full justify-center items-center">
          <h1 className="w-full text-center text-2xl font-bold">Reachable goals:</h1>
          <div className="flex flex-cols items-center justify-center w-full h-1/2 gap-x-2 overflow-y-auto">
            {reachableGoals.map((goal, index) => (
              <div key={index} className="text-xl">
                {`(${goal[0]}, ${goal[1]})`}
              </div>
            ))}
          </div>
        </div>) : (
        <div>No goal reachable</div>
        )}
      <h1 className="text-2xl font-bold">Detail: </h1>
      <div className="text-xl flex gap-x-2 w-full"><div className="font-bold">Goal:</div>{result?.goal ? `(${result?.goal[0]}, ${result?.goal[1]})` : ""}</div>
      <div className="text-xl flex gap-x-2 w-full"><div className="font-bold">Total nodes went through:</div>{result?.total_nodes}</div>
      <div className="font-bold text-xl w-full">Path:</div>
      <div className={`items-center justify-center w-full h-1/2 gap-x-2 overflow-y-auto ${result?.path.length>0 ? "grid grid-cols-7" : "flex"}`} >
        {result?.path.length > 0 ? result.path.map((res, index) => (
          <div key={index} className="text-xl">
            {res}
          </div>
        )) : <div>No path found</div>}
      </div>
      <p className="flex"><Cat/>: Click on goal for more detail</p>
    </div>
  );
}