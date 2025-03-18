
import React from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface KeyValuePair {
  key: string;
  value: string;
  id: string;
}

interface KeyValueInputProps {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addButtonText?: string;
  className?: string;
}

const KeyValueInput: React.FC<KeyValueInputProps> = ({
  items,
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  addButtonText,
  className,
}) => {
  const generateId = () => `kv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleAdd = () => {
    onChange([...items, { key: "", value: "", id: generateId() }]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleChange = (id: string, field: "key" | "value", value: string) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => (
        <div 
          key={item.id} 
          className="flex items-center gap-2 animate-fade-in stagger-item"
        >
          <Input
            placeholder={keyPlaceholder}
            value={item.key}
            onChange={(e) => handleChange(item.id, "key", e.target.value)}
            className="flex-1 transition-all"
          />
          <Input
            placeholder={valuePlaceholder}
            value={item.value}
            onChange={(e) => handleChange(item.id, "value", e.target.value)}
            className="flex-1 transition-all"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(item.id)}
            className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="mt-2 w-full flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>{addButtonText || `Add ${keyPlaceholder}`}</span>
      </Button>
    </div>
  );
};

export default KeyValueInput;
