"use client"

import React, { useState, useCallback } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type CellType = 'empty' | 'wall' | 'start' | 'goal'

interface Cell {
  type: CellType
  x: number
  y: number
}

const GRID_SIZE = 20

export default function PathFinder() {
  const [grid, setGrid] = useState<Cell[][]>(() =>
    Array(GRID_SIZE).fill(null).map((_, y) =>
      Array(GRID_SIZE).fill(null).map((_, x) => ({ type: 'empty', x, y }))
    )
  )
  const [currentType, setCurrentType] = useState<CellType>('wall')
  const [algorithm, setAlgorithm] = useState<string>('bfs')
  const [startCell, setStartCell] = useState<Cell | null>(null)

  const handleCellClick = (x: number, y: number) => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid]
      const cell = newGrid[y][x]

      if (currentType === 'start') {
        // Remove previous start cell if exists
        if (startCell) {
          startCell.type = 'empty'
        }
        setStartCell(cell)
        cell.type = 'start'
      } else if (currentType === 'wall' && cell.type === 'wall') {
        // Toggle wall off
        cell.type = 'empty'
      } else {
        // Don't overwrite start cell
        cell.type = currentType
      }
      console.log(cell)
      return newGrid
    })
  }

  const handleStart = () => {
    // Implement your path-finding algorithm here
    console.log(`Starting ${algorithm} algorithm`)
  }

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
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

      <div className="grid grid-cols-20 gap-0 border border-gray-300">
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

      <div className="flex items-center space-x-4">
        <Select value={algorithm} onValueChange={setAlgorithm}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bfs">Breadth-First Search</SelectItem>
            <SelectItem value="dfs">Depth-First Search</SelectItem>
            <SelectItem value="astar">A* Search</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleStart}>Start</Button>
      </div>
    </div>
  )
}