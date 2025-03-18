
import React, { useEffect, useRef } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface JsonPreviewProps {
  json: string;
  title: string;
  filename: string;
  className?: string;
}

const JsonPreview: React.FC<JsonPreviewProps> = ({
  json,
  title,
  filename,
  className,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = useRef<number | null>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `${title} has been copied to your clipboard.`,
        duration: 2000,
      });

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "File downloaded",
      description: `${filename} has been downloaded.`,
      duration: 2000,
    });
  };

  return (
    <div className={cn("rounded-md border overflow-hidden", className)}>
      <div className="bg-muted/50 px-4 py-3 flex items-center justify-between border-b">
        <h3 className="font-medium text-sm">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy to clipboard</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download {title}</span>
          </Button>
        </div>
      </div>
      <pre
        ref={preRef}
        className="p-4 text-sm overflow-auto max-h-[400px] bg-card/50"
      >
        <code>{json}</code>
      </pre>
    </div>
  );
};

export default JsonPreview;
