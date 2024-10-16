"use client"

import React, { useState, useEffect, use } from 'react'
import { Button } from "@/components/ui/button"
import api from "@/components/api"
import ResultBar from '@/components/result_bar'
import ToolsBar from '@/components/toolsBar'
import PredefinedMap from '@/components/predefinedMaps'
import GridUploader from '@/components/uploadFile'

type CellType = 'empty' | 'wall' | 'start' | 'goal' | 'traversed' | 'path' | 'glow'

interface ResultModel{
  path: string[],
  traversed: number[][],
  total_nodes: number,
}

interface Cell {
  type: CellType
  x: number
  y: number
}

interface GridProps {
  sizex: number
  sizey: number
  grid: Cell[][]
}

const transformGrid = (grid: Cell[][]) => {
  let newGrid: number[][] = Array.from({ length: grid[0].length }, () => Array(grid.length).fill(0));
  
  grid.forEach((row, y) => {
    row.forEach((cell ,x)  => {
      if (cell.type === 'wall') {
        newGrid[x][y] = 1;
      }
    });
  });
  
  return newGrid;
}

const getGoalState = (goalCell: Cell[]) => {
  let goalState: number[][] = Array(goalCell.length).fill(null).map(() => Array(2).fill(0))
  goalCell.map((cell, index) => {
    goalState[index] = [cell.x, cell.y]
  })
  return(goalState)
}

const moveTranslator = (initialpos: number[],move: string[]) => {
  let moveList: number[][] = []
  let pos = initialpos
  move.map((m) => {
    if(m === "UP")
      pos = [pos[0],pos[1]-1]
    if(m === "DOWN")
      pos = [pos[0],pos[1]+1]
    if(m === "LEFT")
      pos = [pos[0]-1,pos[1]]
    if(m === "RIGHT")
      pos = [pos[0]+1,pos[1]]
    moveList.push(pos)
  })
  return moveList
}

export default function PathFinder() {
  const [currentType, setCurrentType] = useState<CellType>('wall')
  const [algorithm, setAlgorithm] = useState<string>('bfs')
  const [startCell, setStartCell] = useState<Cell | null>(null)
  const [goalCell, setGoalCell] = useState<Cell[]>([])
  const [sizex, setSizeX] = useState<number>(4)
  const [sizey, setSizeY] = useState<number>(4)
  const [grid, setGrid] = useState<Cell[][]>([])
  const [result, setResult] = useState<ResultModel[]>([])
  const [totalNodes, setTotalNodes] = useState<number>(0)
  const [traversedNodes, setTraversedNodes] = useState<number[][]>([])
  const [delay, setDelay] = useState(10);
  const [displayingPath, setDisplayingPath] = useState(0);
  const [path, setPath] = useState<number[][]>([]);
  const [drawPath, setDrawPath] = useState(false);
  const [emphasePath, setEmphasePath] = useState(-1);

  useEffect(() => {
    if(emphasePath === -1)
      return
    setGrid(prevGrid => {
      const newGrid = [...prevGrid]
      newGrid.map(row => row.map(cell => {
        if (cell.type === 'glow') {
          cell.type = 'path'
     }}))
        if(startCell)
        moveTranslator([startCell.x, startCell.y], result[emphasePath].path).forEach((move) => {
          if(newGrid[move[1]][move[0]].type !== 'goal' || newGrid[move[1]][move[0]].type !== 'start')
            newGrid[move[1]][move[0]].type ='glow'
      })
      return newGrid
  })
  }, [emphasePath])

  const onMapClick = (props: GridProps) => {
    setResult([]);
    setTotalNodes(0);
    setDrawPath(false);
    setPath([]);
    setTraversedNodes([]);
    setStartCell(null);
    setGoalCell([]);
    setDisplayingPath(0);
    setEmphasePath(-1);

    props.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.type === 'start') {
          setStartCell(cell);
        } else if (cell.type === 'goal') {
          setGoalCell([...goalCell, cell]);
        }
      });
    })
    setGrid(props.grid);
    setSizeX(props.sizex);
    setSizeY(props.sizey);
  };
  
  const Reset = () => {
    const newGrid = grid.map(row => row.map(cell => {
      if (cell.type === 'traversed' || cell.type === 'path' || cell.type === 'glow') {
        cell.type = 'empty'
      }
      return cell
    }))
    setGrid(newGrid)
    setResult([])
    setTotalNodes(0)
    setDrawPath(false)
    setPath([])
    setTraversedNodes([])
    setDisplayingPath(0)
    setEmphasePath(-1)
  }

  useEffect(() => {
    if (drawPath && path.length > 0) {
      let currentIndex = 0;
  
      const intervalId = setInterval(() => {
        if (currentIndex < path.length) {
          const node = path[currentIndex];
          setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            const cell = newGrid[node[1]][node[0]];
  
            // Update cell type
            if (cell.type === "traversed") {
              cell.type = "path";
            }
            return newGrid;
          });
  
          currentIndex++;
        } else {
          clearInterval(intervalId); // Clear the interval once all nodes are processed
  
          if (displayingPath < result.length - 1) {
            setDrawPath(false); // Stop drawing current path
            setDisplayingPath(displayingPath + 1); // Increment to the next path
          }
        }
      }, 100);
  
      return () => {
        clearInterval(intervalId);
      };
    }
    else if (drawPath && path.length === 0) {
      setDrawPath(false); // Stop drawing current path
      setDisplayingPath(displayingPath + 1); // Increment to the next path
    }
  }, [drawPath, path, displayingPath]);
  
  // This effect triggers drawing whenever the `displayingPath` is updated
  useEffect(() => {
    if (displayingPath < result.length) {
      if(startCell)
      setPath(moveTranslator([startCell.x, startCell.y], result[displayingPath].path));
      setDrawPath(true); // Start drawing the updated path
    }
  }, [displayingPath]);
  
  useEffect(() => {
    if (traversedNodes && traversedNodes.length > 0) {
      let currentIndex = 0;
  
      const intervalId = setInterval(() => {
        if (currentIndex < traversedNodes.length) {
          const node = traversedNodes[currentIndex];
          setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            const cell = newGrid[node[1]][node[0]];
  
            // Update cell type
            if (cell.type === "empty") {
              cell.type = "traversed";
            }
            return newGrid;
          });
  
          currentIndex++;
  
          // Trigger the path drawing when we reach the last node
          if (currentIndex === traversedNodes.length) {
            clearInterval(intervalId);
            // Ensure the drawPath is set AFTER this is finished
            setDrawPath(true); // Triggers the first useEffect
            if (startCell) {
              setPath(moveTranslator([startCell.x, startCell.y], result[displayingPath].path));
            }
          }
        }
      }, delay);
  
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [traversedNodes, startCell, result, delay]); // Also depend on these values

  useEffect(() => {
    setGrid(prevGrid => {
      const newGrid = Array(sizey).fill(null).map((_, y) =>
        Array(sizex).fill(null).map((_, x) => {
          // Check if the cell already exists in the previous grid
          if (prevGrid[y] && prevGrid[y][x]) {
            return prevGrid[y][x];
          }
          // Otherwise, return an empty cell or the corresponding cell from the predefined template
          return { type: 'empty' as CellType, x, y };
        })
      );
      return newGrid;
    });
  }, [sizex, sizey]);
  
  const handleCellClick = (x: number, y: number) => {
    if(traversedNodes.length > 0){
      const choosenPath = goalCell.findIndex(goal => goal.x === x && goal.y === y)
      if(choosenPath === emphasePath){
        setEmphasePath(-1)
        return
      }
      setEmphasePath(goalCell.findIndex(goal => goal.x === x && goal.y === y))
      return
    }
    setGrid(prevGrid => {
      const newGrid = [...prevGrid]
      const cell = newGrid[y][x]
      
      if (currentType === 'start') {
        // Remove previous start cell if exists
        if(cell.type === 'start'){
          cell.type = 'empty'
          setStartCell(null)
        } else if(cell.type === 'goal'){
          setGoalCell(goalCell.filter(goal => goal.x !== x || goal.y !== y))
          cell.type = 'start'
          if (startCell) {
            startCell.type = 'empty'
          }
          setStartCell(cell)
        }else {
          if (startCell) {
            startCell.type = 'empty'
          }
          setStartCell(cell)
          cell.type = 'start'
        } 
      } 
      if (currentType === 'wall') {
        if(cell.type === 'wall'){
          cell.type = 'empty'
        }
        else if (cell.type === 'goal') {
          setGoalCell(goalCell.filter(goal => goal.x !== x || goal.y !== y))
          cell.type = 'wall'
        }
        else if (cell.type === 'start') {
          setStartCell(null)
          cell.type = 'wall'
        }
        else {
          cell.type = 'wall'
        }
      }
      if(currentType === 'goal'){
        if(cell.type === 'goal'){
          setGoalCell(goalCell.filter(goal => goal.x !== x || goal.y !== y))
          cell.type = 'empty'
        }
        else if (cell.type === 'start') {
          setStartCell(null)
          cell.type = 'goal'
          setGoalCell([...goalCell, cell])
        }
        else {
          cell.type = 'goal'
          setGoalCell([...goalCell, cell])
        }
      }
      return newGrid
    })
  }

  const handleStart = () => {
    Reset()
    if (!startCell) {
      alert('Please select a start cell')
      return
    }
    if(goalCell.length === 0){
      alert('Please select a goal cell')
      return
    }
    const getResult = async () => {
      const response = await api.post('/getResult',{
        algorithm: algorithm,
        initialstate: [startCell?.x, startCell?.y],
        goalstate: getGoalState(goalCell),
        grid: transformGrid(grid)
      })
      if (response.status === 200) {
        if(response.data.error){
          alert('Error: ' + response.data.error)
        }
        else{
          console.log(response.data)
          setResult(response.data.path)
          setTotalNodes(response.data.total_nodes)
          setTraversedNodes(response.data.traversed)
        }
      }
      else {
        alert('Error' + response.data)
    }
  }
  getResult()
  }

  return (
    <div className='flex justify-between'>
      <div className='w-1/5 h-full bg-green-500 overflow-y-auto'></div>
      <div className="flex flex-col items-center p-4 space-y-4 overflow-auto h-screen">
        {/* Button bar */}
        <div className="flex space-x-4 mb-4">
          <Button
            onClick={() => setCurrentType('wall')}
            variant={currentType === 'wall' ? 'default' : 'outline'}
          >
            Wall
          </Button>
          <Button
            onClick={() => setCurrentType('goal')}
            variant={currentType === 'goal' ? 'default' : 'outline'}
          >
            Goal
          </Button>
          <Button
            onClick={() => setCurrentType('start')}
            variant={currentType === 'start' ? 'default' : 'outline'}
          >
            Start
          </Button>
        </div>
        <ToolsBar
          sizex={sizex}
          sizey={sizey}
          setSizeX={setSizeX}
          setSizeY={setSizeY}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          handleStart={handleStart}
          Reset={Reset}
        />
        <ResultBar result={result[displayingPath]?.path} totalNodes={totalNodes} />
        <div className="flex flex-col gap-0 border border-gray-300">
          {grid.map((row, y) =>
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
              key={`${x}-${y}`}
              className={`w-6 h-6 border border-gray-200 cursor-pointer ${emphasePath !== -1 && cell.type != 'glow' ? "opacity-50": "" } ${
                cell.type === 'wall' ? 'bg-gray-500' :
                cell.type === 'goal' ? 'bg-green-500' :
                cell.type === 'start' ? 'bg-red-500' : 
                cell.type === 'traversed' ? 'bg-blue-500' : 
                cell.type === 'path' ? 'bg-yellow-500' : 
                cell.type === 'glow' ? 'bg-purple-500' : ''
              }`}
              onClick={() => handleCellClick(x, y)}
              />
            ))}
          </div>
          )}
        </div>
      </div>
      <div className='flex flex-col p-3 gap-y-2 h-screen w-1/5'>
        <GridUploader 
          setGrid={setGrid} 
          setRows={setSizeY} 
          setColumns={setSizeX} 
          setGoalCell={setGoalCell} 
          setStartCell={setStartCell} 
        />
        <PredefinedMap 
          onMapClick={onMapClick}
          />
      </div>
    </div>
  )
}