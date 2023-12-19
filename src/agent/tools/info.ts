import { Tools, getTools, registerTools } from "./";
import { GeneratedToolSchema, generateToolSchema } from "./util";

export function initializeInfo() {
    registerTools(generateToolSchema({
        name: Tools.INFO_SHOW,
        description: "Get acts what I can do with description",
        properties: {}
    }), showInformation)
}

export function showInformation() {
    const tools = getTools() as GeneratedToolSchema[];
    return tools.map(v => {
        return {
            description: v.function.description
        }
    })
}