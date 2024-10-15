import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
type CellType = 'empty' | 'wall' | 'start' | 'goal' | 'traversed' | 'path'

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

interface MapProps {
  onMapClick: (props: GridProps) => void
}

const Maplibrary = [
    {
        sizex: 4,
        sizey: 4,
        grid: [
        [{ type: 'empty' as CellType, x: 0, y: 0 }, { type: 'empty' as CellType, x: 1, y: 0 }, { type: 'wall' as CellType, x: 2, y: 0 }, { type: 'wall' as CellType, x: 3, y: 0 }],
        [{ type: 'empty' as CellType, x: 0, y: 1 }, { type: 'empty' as CellType, x: 1, y: 1 }, { type: 'empty' as CellType, x: 2, y: 1 }, { type: 'empty' as CellType, x: 3, y: 1 }],
        [{ type: 'empty' as CellType, x: 0, y: 2 }, { type: 'wall' as CellType, x: 1, y: 2 }, { type: 'empty' as CellType, x: 2, y: 2 }, { type: 'empty' as CellType, x: 3, y: 2 }],
        [{ type: 'empty' as CellType, x: 0, y: 3 }, { type: 'empty' as CellType, x: 1, y: 3 }, { type: 'empty' as CellType, x: 2, y: 3 }, { type: 'empty' as CellType, x: 3, y: 3 }]
        ]
    },
    {
        sizex: 5,
        sizey: 4,
        grid: [
        [{ type: 'empty' as CellType, x: 0, y: 0 }, { type: 'empty' as CellType, x: 1, y: 0 }, { type: 'empty' as CellType, x: 2, y: 0 }, { type: 'empty' as CellType, x: 3, y: 0 }, { type: 'empty' as CellType, x: 4, y: 0 }],
        [{ type: 'empty' as CellType, x: 0, y: 1 }, { type: 'empty' as CellType, x: 1, y: 1 }, { type: 'wall' as CellType, x: 2, y: 1 }, { type: 'empty' as CellType, x: 3, y: 1 }, { type: 'empty' as CellType, x: 4, y: 1 }],
        [{ type: 'empty' as CellType, x: 0, y: 2 }, { type: 'empty' as CellType, x: 1, y: 2 }, { type: 'empty' as CellType, x: 2, y: 2 }, { type: 'wall' as CellType, x: 3, y: 2 }, { type: 'empty' as CellType, x: 4, y: 2 }],
        [{ type: 'empty' as CellType, x: 0, y: 3 }, { type: 'empty' as CellType, x: 1, y: 3 }, { type: 'empty' as CellType, x: 2, y: 3 }, { type: 'wall' as CellType, x: 3, y: 3 }, { type: 'empty' as CellType, x: 4, y: 3 }]
        ]
    }
]
export default function PredefinedMap( {onMapClick}: MapProps ) {
    return (
        <div>
            {Maplibrary.map((map, index) => (
            <Card key={index} onClick={() => onMapClick(map)} >
                <CardHeader>
                    <CardTitle>Size {map.sizex} x {map.sizey}</CardTitle>
                </CardHeader>
                <CardContent>
                {map.grid.map((row, y) =>
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
                    />
                ))}
                </div>
                )}
                </CardContent>
            </Card>))}
        </div>
    );

}