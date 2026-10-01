import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
  key?: React.Key;
}

export const Skeleton = ({ 
  className = "", 
  variant = 'rectangular', 
  width, 
  height 
}: SkeletonProps) => {
  const baseClasses = "bg-slate-200 animate-pulse transition-all duration-700 ease-in-out";
  const variantClasses = {
    rectangular: "rounded-xl",
    circular: "rounded-full",
    text: "rounded-md h-4 w-full"
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-[48px] border border-slate-100 p-8 shadow-sm flex flex-col gap-6 w-full">
    <Skeleton height={200} className="w-full rounded-[32px]" />
    <div className="space-y-3">
      <Skeleton width="70%" height={24} />
      <Skeleton width="40%" height={16} />
    </div>
    <div className="space-y-2 mt-2">
      <Skeleton className="h-12 w-full rounded-2xl" />
      <Skeleton className="h-12 w-full rounded-2xl" />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4 w-full">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-grow space-y-2">
          <Skeleton width="30%" height={16} />
          <Skeleton width="60%" height={12} />
        </div>
      </div>
    ))}
  </div>
);

export const DashboardOverviewSkeleton = () => (
  <div className="space-y-12 animate-in fade-in duration-500">
    {/* Stats Row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
          <Skeleton variant="circular" width={48} height={48} className="bg-indigo-50" />
          <div className="space-y-2">
            <Skeleton width="40%" height={12} />
            <Skeleton width="70%" height={24} />
          </div>
        </div>
      ))}
    </div>

    {/* Section Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton width="30%" height={24} />
          <Skeleton width="15%" height={24} />
        </div>
        <ListSkeleton count={4} />
      </div>
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton width="30%" height={24} />
          <Skeleton width="15%" height={24} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={100} className="rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);
