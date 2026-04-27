"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const errorHelper_1 = require("../utils/errorHelper");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        throw new errorHelper_1.AppError(errorMessages.join(', '), 400);
    }
    next();
};
exports.validate = validate;
