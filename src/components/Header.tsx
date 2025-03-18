
import React from "react";
import { cn } from "@/lib/utils";
import { FileJson } from "lucide-react";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header
      className={cn(
        "w-full py-6 px-8 flex items-center justify-between border-b animate-fade-in",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileJson className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-medium tracking-tight">Vendor DSL Generator</h1>
          <p className="text-sm text-muted-foreground">
            Create vendor.json and config.json files with ease
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
