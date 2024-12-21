"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasRoles = void 0;
const common_1 = require("@nestjs/common");
const HasRoles = (...role) => (0, common_1.SetMetadata)('role', role);
exports.HasRoles = HasRoles;
//# sourceMappingURL=has-roles.decorator.js.map