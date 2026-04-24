"use client"

import { motion } from "framer-motion"
import { Toast } from "./ToastContext"

export default function ToastItem({ toast }: { toast: Toast }) {

  const baseStyle =
    "px-5 py-3 rounded-xl shadow-md text-sm font-medium flex items-center gap-3 backdrop-blur-md border"

  const variants = {
    success: "bg-white text-black border-gray-200",
    error: "bg-black text-white border-black",
    info: "bg-white text-black border-gray-300"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ duration: 0.25 }}
      className={`${baseStyle} ${variants[toast.type]}`}
    >
      
      {/* ICON CSS */}
      <span
        className={`
          w-4 h-4 flex items-center justify-center
          ${toast.type === "success" && "border border-black rounded-full"}
          ${toast.type === "error" && "bg-white rounded-sm"}
          ${toast.type === "info" && "border border-black"}
        `}
      >
        <span
          className={`
            block
            ${toast.type === "success" && "w-2 h-2 bg-black rounded-full"}
            ${toast.type === "error" && "w-2 h-0.5 bg-black rotate-45"}
            ${toast.type === "info" && "w-0.5 h-2 bg-black"}
          `}
        />
      </span>

      {/* MESSAGE */}
      <span className="text-[14px] leading-tight">
        {toast.message}
      </span>

    </motion.div>
  )
}