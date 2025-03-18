
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import KeyValueInput from "./KeyValueInput";
import ConditionBuilder, { ConditionGroup } from "./ConditionBuilder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import JsonPreview from "./JsonPreview";
import { HTTP_METHODS, RETRY_CASES, generateVendorDSL, formatDSL } from "@/lib/dsl-generator";

interface VendorFormProps {
  className?: string;
}

interface KeyValuePair {
  key: string;
  value: string;
  id: string;
}

const VendorForm: React.FC<VendorFormProps> = ({ className }) => {
  // Form state
  const [vendorName, setVendorName] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>("");
  const [method, setMethod] = useState<string>("POST");
  const [timeout, setTimeout] = useState<string>("");
  
  const [headers, setHeaders] = useState<KeyValuePair[]>([
    { key: "Content-Type", value: "application/json", id: "header-1" }
  ]);
  
  const [retryCases, setRetryCases] = useState<string[]>([]);
  
  const [bodyFields, setBodyFields] = useState<KeyValuePair[]>([
    { key: "id_number", value: "${data.id_number}", id: "body-1" }
  ]);
  
  const [preconditions, setPreconditions] = useState<ConditionGroup[]>([]);
  
  const [responseMappings, setResponseMappings] = useState<ConditionGroup[]>([
    {
      operator: "AND",
      conditions: [
        { key: "${response.status_code}", type: "equals", value: "200", id: "resp-cond-1" }
      ],
      id: "resp-group-1"
    }
  ]);
  
  const [responseTemplate, setResponseTemplate] = useState<KeyValuePair[]>([
    { key: "status", value: "success", id: "template-1" }
  ]);
  
  // Generated JSON
  const [vendorJson, setVendorJson] = useState<string>("");

  const generateVendorJson = () => {
    const formData = {
      vendor: vendorName,
      endpoint,
      method,
      timeout,
      headers,
      retry_cases: retryCases,
      body: bodyFields,
      preconditions,
      response_mappings: responseMappings.map(group => ({
        match: {
          operator: group.operator,
          conditions: group.conditions
        },
        response: {} // This would be filled with response template values
      })),
      response_template: responseTemplate
    };

    const vendorDSL = generateVendorDSL(formData);
    setVendorJson(formatDSL(vendorDSL));
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="request">Request</TabsTrigger>
          <TabsTrigger value="preconditions">Preconditions</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Basic Settings */}
        <TabsContent value="basics">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Basic Configuration</CardTitle>
              <CardDescription>
                Configure the core settings for your vendor DSL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vendor-name">Vendor Name</Label>
                <Input
                  id="vendor-name"
                  placeholder="e.g., surepass_pan_adv"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endpoint">API Endpoint</Label>
                <Input
                  id="endpoint"
                  placeholder="https://api.example.com/v1/verify"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="method">HTTP Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {HTTP_METHODS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout Variable</Label>
                  <Input
                    id="timeout"
                    placeholder="e.g., VENDOR_TIMEOUT"
                    value={timeout}
                    onChange={(e) => setTimeout(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Will be used as ${"{env.VARIABLE_NAME}"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Retry Cases</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {RETRY_CASES.map((caseValue) => (
                    <div key={caseValue} className="flex items-center space-x-2">
                      <Checkbox
                        id={`retry-${caseValue}`}
                        checked={retryCases.includes(caseValue)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setRetryCases([...retryCases, caseValue]);
                          } else {
                            setRetryCases(retryCases.filter((c) => c !== caseValue));
                          }
                        }}
                      />
                      <Label
                        htmlFor={`retry-${caseValue}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {caseValue.replace(/_/g, " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Request Configuration */}
        <TabsContent value="request">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Request Configuration</CardTitle>
              <CardDescription>
                Configure headers and body for the API request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Headers</Label>
                <KeyValueInput
                  items={headers}
                  onChange={setHeaders}
                  keyPlaceholder="Header Name"
                  valuePlaceholder="Header Value"
                />
              </div>

              <div className="space-y-2">
                <Label>Request Body</Label>
                <KeyValueInput
                  items={bodyFields}
                  onChange={setBodyFields}
                  keyPlaceholder="Field Name"
                  valuePlaceholder="Field Value"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use ${"{data.field_name}"} to reference input data
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preconditions */}
        <TabsContent value="preconditions">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Preconditions</CardTitle>
              <CardDescription>
                Define conditions that must be met before making the API request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConditionBuilder
                groups={preconditions}
                onChange={setPreconditions}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Use ${"{request.data.field_name}"} to reference request data
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Handling */}
        <TabsContent value="response">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Response Handling</CardTitle>
              <CardDescription>
                Configure how API responses are processed and mapped
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Response Mappings</Label>
                <ConditionBuilder
                  groups={responseMappings}
                  onChange={setResponseMappings}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use ${"{response.field_name}"} to reference response data
                </p>
              </div>

              <div className="space-y-2">
                <Label>Response Template</Label>
                <KeyValueInput
                  items={responseTemplate}
                  onChange={setResponseTemplate}
                  keyPlaceholder="Field Name"
                  valuePlaceholder="Field Value"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Generate DSL</CardTitle>
              <CardDescription>
                Preview and download the generated vendor.json file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={generateVendorJson} 
                className="w-full"
              >
                Generate vendor.json
              </Button>

              {vendorJson && (
                <div className="mt-6 animate-fade-in">
                  <JsonPreview
                    json={vendorJson}
                    title="vendor.json"
                    filename="vendor.json"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorForm;
