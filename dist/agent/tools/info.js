"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showInformation = exports.initializeInfo = void 0;
const _1 = require("./");
const util_1 = require("./util");
function initializeInfo() {
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.INFO_SHOW,
        description: "Get acts what I can do with description",
        properties: {}
    }), showInformation);
}
exports.initializeInfo = initializeInfo;
function showInformation() {
    const tools = (0, _1.getTools)();
    return tools.map(v => {
        return {
            description: v.function.description
        };
    });
}
exports.showInformation = showInformation;
