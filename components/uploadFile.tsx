
import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { File, CheckCircle, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Download, InfoIcon, X } from "lucide-react";


type CellType = 'empty' | 'start' | 'goal' | 'wall';

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
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [isHovered, setIsHovered] = useState(false)

  const handleFileUpload = async (file: File) => {
    Reset();
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseFileContent(text);
    };
    reader.readAsText(file);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0]
    setFile(uploadedFile)
    setUploadStatus('uploading')
    try {
      await handleFileUpload(uploadedFile)
      setUploadStatus('success')
    } catch (error) {
      console.error('File upload failed:', error)
      setUploadStatus('error')
    }
  }, [handleFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    multiple: false
  })

  const resetUpload = () => {
    setFile(null)
    setUploadProgress(0)
    setUploadStatus('idle')
  }

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
    setStartCell({ type: 'start' as CellType, x: start.startX, y: start.startY });
    const newGrid: Cell[][] = Array.from({ length: rows }, (_, y) =>
      Array.from({ length: cols }, (_, x) => ({ type: 'empty', x, y }))
    );
  
    // Helper function to check if a cell is within grid bounds
    const isInBounds = (x: number, y: number) => x >= 0 && x < cols && y >= 0 && y < rows;
  
    // Set start position if within bounds
    if (isInBounds(start.startX, start.startY)) {
      const cell = newGrid[start.startY][start.startX]; // Correct order of accessing the grid
      cell.type = 'start' as CellType;
      setStartCell(cell);
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
        <Card className="absolute top-10 z-40">
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
      <AnimatePresence mode="wait">
        {uploadStatus === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 200 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              height: isHovered ? 240 : 200 
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex flex-col justify-center items-center"
            {...getRootProps() as any}
          >
            <input {...getInputProps()} />
            
            {/* Image switching */}
            <motion.img
              src={isHovered ? "/cat-open.png" : "/cat-closed.png"}
              alt="Dragon animation"
              className="w-24 h-24 mb-4"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            />

            <motion.p 
              className="mt-2 text-sm text-gray-600"
              animate={{ fontSize: isHovered ? "1.1rem" : "0.875rem" }}
            >
              {isDragActive
                ? "Drop the file here"
                : "Drag 'n' drop a file here, or click to select a file"}
            </motion.p>
            <motion.p 
              className="mt-1 text-xs text-gray-500"
              animate={{ opacity: isHovered ? 1 : 0.7 }}
            >
              Supported file types: TXT
            </motion.p>
          </motion.div>
        )}

        {(uploadStatus === 'uploading' || uploadStatus === 'success' || uploadStatus === 'error') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="border-2 border-gray-300 rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <File className="h-8 w-8 text-blue-500 mr-3" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {file?.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                </p>
              </div>
              {uploadStatus === 'success' && (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
              {uploadStatus === 'error' && (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
            </div>

            {uploadStatus === 'uploading' && (
              <Progress value={uploadProgress} className="w-full" />
            )}

            {uploadStatus === 'success' && (
              <p className="text-sm text-green-600 mt-2">File uploaded successfully!</p>
            )}

            {uploadStatus === 'error' && (
              <p className="text-sm text-red-600 mt-2">Error uploading file. Please try again.</p>
            )}

            <Button onClick={resetUpload} className="mt-4 w-full">
              Upload Another File
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      </CardContent>
    </>
  );
}
