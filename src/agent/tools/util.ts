interface ToolSchema {
  name: string;
  description: string;
  properties: {
    [prop: string]: { type: string; description?: string };
  };
  required?: string[]
} 

export interface GeneratedToolSchema {
  type: string,
  function: {
    name: string,
    description: string,
    parameters: {
      type: "object",
      properties: {
        [prop: string]: { type: string; description?: string },
      },
    },
    required?: string[]
  }
}

export function generateToolSchema(toolSchema: ToolSchema): GeneratedToolSchema {
  return {
    type: "function",
    function: {
      name: toolSchema.name,
      description: toolSchema.description,
      parameters: {
        type: "object",
        properties: toolSchema.properties,
      },
      required: toolSchema.required
    },
  };
}
