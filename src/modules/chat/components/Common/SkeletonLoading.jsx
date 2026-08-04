"use client";

import React from "react";

// Sidebar Item Skeleton
export function SidebarSkeleton() {
  return (
    <div className="space-y-4 p-3 w-full animate-in fade-in duration-200">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <div className="h-8 w-8 rounded-full animate-shimmer flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-200 rounded-full animate-shimmer w-1/3" />
            <div className="h-2 bg-slate-200 rounded-full animate-shimmer w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Chat Timeline Messages Skeleton
export function MessagesSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-hidden w-full animate-in fade-in duration-200">
      {[1, 2, 3, 4].map((i) => {
        const isRight = i % 2 === 0;
        return (
          <div
            key={i}
            className={`flex items-end gap-3 ${isRight ? "flex-row-reverse" : "flex-row"}`}
          >
            {!isRight && <div className="h-9 w-9 rounded-full animate-shimmer flex-shrink-0" />}
            <div className={`flex flex-col space-y-1.5 max-w-[60%] ${isRight ? "items-end" : "items-start"}`}>
              {!isRight && <div className="h-2.5 bg-slate-200 rounded-full animate-shimmer w-24" />}
              <div
                className={`h-16 rounded-[18px] w-48 md:w-64 animate-shimmer ${
                  isRight ? "bg-blue-200 rounded-br-[4px]" : "bg-slate-200 rounded-bl-[4px]"
                }`}
              />
            </div>
            {isRight && <div className="h-9 w-9 rounded-full animate-shimmer flex-shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}

// Chat Header Skeleton
export function HeaderSkeleton() {
  return (
    <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between w-full animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full animate-shimmer flex-shrink-0" />
        <div className="space-y-1.5">
          <div className="h-3.5 bg-slate-200 rounded-full animate-shimmer w-36" />
          <div className="h-2.5 bg-slate-200 rounded-full animate-shimmer w-24" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-8 rounded-lg animate-shimmer" />
        <div className="h-8 w-8 rounded-lg animate-shimmer" />
      </div>
    </div>
  );
}
