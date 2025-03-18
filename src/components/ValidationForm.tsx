
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConditionBuilder, { ConditionGroup } from "./ConditionBuilder";
import { ConfigDSL, generateConfigDSL, formatDSL } from "@/lib/dsl-generator";
import JsonPreview from "./JsonPreview";
import { cn } from "@/lib/utils";

interface ValidationFormProps {
  className?: string;
}

interface ValidationError {
  error_code: string;
  error_message: string;
  id: string;
}

const ValidationForm: React.FC<ValidationFormProps> = ({ className }) => {
  const [validationGroups, setValidationGroups] = useState<(ConditionGroup & ValidationError)[]>([
    {
      operator: "AND",
      conditions: [
        {
          key: "data.id_number",
          type: "matches",
          value: "^\\d+$",
          id: "initial-condition",
          negate: false,
          mandatory: true,
        },
      ],
      id: "initial-group",
      error_code: "PE_INVALID_ID_NUMBER",
      error_message: "Please provide a valid ID Number.",
    },
  ]);
  
  const [additionalValidations, setAdditionalValidations] = useState(false);
  const [configJson, setConfigJson] = useState<string>("");

  const handleGroupsChange = (groups: ConditionGroup[]) => {
    setValidationGroups(
      groups.map((group) => {
        // Find existing error info or create default
        const existing = validationGroups.find((vg) => vg.id === group.id);
        return {
          ...group,
          error_code: existing?.error_code || "VALIDATION_ERROR",
          error_message: existing?.error_message || "Validation failed.",
        };
      })
    );
  };

  const handleErrorInfoChange = (
    groupId: string,
    field: "error_code" | "error_message",
    value: string
  ) => {
    setValidationGroups(
      validationGroups.map((group) =>
        group.id === groupId ? { ...group, [field]: value } : group
      )
    );
  };

  const generateConfig = () => {
    const formData = {
      validations: validationGroups.map((group) => ({
        operator: group.operator,
        conditions: group.conditions.map((condition) => ({
          key: condition.key,
          type: condition.type,
          value: condition.value,
          negate: condition.negate,
          mandatory: condition.mandatory,
        })),
        error_code: group.error_code,
        error_message: group.error_message,
      })),
      additional_validations: additionalValidations,
    };

    const configDSL = generateConfigDSL(formData);
    setConfigJson(formatDSL(configDSL));
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Validation Rules</CardTitle>
          <CardDescription>
            Define validation rules for request data in your config.json
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {validationGroups.map((group, index) => (
            <div key={group.id} className="space-y-4 animate-fade-in stagger-item">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`error-code-${group.id}`}>Error Code</Label>
                  <Input
                    id={`error-code-${group.id}`}
                    value={group.error_code}
                    onChange={(e) =>
                      handleErrorInfoChange(group.id, "error_code", e.target.value)
                    }
                    placeholder="Error code (e.g., PE_INVALID_INPUT)"
                  />
                </div>
                <div>
                  <Label htmlFor={`error-message-${group.id}`}>Error Message</Label>
                  <Input
                    id={`error-message-${group.id}`}
                    value={group.error_message}
                    onChange={(e) =>
                      handleErrorInfoChange(group.id, "error_message", e.target.value)
                    }
                    placeholder="User-friendly error message"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Validation Conditions</Label>
                <ConditionBuilder
                  groups={[
                    {
                      operator: group.operator,
                      conditions: group.conditions,
                      id: group.id,
                    },
                  ]}
                  onChange={(groups) => {
                    if (groups.length > 0) {
                      const updatedGroup = groups[0];
                      setValidationGroups(
                        validationGroups.map((g) =>
                          g.id === group.id
                            ? {
                                ...g,
                                operator: updatedGroup.operator,
                                conditions: updatedGroup.conditions,
                              }
                            : g
                        )
                      );
                    }
                  }}
                  includeValidationFields={true}
                />
              </div>
            </div>
          ))}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="additional-validations"
              checked={additionalValidations}
              onCheckedChange={(checked) => setAdditionalValidations(!!checked)}
            />
            <Label htmlFor="additional-validations">
              Allow additional validations
            </Label>
          </div>

          <ConditionBuilder
            groups={validationGroups}
            onChange={handleGroupsChange}
            includeValidationFields={true}
            className="mt-4"
          />
        </CardContent>
      </Card>

      {configJson && (
        <div className="animate-fade-in">
          <JsonPreview
            json={configJson}
            title="config.json"
            filename="config.json"
          />
        </div>
      )}
    </div>
  );
};

export default ValidationForm;
