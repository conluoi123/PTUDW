import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

export const Pagination = ({ 
    currentPage, 
    onPageChange, 
    hasNext, 
    hasPrevious, 
    className = "" 
}) => {
    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={!hasPrevious && currentPage <= 1}
                className="h-8 w-8 rounded-full"
            >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous</span>
            </Button>
            
            <span className="text-sm font-medium min-w-[3rem] text-center">
                Page {currentPage}
            </span>
            
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext}
                className="h-8 w-8 rounded-full"
            >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next</span>
            </Button>
        </div>
    );
};
