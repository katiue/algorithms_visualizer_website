// // Node class remains the same
// export class Node {
//     x: number;
//     y: number;
//     parent: Node | null;
//     pathCost: number;
//     heuristicCost: number;

//     constructor(x: number, y: number, parent: Node | null = null, pathCost: number = 0, heuristicCost: number = 0) {
//         this.x = x;
//         this.y = y;
//         this.parent = parent;
//         this.pathCost = pathCost;
//         this.heuristicCost = heuristicCost;
//     }

//     isEqual(other: Node): boolean {
//         return this.x === other.x && this.y === other.y;
//     }

//     totalCost(): number {
//         return this.pathCost + this.heuristicCost;
//     }
// }

// // Utility for neighbor nodes
// function getNeighbors(pos: [number, number], grid: Grid): [number, number][] {
//     const neighbors: [number, number][] = [];
//     const directions = [
//         [0, -1],  // Up
//         [0, 1],   // Down
//         [-1, 0],  // Left
//         [1, 0]    // Right
//     ];

//     for (const [dx, dy] of directions) {
//         const newX = pos[0] + dx;
//         const newY = pos[1] + dy;
//         if (grid.isValid(newX, newY)) {
//             neighbors.push([newX, newY]);
//         }
//     }
//     return neighbors;
// }

// // Heuristic function for A* and GBFS (Manhattan distance)
// function manhattanDistance(node: Node, goal: [number, number]): number {
//     return Math.abs(node.x - goal[0]) + Math.abs(node.y - goal[1]);
// }

// // Reconstruct path for all algorithms
// function reconstructPath(node: Node | null): [number, number][] {
//     const path: [number, number][] = [];
//     while (node !== null) {
//         path.push([node.x, node.y]);
//         node = node.parent;
//     }
//     return path.reverse();
// }
// export function bfs(grid: Grid, start: [number, number], goal: [number, number]): { path: [number, number][] | null; traversed: [number, number][] } {
//     const frontier: Node[] = [new Node(start[0], start[1])];
//     const visited = new Set<string>();
//     visited.add(start.toString());

//     const traversed: [number, number][] = [];

//     while (frontier.length > 0) {
//         const currentNode = frontier.shift()!;
//         traversed.push([currentNode.x, currentNode.y]);

//         if (currentNode.isEqual(new Node(goal[0], goal[1]))) {
//             return { path: reconstructPath(currentNode), traversed };
//         }

//         for (const neighbor of getNeighbors([currentNode.x, currentNode.y], grid)) {
//             if (!visited.has(neighbor.toString())) {
//                 visited.add(neighbor.toString());
//                 frontier.push(new Node(neighbor[0], neighbor[1], currentNode));
//             }
//         }
//     }
//     return { path: null, traversed };
// }
// export function dfs(grid: Grid, start: [number, number], goal: [number, number]): { path: [number, number][] | null; traversed: [number, number][] } {
//     const frontier: Node[] = [new Node(start[0], start[1])];
//     const visited = new Set<string>();
//     visited.add(start.toString());

//     const traversed: [number, number][] = [];

//     while (frontier.length > 0) {
//         const currentNode = frontier.pop()!;
//         traversed.push([currentNode.x, currentNode.y]);

//         if (currentNode.isEqual(new Node(goal[0], goal[1]))) {
//             return { path: reconstructPath(currentNode), traversed };
//         }

//         for (const neighbor of getNeighbors([currentNode.x, currentNode.y], grid)) {
//             if (!visited.has(neighbor.toString())) {
//                 visited.add(neighbor.toString());
//                 frontier.push(new Node(neighbor[0], neighbor[1], currentNode));
//             }
//         }
//     }
//     return { path: null, traversed };
// }
// export function aStar(grid: Grid, start: [number, number], goal: [number, number]): { path: [number, number][] | null; traversed: [number, number][] } {
//     const frontier: Node[] = [new Node(start[0], start[1], null, 0, manhattanDistance(new Node(start[0], start[1]), goal))];
//     const visited = new Set<string>();
//     visited.add(start.toString());

//     const traversed: [number, number][] = [];

//     while (frontier.length > 0) {
//         frontier.sort((a, b) => a.totalCost() - b.totalCost());
//         const currentNode = frontier.shift()!;
//         traversed.push([currentNode.x, currentNode.y]);

//         if (currentNode.isEqual(new Node(goal[0], goal[1]))) {
//             return { path: reconstructPath(currentNode), traversed };
//         }

//         for (const neighbor of getNeighbors([currentNode.x, currentNode.y], grid)) {
//             if (!visited.has(neighbor.toString())) {
//                 visited.add(neighbor.toString());
//                 const newCost = currentNode.pathCost + 1;
//                 const heuristic = manhattanDistance(new Node(neighbor[0], neighbor[1]), goal);
//                 frontier.push(new Node(neighbor[0], neighbor[1], currentNode, newCost, heuristic));
//             }
//         }
//     }
//     return { path: null, traversed };
// }
// export function gbfs(grid: Grid, start: [number, number], goal: [number, number]): { path: [number, number][] | null; traversed: [number, number][] } {
//     const frontier: Node[] = [new Node(start[0], start[1], null, 0, manhattanDistance(new Node(start[0], start[1]), goal))];
//     const visited = new Set<string>();
//     visited.add(start.toString());

//     const traversed: [number, number][] = [];

//     while (frontier.length > 0) {
//         frontier.sort((a, b) => a.heuristicCost - b.heuristicCost);
//         const currentNode = frontier.shift()!;
//         traversed.push([currentNode.x, currentNode.y]);

//         if (currentNode.isEqual(new Node(goal[0], goal[1]))) {
//             return { path: reconstructPath(currentNode), traversed };
//         }

//         for (const neighbor of getNeighbors([currentNode.x, currentNode.y], grid)) {
//             if (!visited.has(neighbor.toString())) {
//                 visited.add(neighbor.toString());
//                 frontier.push(new Node(neighbor[0], neighbor[1], currentNode, 0, manhattanDistance(new Node(neighbor[0], neighbor[1]), goal)));
//             }
//         }
//     }
//     return { path: null, traversed };
// }
