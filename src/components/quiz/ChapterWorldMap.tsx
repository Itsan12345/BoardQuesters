"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X, Lock } from 'lucide-react';

export interface ChapterNode {
  id: string;
  nodeNumber: number;
  title: string;
  subtopic: string;
  minionName: string;
  minionIcon: string;
  miniBossName: string;
  miniBossIcon: string;
  bossName: string;
  bossIcon: string;
}

export interface ChapterWorldMapProps {
  selectedSubject: string;
  subjectNodes: ChapterNode[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  onLaunchExpedition: (nodeId: string, difficulty: 'EASY' | 'MEDIUM' | 'HARD') => void;
  onClose: () => void;
  nodeStars: Record<string, number>;
}

export const ChapterWorldMap: React.FC<ChapterWorldMapProps> = ({
  selectedSubject,
  subjectNodes,
  selectedNodeId,
  onSelectNode,
  onLaunchExpedition,
  onClose,
  nodeStars,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');

  // Node Lock Helper: Node 1 is always unlocked. Node N requires Node N-1 to have >0 stars.
  const isNodeUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    const prevNodeId = subjectNodes[index - 1]?.id;
    return prevNodeId ? (nodeStars[prevNodeId] || 0) > 0 : false;
  };

  const selectedNode = subjectNodes.find(n => n.id === selectedNodeId) || subjectNodes[0];
  const selectedNodeIndex = subjectNodes.findIndex(n => n.id === selectedNode.id);
  const isSelectedUnlocked = isNodeUnlocked(selectedNodeIndex);
  const currentStars = selectedNode ? (nodeStars[selectedNode.id] || 0) : 0;

  return (
    <div className="w-full h-full min-h-screen bg-[#160d08] text-white p-3 sm:p-6 font-bytebounce relative animate-in fade-in duration-200 overflow-hidden flex flex-col justify-between">

      {/* Top Parchment Header Bar */}
      <div className="flex items-center justify-between border-b-2 sm:border-b-4 border-[#4a2e16] pb-2 sm:pb-3 mb-2 sm:mb-3 shrink-0 gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-base min-[375px]:text-lg sm:text-4xl text-amber-400 tracking-wider leading-tight truncate drop-shadow-[2px_2px_0_#000]">
            {selectedSubject} Overworld Trail
          </h2>
          <p className="text-[9px] min-[375px]:text-[11px] sm:text-sm text-amber-200/80 font-sans mt-0.5 leading-tight truncate sm:whitespace-normal">
            Master Chapter 1 to unlock subsequent expedition chapters along the path!
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="hidden min-[375px]:inline-flex bg-amber-500/20 text-amber-300 border-amber-500/50 text-[10px] sm:text-sm px-3 py-1 uppercase font-mono shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            ⭐ PROGRESSION MODE
          </Badge>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#4a2e16] border-2 border-amber-400 text-amber-200 flex items-center justify-center text-base sm:text-xl font-bold hover:bg-red-600 hover:text-white transition-colors shadow-lg"
          >
            <X className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* 16-Bit Horizontal Trail Node Track Canvas */}
      <div className="relative w-full flex-1 bg-[#23170c] border-4 sm:border-6 border-[#4a2e16] rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl flex flex-col justify-center overflow-x-auto sm:overflow-hidden no-scrollbar my-2.5 sm:my-4">

        {/* Background Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#3e2b19] via-[#24170d] to-[#120a05] opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3a2514_1px,transparent_1px),linear-gradient(to_bottom,#3a2514_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:24px_24px] opacity-25" />

        {/* Horizontal Connecting Nodes Track */}
        <div className="relative z-10 flex items-center justify-between gap-1.5 sm:gap-4 my-1 sm:my-2 px-1 sm:px-6 min-w-[310px] sm:min-w-0">
          {subjectNodes.map((node, index) => {
            const unlocked = isNodeUnlocked(index);
            const stars = nodeStars[node.id] || 0;
            const isSelected = selectedNodeId === node.id;
            const isBossNode = index === subjectNodes.length - 1;

            return (
              <React.Fragment key={node.id}>
                {/* Horizontal Connecting Connector Line */}
                {index > 0 && (
                  <div className="flex-1 h-1.5 sm:h-2 min-w-[10px] sm:min-w-0 relative flex items-center">
                    <div
                      className={cn(
                        "w-full h-1 sm:h-1.5 rounded-full transition-all duration-500",
                        unlocked
                          ? "bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                          : "bg-[#382618] border border-dashed border-[#5c3e21]"
                      )}
                    />
                  </div>
                )}

                {/* Node Pin Marker */}
                <div
                  onClick={() => onSelectNode(node.id)}
                  className="flex flex-col items-center cursor-pointer group relative z-20 shrink-0"
                >
                  {/* Floating Star Badges above Node */}
                  <div className="flex items-center gap-0.5 bg-black/80 px-1 sm:px-1.5 py-0.5 rounded-full border border-amber-500/40 shadow-md mb-0.5 sm:mb-1">
                    {[1, 2, 3].map((s) => (
                      <span key={s} className={cn("text-[8px] sm:text-xs", s <= stars ? "text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.8)]" : "text-slate-600 opacity-40")}>
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Node Button Icon */}
                  <div
                    className={cn(
                      "w-9 h-9 min-[375px]:w-10 min-[375px]:h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-sm min-[375px]:text-base sm:text-2xl border-2 sm:border-4 font-mono transition-all duration-200 shadow-xl group-hover:scale-105 relative",
                      !unlocked
                        ? "bg-[#1a120c] border-[#4a321d] text-slate-500 opacity-60"
                        : isSelected
                          ? "bg-gradient-to-b from-amber-400 to-amber-600 border-amber-200 text-black scale-105 shadow-[0_0_12px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/60"
                          : stars > 0
                            ? "bg-[#2d4327] border-emerald-400 text-emerald-200 hover:border-amber-400"
                            : "bg-[#251b14] border-[#6b4728] text-amber-200 hover:border-amber-400"
                    )}
                  >
                    {!unlocked ? (
                      <Lock className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-slate-400" />
                    ) : (
                      <span>{isBossNode ? (node.bossIcon || '👑') : node.nodeNumber}</span>
                    )}
                  </div>

                  {/* Node Title Badge */}
                  <div className={cn(
                    "mt-0.5 sm:mt-1 px-1 sm:px-1.5 py-0.5 rounded text-[8px] min-[375px]:text-[9px] sm:text-[11px] font-bold tracking-tight text-center transition-all whitespace-nowrap",
                    !unlocked
                      ? "text-slate-500"
                      : isSelected
                        ? "bg-amber-500 text-black font-black"
                        : "text-amber-300/80 group-hover:text-amber-200"
                  )}>
                    {unlocked ? `Ch. ${node.nodeNumber}` : `🔒 Ch. ${node.nodeNumber}`}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

      </div>

      {/* Bottom Selected Node Parchment Inspection & Launch Panel */}
      {selectedNode && (
        <div className="mt-2 sm:mt-2.5 bg-[#2a1c10] border-2 sm:border-4 border-[#5c3e21] p-2.5 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 sm:gap-3 shadow-2xl relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="space-y-1 min-w-0 flex-1 relative z-10">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 font-mono",
                  isSelectedUnlocked
                    ? "bg-amber-500/20 text-amber-300 border-amber-400/50"
                    : "bg-red-500/20 text-red-400 border-red-500/50"
                )}
              >
                {isSelectedUnlocked ? `CHAPTER #${selectedNode.nodeNumber} UNLOCKED` : `🔒 CHAPTER #${selectedNode.nodeNumber} LOCKED`}
              </Badge>
              <h3 className="text-xs sm:text-xl font-bold text-amber-400 tracking-wider leading-tight truncate">{selectedNode.title}</h3>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3].map((s) => (
                  <span key={s} className={cn("text-[10px] sm:text-sm", s <= currentStars ? "text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" : "text-slate-600 opacity-40")}>
                    ★
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[9px] sm:text-xs text-amber-100/90 font-sans leading-snug line-clamp-2 sm:line-clamp-none">{selectedNode.subtopic}</p>

            <div className="flex items-center gap-1 sm:gap-2 text-[8.5px] sm:text-xs text-amber-300/80 font-mono pt-0.5 flex-wrap">
              <span className="bg-black/50 px-1.5 sm:px-2 py-0.5 rounded border border-white/10">👾 {selectedNode.minionName}</span>
              <span>➔</span>
              <span className="bg-black/50 px-1.5 sm:px-2 py-0.5 rounded border border-white/10">👹 {selectedNode.miniBossName}</span>
              <span>➔</span>
              <span className="bg-black/50 px-1.5 sm:px-2 py-0.5 rounded border border-amber-500/40 text-amber-300 font-bold">👑 {selectedNode.bossName}</span>
            </div>
          </div>

          {/* Difficulty Selector & Launch Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto relative z-10">
            {isSelectedUnlocked && (
              <div className="flex items-center bg-black/60 p-0.5 sm:p-1 rounded-xl border border-amber-500/30 w-full sm:w-auto justify-stretch sm:justify-center">
                {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={cn(
                      "flex-1 sm:flex-none px-2 sm:px-2.5 py-1 text-[9px] sm:text-xs font-mono rounded-lg transition-all uppercase font-bold text-center",
                      selectedDifficulty === diff
                        ? diff === 'EASY' ? "bg-emerald-500 text-black shadow-md" : diff === 'HARD' ? "bg-red-500 text-white shadow-md" : "bg-amber-500 text-black shadow-md"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            )}

            <Button
              size="lg"
              disabled={!isSelectedUnlocked}
              onClick={() => isSelectedUnlocked && onLaunchExpedition(selectedNode.id, selectedDifficulty)}
              className={cn(
                "w-full sm:w-auto font-bytebounce text-xs sm:text-sm uppercase tracking-wider h-9 sm:h-11 px-4 sm:px-5 border-2 shrink-0 active:scale-95 transition-transform",
                isSelectedUnlocked
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black border-yellow-200 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                  : "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-70"
              )}
            >
              {isSelectedUnlocked ? "LAUNCH EXPEDITION ⚔️" : "🔒 LOCKED (Master Prev Chapter)"}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChapterWorldMap;
