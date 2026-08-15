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

export type ToolUsageNotes = {
  whenToUse: string;
  commonMistakes?: string;
  recoveryHints?: string;
  extraGuidance?: string;
}

export type ToolSchema = {
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
  usageNotes: ToolUsageNotes;
  execute: (args: any) => Promise<ToolResult>;
};