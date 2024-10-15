import { Input } from "./ui/input";

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
}

export default function GridUploader({ setGrid, setRows, setColumns, setGoalCell, setStartCell }: GridUploaderProps) {

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("got here") 
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
    <Input type="file" onChange={handleFileUpload} />
  );
}
