import React from 'react';
import { motion } from 'framer-motion';
import { FaServer, FaCircle } from 'react-icons/fa';

const PALETTE = ['#2ee6a6', '#ff8f3f', '#a78bfa', '#38bdf8', '#fb7185'];

function ContainerCard({ containerId, updatedAt, onClick }) {

  // stable hash-based color
  const hash = containerId
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const color = PALETTE[hash % PALETTE.length];

  const shortId = containerId.slice(0, 12);

  function timeAgo(dateString) {
    if (!dateString) return "Unknown";

    const past = new Date(dateString);
    if (isNaN(past.getTime())) return "Unknown";

    const now = new Date();
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-midnight-800/60 p-6 backdrop-blur"
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: color }}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10"
          style={{ boxShadow: `0 0 16px ${color}55` }}
        >
          <FaServer style={{ color }} />
        </div>

        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          <FaCircle style={{ color, fontSize: 6 }} />
          Active
        </span>
      </div>

      {/* ID */}
      <div className="mt-5">
        <p className="text-xs text-slate-400">Container ID</p>
        <p className="font-mono text-sm font-semibold" style={{ color }}>
          {shortId}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs text-slate-400">Last Connected</span>
        <span className="text-xs text-slate-300">
          {timeAgo(updatedAt)}
        </span>
      </div>
    </motion.div>
  );
}

export default ContainerCard;