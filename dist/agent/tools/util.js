"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToolSchema = void 0;
function generateToolSchema(toolSchema) {
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
exports.generateToolSchema = generateToolSchema;
