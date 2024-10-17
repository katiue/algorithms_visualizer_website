"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
  isLoading: boolean
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center">
        <motion.svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotateY: [0, 180, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 2V22" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 4C5 4 8 8 12 8C16 8 19 4 19 4" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 20C5 20 8 16 12 16C16 16 19 20 19 20" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" />
          <motion.path
            d="M5 4C5 4 8 8 12 8C16 8 19 4 19 4"
            stroke="#ED8936"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M5 20C5 20 8 16 12 16C16 16 19 20 19 20"
            stroke="#ED8936"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
        <p className="text-xl font-semibold text-gray-800 mt-4">Processing...</p>
      </div>
    </div>
  )
}