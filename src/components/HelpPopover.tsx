
import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface HelpPopoverProps {
  examples: string[];
  title: string;
}

export const HelpPopover: React.FC<HelpPopoverProps> = ({ examples, title }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-white border border-gray-200 shadow-lg rounded-lg">
        <div className="space-y-3">
          <h4 className="font-semibold text-blue-900 text-sm">
            Voorbeelden voor "{title}"
          </h4>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <div
                key={index}
                className="text-sm text-gray-700 p-2 bg-blue-50 rounded border-l-3 border-l-blue-500"
              >
                {example}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
