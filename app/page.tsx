"use client"

import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/components/api"

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
  const [sizex, setSizeX] = useState<number>(0)
  const [sizey, setSizeY] = useState<number>(0)
  const [grid, setGrid] = useState<Cell[][]>([])
  const [result, setResult] = useState<string[]>([])
  const [totalNodes, setTotalNodes] = useState<number>(0)
  const [traversedNodes, setTraversedNodes] = useState<number[][]>([])
  const [delay, setDelay] = useState(200);
  const [drawPath, setDrawPath] = useState(false);

  useEffect(() => {
    if (traversedNodes.length > 0) {
      let currentIndex = 0;
  
      const intervalId = setInterval(() => {
        // Process the current node
        if (currentIndex < traversedNodes.length) {
          const node = traversedNodes[currentIndex];
          setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            const cell = newGrid[node[1]][node[0]];
  
            // Update cell type
            if (cell.type === 'empty') {
              cell.type = 'path';
            }
            return newGrid;
          });
  
          currentIndex++; // Increment the current index
        } else {
          setDrawPath(true);
          clearInterval(intervalId); // Clear the interval once all nodes are processed
        }
      }, delay);
      return () => 
      {
        setDrawPath(true);
        clearInterval(intervalId);
      }}}, [drawPath])

  const drawNodes = () =>{
  
    if (traversedNodes.length > 0) {
      let currentIndex = 0;
  
      const intervalId = setInterval(() => {
        // Process the current node
        if (currentIndex < traversedNodes.length) {
          const node = traversedNodes[currentIndex];
          setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            const cell = newGrid[node[1]][node[0]];
  
            // Update cell type
            if (cell.type === 'empty') {
              cell.type = 'traversed';
            }
            return newGrid;
          });
  
          currentIndex++; // Increment the current index
        } else {
          setDrawPath(true);
          clearInterval(intervalId); // Clear the interval once all nodes are processed
        }
      }, delay);
      return () => 
      {
        setDrawPath(true);
        clearInterval(intervalId);
      }}}

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
    const getResult = async () => {
      const response = await api.post('/getResult',{
        algorithm: algorithm,
        initialstate: [startCell?.y, startCell?.x],
        goalstate: getGoalState(goalCell),
        grid: transformGrid(grid)
      })
      if (response.status === 200) {
        setResult(response.data.path)
        setTotalNodes(response.data.totalNodes)
        setTraversedNodes(response.data.traversed)
        if (startCell)
          moveTranslator([startCell.y, startCell.x], response.data.path);
        drawNodes()
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
            onChange = {(e) => setSizeX(Number(e.target.value))}
            />
          <h2>Y size:</h2>
          <Input
            type="number"
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
              <SelectItem value="dfsb">DFS Bidirectioinal Search</SelectItem>
              <SelectItem value="ida">IDA* Search</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleStart} className='w-full'>Start</Button>
        </div>
      </div>
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