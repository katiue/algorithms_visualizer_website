"use client"

import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/components/api"
import ResultBar from '@/components/result_bar'

type CellType = 'empty' | 'wall' | 'start' | 'goal' | 'traversed' | 'path'

interface Cell {
  type: CellType
  x: number
  y: number
}

const transformGrid = (grid: Cell[][]) => {
  let newGrid: number[][] = Array(grid[0].length).fill(null).map(() => Array(grid.length).fill(0))
  grid.map(row => row.map(cell => {
    if (cell.type === 'wall') {
      newGrid[cell.y][cell.x] = 1
    }}))
  return(newGrid)
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
  const [result, setResult] = useState<string[]>([])
  const [totalNodes, setTotalNodes] = useState<number>(0)
  const [traversedNodes, setTraversedNodes] = useState<number[][]>([])
  const [delay, setDelay] = useState(200);
  const [path, setPath] = useState<number[][]>([]);
  const [drawPath, setDrawPath] = useState(false);

  const Reset = () => {
    const newGrid = grid.map(row => row.map(cell => {
      if (cell.type === 'traversed' || cell.type === 'path') {
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
        }
      }, 100);
  
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [drawPath]); // Also depend on traversedNodes and delay
  
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
              setPath(moveTranslator([startCell.y, startCell.x], result));
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
    const newGrid = Array(Math.max(sizex,4)).fill(null).map((_, x) =>
      Array(Math.max(sizey,4)).fill(null).map((_, y) => ({ type: 'empty' as CellType, x, y }))
    )
    setGrid(newGrid)
  }, [sizex, sizey])

  const handleCellClick = (x: number, y: number) => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid]
      const cell = newGrid[y][x]

      if (currentType === 'start') {
        // Remove previous start cell if exists
        if(cell.type === 'start'){
          cell.type = 'empty'
          setStartCell(null)
        } else {
          if (startCell) {
            startCell.type = 'empty'
          }
          setStartCell(cell)
          cell.type = 'start'
        } 
      } else {
        if(currentType === cell.type){
          if (currentType === 'goal') {
            setGoalCell(goalCell ? goalCell.filter(cell => !(cell.x === x && cell.y === y)) : [])
          }
          cell.type = 'empty'
        } else {
          if (currentType === 'goal') {
            setGoalCell([...(goalCell || []), { x, y, type: 'goal' }])
          }
          cell.type = currentType
        }
      }
      return newGrid
    })
  }

  const handleStart = () => {
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
        initialstate: [startCell?.y, startCell?.x],
        goalstate: getGoalState(goalCell),
        grid: transformGrid(grid)
      })
      if (response.status === 200) {
        if(response.data.error){
          alert('Error: ' + response.data.error)
        }
        else{
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
    <div className="flex flex-col items-center p-4 space-y-4">
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
      <div className='flex gap-5'>
        {/* Size input */}
        <div>
          <h2>X size:</h2>
          <Input
            type="number"
            defaultValue={sizex}
            onChange = {(e) => setSizeX(Number(e.target.value))}
            />
          <h2>Y size:</h2>
          <Input
            type="number"
            defaultValue={sizey}
            onChange = {(e) => setSizeY(Number(e.target.value))}
            />
        </div>

        <div className="flex flex-col items-center space-y-5 justify-end">
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bfs">Breadth-First Search</SelectItem>
              <SelectItem value="dfs">Depth-First Search</SelectItem>
              <SelectItem value="astar">A* Search</SelectItem>
              <SelectItem value="gbfs">Greedy Best-First Search</SelectItem>
              <SelectItem value="bdfs">DFS Bidirectioinal Search</SelectItem>
              <SelectItem value="ida">IDA* Search</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleStart} className='w-full'>Start</Button>
        </div>

        <Button onClick={Reset} className='w-full'>Reset</Button>
      </div>
      <ResultBar result={result} totalNodes={totalNodes} />
      <div className="grid gap-0 border border-gray-300">
        {grid.map((row, y) =>
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`w-6 h-6 border border-gray-200 cursor-pointer ${
                cell.type === 'wall' ? 'bg-gray-500' :
                cell.type === 'goal' ? 'bg-green-500' :
                cell.type === 'start' ? 'bg-red-500' : 
                cell.type === 'traversed' ? 'bg-blue-500' : 
                cell.type === 'path' ? 'bg-yellow-500' : ''
              }`}
              onClick={() => handleCellClick(x, y)}
            />
          ))}
        </div>
        )}
      </div>

    </div>
  )
}