import { FC } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MapIcon, BookCopy, RefreshCcw, CirclePlay } from 'lucide-react';

interface ToolsBarProps {
    sizex: number;
    sizey: number;
    setSizeX: (value: number) => void;
    setSizeY: (value: number) => void;
    algorithm: string;
    setAlgorithm: (value: string) => void;
    handleStart: () => void;
    Reset: () => void;
    delay: number;
    setDelay: (value: number) => void;
    changeLeftSection: (value: number) => void;
}

const ToolsBar: FC<ToolsBarProps> = ({
    sizex, sizey, setSizeX, setSizeY, algorithm, setAlgorithm, handleStart, Reset, delay, setDelay, changeLeftSection
}) => {
    return (
        <div className='flex gap-5'>
        {/* Size input */}
        <div className='flex flex-col justify-end'>
          <h2>X size:</h2>
          <Input
            type="number"
            value={sizex}
            onChange = {(e) => setSizeX(Number(e.target.value))}
            min = {1}
            />
          <h2>Y size:</h2>
          <Input
            type="number"
            value={sizey}
            onChange = {(e) => setSizeY(Number(e.target.value))}
            min = {1}
            />
          <h2>Delay:</h2>
          <Input
            type="number"
            value={delay}
            onChange = {(e) => { setDelay(Number(e.target.value)); Reset(); }}
            min = {0}
            />
        </div>

        <div className="flex flex-col items-center space-y-5 justify-center">
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bfs">Breadth-First Search</SelectItem>
              <SelectItem value="dfs">Depth-First Search</SelectItem>
              <SelectItem value="astar">A* Search</SelectItem>
              <SelectItem value="gbfs">Greedy Best-First Search</SelectItem>
              <SelectItem value="bdfs">Bidirectional Depth-First Search</SelectItem>
              <SelectItem value="ida">IDA* Search</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleStart} className='w-full justify-between'><CirclePlay />Start<div></div></Button>
        </div>
        <div className="flex flex-col items-center space-y-5 justify-end">
        <Button onClick={Reset} className='w-full h-full justify-between'><RefreshCcw />Reset<div></div></Button>
        <Button onClick={() => changeLeftSection(0)} className='w-full h-full justify-between'><MapIcon />Map Input<div></div></Button>
        <Button onClick={() => changeLeftSection(1)} className='w-full h-full justify-between'><BookCopy />Form/File Input<div></div></Button>
        </div>
      </div>
)}

export default ToolsBar;