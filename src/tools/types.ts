type JSONSchemaProperty = {
  type: "string" | "number" | "boolean" | "array" | "object";
  description: string;
  enum?: string[];        
  items?: JSONSchemaProperty;
};

type ToolParameters = {
  type: "object";
  properties: Record<string, JSONSchemaProperty>;
  required: string[];
};

type ToolSchema = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: ToolParameters;
  };
};

export type ToolResult = {
  success: boolean;
  content: string;
};

export type Tool = {
  schema: ToolSchema;
  execute: (args: any) => Promise<ToolResult>;
};