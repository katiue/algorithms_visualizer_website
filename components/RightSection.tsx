"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const algorithms = [
  {
    id: "bfs",
    name: "Breadth-First Search (BFS)",
    timeComplexity: "O(V + E)",
    memorySpace: "O(V)",
    description: "BFS explores all the vertices of a graph or all the nodes of a tree level by level. It uses a queue data structure to keep track of the nodes to be explored."
  },
  {
    id: "dfs",
    name: "Depth-First Search (DFS)",
    timeComplexity: "O(V + E)",
    memorySpace: "O(V)",
    description: "DFS explores as far as possible along each branch before backtracking. It uses a stack (or recursion) to keep track of the nodes to be explored."
  },
  {
    id: "gbfs",
    name: "Greedy Best-First Search (GBFS)",
    timeComplexity: "O(b^d)",
    memorySpace: "O(b^d)",
    description: "GBFS is a best-first search algorithm that uses a heuristic function to determine which node to explore next. It always chooses the node that appears to be closest to the goal."
  },
  {
    id: "astar",
    name: "A* Search",
    timeComplexity: "O(b^d)",
    memorySpace: "O(b^d)",
    description: "A* is a best-first search algorithm that finds the least-cost path from a start node to a goal node. It uses both the cost to reach the node and a heuristic estimate of the cost to the goal."
  },
  {
    id: "bdfs",
    name: "Bidirectional DFS",
    timeComplexity: "O(b^(d/2))",
    memorySpace: "O(b^(d/2))",
    description: "Bidirectional DFS performs two simultaneous depth-first searches: one forward from the initial state and one backward from the goal state, stopping when the two meet in the middle."
  },
  {
    id: "ida",
    name: "Iterative Deepening A* (IDA*)",
    timeComplexity: "O(b^d)",
    memorySpace: "O(d)",
    description: "IDA* is a depth-first variant of A* that performs a series of depth-limited searches with increasing depth limits. It combines the space-efficiency of DFS with the completeness of BFS."
  }
]

export default function AlgorithmComparison({ algorithm }: { algorithm: string }) {
  const selectedAlgorithm = algorithms.find((algo) => algo.id === algorithm) || algorithms[0];
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{selectedAlgorithm.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Time Complexity:</h3>
              <p>{selectedAlgorithm.timeComplexity}</p>
            </div>
            <div>
              <h3 className="font-semibold">Memory Space:</h3>
              <p>{selectedAlgorithm.memorySpace}</p>
            </div>
            <div>
              <h3 className="font-semibold">Description:</h3>
              <p>{selectedAlgorithm.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Algorithm Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Algorithm</TableHead>
                <TableHead>Time Complexity</TableHead>
                <TableHead>Memory Space</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {algorithms.map((algo) => (
                <TableRow key={algo.name}>
                  <TableCell className="font-medium">{algo.name}</TableCell>
                  <TableCell>{algo.timeComplexity}</TableCell>
                  <TableCell>{algo.memorySpace}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardContent>
        <CardTitle>V — Vertices</CardTitle>Nodes in a graph
        <CardTitle>E — Edges</CardTitle>Connections between nodes
        <CardTitle>d — Depth</CardTitle>Depth of a graph or tree
        <CardTitle>b — Branching Factor</CardTitle>Average number of children per node
        <CardTitle>n — Input Size</CardTitle>Length of an array, list
        <CardTitle>m — Problem Size</CardTitle>A specific aspect of the problem being solved
        </CardContent>
      </Card>
    </div>
  )
}