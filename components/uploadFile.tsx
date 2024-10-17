import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useState } from "react";
import { Button } from "./ui/button";
import { Download, InfoIcon, X } from "lucide-react";

interface Cell {
  type: 'empty' | 'start' | 'goal' | 'wall';
  x: number;
  y: number;
}

interface GridUploaderProps {
  setGrid: (grid: Cell[][]) => void;
  setRows: (rows: number) => void;
  setColumns: (columns: number) => void;
  setGoalCell: (goalCell: Cell[]) => void;
  setStartCell: (startCell: Cell) => void;
  Reset: () => void;
}

export default function GridUploader({ setGrid, setRows, setColumns, setGoalCell, setStartCell, Reset }: GridUploaderProps) {
  
  const [isRevealed, setIsRevealed] = useState(false)

  const handleReveal = () => {
    setIsRevealed(true)
  }

  const closeReveal = () => {
    setIsRevealed(false)
  }

  const handleDownload = () => {
    // The file is assumed to be in the public folder
    const fileUrl = '/input.txt'
    
    // Create a temporary anchor element
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = 'input.txt'
    
    // Append to the document body and trigger the download
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    document.body.removeChild(link)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    Reset();
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        parseFileContent(text);
      };
      reader.readAsText(file);
    }
  };

  const parseFileContent = (content: string) => {
    const lines = content.split('\n').map(line => line.trim());

    // Parse dimensions
    const [gridRows, gridCols] = lines[0].replace('[', '').replace(']', '').split(',').map(Number);
    setRows(gridRows);
    setColumns(gridCols);

    // Parse start position
    const [startX, startY] = lines[1].replace('(', '').replace(')', '').split(',').map(Number);

    // Parse goal positions
    const goals = lines[2].split('|').map(goal => {
      const [goalX, goalY] = goal.replace('(', '').replace(')', '').split(',').map(Number);
      return { x: goalX, y: goalY };
    });

    // Parse walls
    const walls = lines.slice(3).map(line => {
      const [x, y, width, height] = line.replace('(', '').replace(')', '').split(',').map(Number);
      return { x, y, width, height };
    });

    generateGrid(gridRows, gridCols, { startX, startY }, goals, walls);
  };
  const generateGrid = (rows: number, cols: number, start: { startX: number, startY: number }, goals: { x: number, y: number }[], walls: { x: number, y: number, width: number, height: number }[]) => {
    // Initialize the grid
    setGoalCell(goals.map(goal => ({ type: 'goal', ...goal })));
    setStartCell({ type: 'start', x: start.startX, y: start.startY });
    const newGrid: Cell[][] = Array.from({ length: rows }, (_, y) =>
      Array.from({ length: cols }, (_, x) => ({ type: 'empty', x, y }))
    );
  
    // Helper function to check if a cell is within grid bounds
    const isInBounds = (x: number, y: number) => x >= 0 && x < cols && y >= 0 && y < rows;
  
    // Set start position if within bounds
    if (isInBounds(start.startX, start.startY)) {
      newGrid[start.startY][start.startX].type = 'start'; // Correct order of accessing the grid
    } else {
      console.error(`Start position (${start.startX}, ${start.startY}) is out of bounds.`);
    }
  
    // Set goal positions if within bounds
    goals.forEach(goal => {
      if (isInBounds(goal.x, goal.y)) {
        newGrid[goal.y][goal.x].type = 'goal'; // Correct order of accessing the grid
      } else {
        console.error(`Goal position (${goal.x}, ${goal.y}) is out of bounds.`);
      }
    });
  
    // Set walls if within bounds
    walls.forEach(wall => {
      for (let i = wall.x; i < wall.x + wall.width; i++) {
        for (let j = wall.y; j < wall.y + wall.height; j++) {
          if (isInBounds(i, j)) {
            newGrid[j][i].type = 'wall'; // Correct order of accessing the grid
          } else {
            console.error(`Wall at (${i}, ${j}) is out of bounds.`);
          }
        }
      }
    });
  
    setGrid(newGrid); // Update the grid state
  };
  

  return (
    <>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Upload Grid</CardTitle>
        <InfoIcon className="h-6 w-6 text-blue-500" onClick={handleReveal}/>
        {isRevealed && (
        <Card className="absolute top-10">
          <div className="flex items-center justify-end">
            <Button onClick={closeReveal} variant="ghost" className="w-fit">
              <X className="h-6 w-6" />
            </Button>
          </div>
          <CardContent className="gap-0">
            <p>
              If you already have a file then you can upload it here. The file should have the following format:
            </p>
            <p>
              [5,11] // Grid: 5 rows, 11 columns
            </p>
            <p>
              (0,1) // Agent at (0,1)
            </p>
            <p>
              (7,0) | (10,3) // Goals at (7,0) and (10,3)
            </p>
            <p>
              (2,0,2,2) // Wall at (2,0), size 2x2
            </p>
            <p>
              (8,0,1,2) // Wall at (8,0), size 1x2
            </p>
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download Map Template
            </Button>
          </CardContent>
        </Card>
      )}
      </CardHeader>
      <CardContent>
        <Input type="file" onChange={handleFileUpload} />
      </CardContent>
    </>
  );
}
