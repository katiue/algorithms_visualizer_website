"use client"

import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/components/api"

type CellType = 'empty' | 'wall' | 'start' | 'goal'

interface Cell {
  type: CellType
  x: number
  y: number
}

const transformGrid = (grid: Cell[][]) => {
  let newGrid: number[][] = Array(grid[0].length).fill(null).map(() => Array(grid.length).fill(0))
  const newmap = grid.map(row => row.map(cell => {
    if (cell.type === 'wall') {
      newGrid[cell.y][cell.x] = 1
    }}))
  return([newGrid])
}

export default function PathFinder() {
  const [currentType, setCurrentType] = useState<CellType>('wall')
  const [algorithm, setAlgorithm] = useState<string>('bfs')
  const [startCell, setStartCell] = useState<Cell | null>(null)
  const [goalCell, setGoalCell] = useState<Cell[] | null>(null)
  const [sizex, setSizeX] = useState<number>(0)
  const [sizey, setSizeY] = useState<number>(0)
  const [grid, setGrid] = useState<Cell[][]>([])

  const getResult = async () => {
    const response = await api.post('/getResult',{
      initialstate: [startCell?.x, startCell?.y],
      goalstate: [startCell?.x, startCell?.y],
      grid: transformGrid(grid),
    })
    console.log(response.data)
  }

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
        } else if (startCell) {
          startCell.type = 'empty'
          setStartCell(cell)
          cell.type = 'start'
        }
      } else if(cell.type !== 'start'){
        if (currentType === 'wall' && cell.type === 'wall') {
          cell.type = 'empty'
        } else if(cell.type === 'goal' && cell.type === 'goal'){
          cell.type = 'empty'
        }
        else{
          cell.type = currentType
        }
      }
      return newGrid
    })
  }

  const handleStart = () => {
    // Implement your path-finding algorithm here
    console.log(`Starting ${algorithm} algorithm`)
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
                cell.type === 'start' ? 'bg-red-500' : ''
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