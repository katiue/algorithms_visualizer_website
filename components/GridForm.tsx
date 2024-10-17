"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface GridFormProps {
  onSubmit: (gridData: {
    size: { rows: number; columns: number };
    agentPosition: { x: number; y: number };
    goalStates: { x: number; y: number }[];
    walls: { x: number; y: number; w: number; h: number }[];
  }) => void;
}

export default function GridForm({ onSubmit }: GridFormProps) {
  const [rows, setRows] = useState(5)
  const [columns, setColumns] = useState(11)
  const [agentPosition, setAgentPosition] = useState({ x: 0, y: 1 })
  const [goalStates, setGoalStates] = useState([{ x: 7, y: 0 }, { x: 10, y: 3 }])
  const [walls, setWalls] = useState([{ x: 2, y: 0, w: 2, h: 2 }, {x: 8, y: 0, w: 1, h: 2}, {x: 10, y: 0, h: 1, w: 1}, {x: 2, y: 3, h: 2, w: 1}, {x: 3, y: 4, h: 1, w: 3}, {x: 9, y: 3, h: 1, w: 1}, {x: 8, y: 4, h: 1, w: 2}])

  const addWall = () => {
    setWalls([...walls, { x: 0, y: 0, w: 1, h: 1 }])
  }
  const addGoal = () => {
    setGoalStates([...goalStates, { x: 0, y: 0 }])
  }

  const removeWall = (index: number) => {
    setWalls(walls.filter((_, i) => i !== index))
  }

  const removeGoal = (index: number) => {
    setGoalStates(goalStates.filter((_, i) => i !== index))
  }

  const handleWallChange = (index: number, field: string, value: number) => {
    const updatedWalls = walls.map((wall, i) =>
      i === index ? { ...wall, [field]: value } : wall
    )
    setWalls(updatedWalls)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const gridData = {
      size: { rows, columns },
      agentPosition,
      goalStates,
      walls,
    }
    onSubmit(gridData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
        <CardHeader>
          <CardTitle>Grid Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rows">Rows</Label>
              <Input
                id="rows"
                type="number"
                value={rows}
                onChange={(e) => setRows(Math.max(1, parseInt(e.target.value)))}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="columns">Columns</Label>
              <Input
                id="columns"
                type="number"
                value={columns}
                onChange={(e) => setColumns(Math.max(1, parseInt(e.target.value)))}
                min="1"
              />
            </div>
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle>Agent Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agent-x">X</Label>
              <Input
                id="agent-x"
                type="number"
                value={agentPosition.x}
                onChange={(e) => setAgentPosition({ ...agentPosition, x: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-y">Y</Label>
              <Input
                id="agent-y"
                type="number"
                value={agentPosition.y}
                onChange={(e) => setAgentPosition({ ...agentPosition, y: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle>Goal States</CardTitle>
        </CardHeader>
        <CardContent>
          {goalStates.map((goal, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-4 items-end">
              <div className="space-y-2">
                <Label htmlFor={`goal-${index}-x`}>X</Label>
                <Input
                  id={`goal-${index}-x`}
                  type="number"
                  value={goal.x}
                  onChange={(e) => {
                    const newGoalStates = [...goalStates]
                    newGoalStates[index].x = parseInt(e.target.value)
                    setGoalStates(newGoalStates)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`goal-${index}-y`}>Y</Label>
                <Input
                  id={`goal-${index}-y`}
                  type="number"
                  value={goal.y}
                  onChange={(e) => {
                    const newGoalStates = [...goalStates]
                    newGoalStates[index].y = parseInt(e.target.value)
                    setGoalStates(newGoalStates)
                  }}
                />
              </div>
                <Button type="button" variant="destructive" onClick={() => removeGoal(index)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          ))}
          <Button type="button" onClick={addGoal} className="mt-2">
            <Plus className="h-4 w-4 mr-2" /> Add Goal
          </Button>
        </CardContent>
        <CardHeader>
          <CardTitle>Walls</CardTitle>
        </CardHeader>
        <CardContent>
          {walls.map((wall, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 mb-4 items-end">
              <div className="space-y-2">
                <Label htmlFor={`wall-${index}-x`}>X</Label>
                <Input
                  id={`wall-${index}-x`}
                  type="number"
                  value={wall.x}
                  onChange={(e) => handleWallChange(index, 'x', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`wall-${index}-y`}>Y</Label>
                <Input
                  id={`wall-${index}-y`}
                  type="number"
                  value={wall.y}
                  onChange={(e) => handleWallChange(index, 'y', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`wall-${index}-w`}>Width</Label>
                <Input
                  id={`wall-${index}-w`}
                  type="number"
                  value={wall.w}
                  onChange={(e) => handleWallChange(index, 'w', Math.max(1, parseInt(e.target.value)))}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`wall-${index}-h`}>Height</Label>
                <Input
                  id={`wall-${index}-h`}
                  type="number"
                  value={wall.h}
                  onChange={(e) => handleWallChange(index, 'h', Math.max(1, parseInt(e.target.value)))}
                  min="1"
                />
              </div>
              <Button type="button" variant="destructive" onClick={() => removeWall(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addWall} className="mt-2">
            <Plus className="h-4 w-4 mr-2" /> Add Wall
          </Button>
        </CardContent>
        <Button type="submit" className="w-full">Generate Grid</Button>
    </form>
  )
}