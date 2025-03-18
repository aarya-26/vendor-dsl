
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import VendorForm from "@/components/VendorForm";
import ValidationForm from "@/components/ValidationForm";
import { cn } from "@/lib/utils";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("vendor");

  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      <Header />

      <main className="flex-1 container max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Vendor DSL UI Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Create standardized DSL configurations in minutes, not hours. 
            Simplify your workflow with our intuitive interface.
          </p>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden border float-shadow animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vendor" className="text-base py-3">
                  vendor.json
                </TabsTrigger>
                <TabsTrigger value="config" className="text-base py-3">
                  config.json
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="vendor" className={cn(activeTab === "vendor" ? "animate-fade-in" : "")}>
                <VendorForm />
              </TabsContent>

              <TabsContent value="config" className={cn(activeTab === "config" ? "animate-fade-in" : "")}>
                <ValidationForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Vendor DSL UI Generator &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
