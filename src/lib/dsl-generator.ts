
import { z } from "zod";

// Types for our DSL structure
export interface VendorDSL {
  vendor: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  timeout: string;
  retry_cases: string[];
  body: Record<string, any>;
  preconditions: Precondition[];
  response_mappings: ResponseMapping[];
  response_template: Record<string, any>;
}

export interface ConfigDSL {
  validations: Validation[];
  additional_validations: boolean;
  read_write?: {
    search_term: string;
    [key: string]: any;
  };
}

export interface Precondition {
  match: {
    operator: "AND" | "OR";
    conditions: Condition[];
  };
}

export interface ResponseMapping {
  match: {
    operator: "AND" | "OR";
    conditions: Condition[];
  };
  response: Record<string, any>;
}

export interface Validation {
  operator: "AND" | "OR";
  conditions: ValidationCondition[];
  error_code: string;
  error_message: string;
}

export interface Condition {
  key: string;
  type: string;
  value: string | number | boolean | any[];
}

export interface ValidationCondition extends Condition {
  negate: boolean;
  mandatory: boolean;
}

// Create empty templates for DSL objects
export const createEmptyVendorDSL = (): VendorDSL => ({
  vendor: "",
  endpoint: "",
  method: "POST",
  headers: {},
  timeout: "",
  retry_cases: [],
  body: {},
  preconditions: [],
  response_mappings: [],
  response_template: {},
});

export const createEmptyConfigDSL = (): ConfigDSL => ({
  validations: [],
  additional_validations: false,
});

// Generate DSL from form values
export const generateVendorDSL = (formData: any): VendorDSL => {
  const dsl = createEmptyVendorDSL();
  
  // Map basic fields
  dsl.vendor = formData.vendor || "";
  dsl.endpoint = formData.endpoint || "";
  dsl.method = formData.method || "POST";
  dsl.timeout = formData.timeout ? `\${env.${formData.timeout}}` : "";
  
  // Map headers
  if (formData.headers && Array.isArray(formData.headers)) {
    dsl.headers = formData.headers.reduce((acc: Record<string, string>, header: any) => {
      if (header.key && header.value) {
        acc[header.key] = header.value;
      }
      return acc;
    }, {});
  }
  
  // Map retry cases
  if (formData.retry_cases && Array.isArray(formData.retry_cases)) {
    dsl.retry_cases = formData.retry_cases;
  }
  
  // Map request body
  if (formData.body && Array.isArray(formData.body)) {
    dsl.body = formData.body.reduce((acc: Record<string, any>, field: any) => {
      if (field.key) {
        acc[field.key] = field.value || "";
      }
      return acc;
    }, {});
  }
  
  // Map preconditions
  if (formData.preconditions && Array.isArray(formData.preconditions)) {
    dsl.preconditions = formData.preconditions;
  }
  
  // Map response mappings
  if (formData.response_mappings && Array.isArray(formData.response_mappings)) {
    dsl.response_mappings = formData.response_mappings;
  }
  
  // Map response template
  if (formData.response_template && Array.isArray(formData.response_template)) {
    dsl.response_template = formData.response_template.reduce((acc: Record<string, any>, field: any) => {
      if (field.key) {
        acc[field.key] = field.value || "";
      }
      return acc;
    }, {});
  }
  
  return dsl;
};

export const generateConfigDSL = (formData: any): ConfigDSL => {
  const config = createEmptyConfigDSL();
  
  // Map validations
  if (formData.validations && Array.isArray(formData.validations)) {
    config.validations = formData.validations.map((validation: any) => ({
      operator: validation.operator || "AND",
      conditions: validation.conditions || [],
      error_code: validation.error_code || "",
      error_message: validation.error_message || ""
    }));
  }
  
  // Map additional validations flag
  config.additional_validations = formData.additional_validations || false;
  
  // Map read_write if present
  if (formData.read_write) {
    config.read_write = formData.read_write;
  }
  
  return config;
};

// Formats generated DSL to JSON string with pretty printing
export const formatDSL = (dsl: any): string => {
  return JSON.stringify(dsl, null, 2);
};

// Helper for validating conditions
export const validateCondition = (condition: Condition): boolean => {
  return Boolean(condition.key && condition.type && condition.value !== undefined);
};

// Available options for select fields
export const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];
export const RETRY_CASES = ["http_poison_error", "network_error", "timeout", "server_error"];
export const CONDITION_TYPES = [
  "equals", 
  "matches", 
  "greater_than", 
  "less_than", 
  "contains", 
  "str_len_range", 
  "data_type"
];
export const CONDITION_OPERATORS = ["AND", "OR"];
