
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CONDITION_TYPES, CONDITION_OPERATORS } from "@/lib/dsl-generator";
import { cn } from "@/lib/utils";

export interface ConditionGroup {
  operator: "AND" | "OR";
  conditions: Condition[];
  id: string;
}

export interface Condition {
  key: string;
  type: string;
  value: string;
  id: string;
  negate?: boolean;
  mandatory?: boolean;
}

interface ConditionBuilderProps {
  groups: ConditionGroup[];
  onChange: (groups: ConditionGroup[]) => void;
  includeValidationFields?: boolean;
  className?: string;
}

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  groups,
  onChange,
  includeValidationFields = false,
  className,
}) => {
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addGroup = () => {
    const newGroup = {
      operator: "AND" as const,
      conditions: [createEmptyCondition()],
      id: generateId(),
    };
    onChange([...groups, newGroup]);
  };

  const removeGroup = (groupId: string) => {
    onChange(groups.filter((group) => group.id !== groupId));
  };

  const createEmptyCondition = (): Condition => ({
    key: "",
    type: "equals",
    value: "",
    id: generateId(),
    ...(includeValidationFields && { negate: false, mandatory: true }),
  });

  const updateGroupOperator = (groupId: string, operator: "AND" | "OR") => {
    onChange(
      groups.map((group) =>
        group.id === groupId ? { ...group, operator } : group
      )
    );
  };

  const addCondition = (groupId: string) => {
    onChange(
      groups.map((group) =>
        group.id === groupId
          ? { ...group, conditions: [...group.conditions, createEmptyCondition()] }
          : group
      )
    );
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    onChange(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.filter((c) => c.id !== conditionId),
            }
          : group
      )
    );
  };

  const updateCondition = (
    groupId: string,
    conditionId: string,
    field: keyof Condition,
    value: any
  ) => {
    onChange(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map((condition) =>
                condition.id === conditionId
                  ? { ...condition, [field]: value }
                  : condition
              ),
            }
          : group
      )
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {groups.map((group, groupIndex) => (
        <div
          key={group.id}
          className="p-4 border rounded-md bg-secondary/30 animate-fade-in stagger-item"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Select
                value={group.operator}
                onValueChange={(value) => updateGroupOperator(group.id, value as "AND" | "OR")}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPERATORS.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm font-medium text-muted-foreground">
                {`Condition Group ${groupIndex + 1}`}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeGroup(group.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove group</span>
            </Button>
          </div>

          <div className="space-y-3">
            {group.conditions.map((condition) => (
              <div
                key={condition.id}
                className="grid grid-cols-12 gap-2 items-center animate-fade-in"
              >
                <Input
                  value={condition.key}
                  onChange={(e) =>
                    updateCondition(group.id, condition.id, "key", e.target.value)
                  }
                  placeholder="Key/Path"
                  className="col-span-4"
                />

                <Select
                  value={condition.type}
                  onValueChange={(value) =>
                    updateCondition(group.id, condition.id, "type", value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  value={condition.value}
                  onChange={(e) =>
                    updateCondition(group.id, condition.id, "value", e.target.value)
                  }
                  placeholder="Value"
                  className="col-span-4"
                />

                {includeValidationFields && (
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="flex items-center space-x-1">
                      <Checkbox
                        id={`negate-${condition.id}`}
                        checked={condition.negate}
                        onCheckedChange={(checked) =>
                          updateCondition(group.id, condition.id, "negate", !!checked)
                        }
                      />
                      <label
                        htmlFor={`negate-${condition.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Negate
                      </label>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Checkbox
                        id={`mandatory-${condition.id}`}
                        checked={condition.mandatory}
                        onCheckedChange={(checked) =>
                          updateCondition(group.id, condition.id, "mandatory", !!checked)
                        }
                      />
                      <label
                        htmlFor={`mandatory-${condition.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Required
                      </label>
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCondition(group.id, condition.id)}
                  className="col-span-1 text-muted-foreground hover:text-destructive"
                  disabled={group.conditions.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove condition</span>
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addCondition(group.id)}
              className="mt-2 w-full flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Condition</span>
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addGroup}
        className="w-full flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Add Condition Group</span>
      </Button>
    </div>
  );
};

export default ConditionBuilder;
