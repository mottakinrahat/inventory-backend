"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const jwtHelpers_1 = __importStar(require("../../../helpers/jwtHelpers"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const emailSender_1 = __importDefault(require("./emailSender"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    // Find the user by email
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: email,
        },
    });
    // Validate password
    const isCorrectPassword = yield bcrypt_1.default.compare(password, userData === null || userData === void 0 ? void 0 : userData.passwordHash);
    if (!isCorrectPassword) {
        throw new Error("Invalid password");
    }
    // Create JWT token
    const accessToken = (0, jwtHelpers_1.default)({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = (0, jwtHelpers_1.default)({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    // Fixed logging
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = yield (0, jwtHelpers_1.verifyToken)(token, config_1.default.jwt.refresh_token_secret);
    }
    catch (error) {
        console.error("JWT verification failed:", error);
        throw new Error("You are not authorized ");
    }
    if (typeof decodedData !== "object" ||
        !decodedData ||
        !("email" in decodedData)) {
        throw new Error("Invalid token payload");
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData === null || decodedData === void 0 ? void 0 : decodedData.email
        },
    });
    const accessToken = (0, jwtHelpers_1.default)({
        email: userData === null || userData === void 0 ? void 0 : userData.email,
        role: userData === null || userData === void 0 ? void 0 : userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user.email,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(oldPassword, userData.passwordHash);
    if (!isCorrectPassword) {
        throw new Error("Invalid password");
    }
    yield prisma_1.default.user.update({
        where: {
            email: user.email,
        },
        data: {
            passwordHash: yield bcrypt_1.default.hash(newPassword, 12),
        },
    });
    return {
        message: "Password changed successfully",
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: email,
        },
    });
    const resetPassToken = (0, jwtHelpers_1.default)({ email: userData.email, role: userData.role }, config_1.default.reset_pass.token_secret, config_1.default.reset_pass.token_expires_in);
    const resetPassLink = config_1.default.reset_pass.link +
        `?userId=${userData.id}&token=${resetPassToken}`;
    yield (0, emailSender_1.default)(userData === null || userData === void 0 ? void 0 : userData.email, `<div>
    <p>Click the link below to reset your password:</p><a href="${resetPassLink}">
    <button>Reset Password</button>
    </a></div>`);
    //http://localhost:3000/reset-pass?email=ancsddf@gmail.com&token=dhfsdfidshf
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isValidToken = yield (0, jwtHelpers_1.verifyToken)(token, config_1.default.reset_pass.token_secret);
    if (!isValidToken) {
        throw new Error("Invalid or expired token");
    }
    const hashPassword = bcrypt_1.default.hashSync(payload.password, 12);
    const updatePassword = yield prisma_1.default.user.update({
        where: {
            email: isValidToken.email
        },
        data: {
            passwordHash: hashPassword
        }
    });
    return {
        message: "Password reset successfully"
    };
});
exports.authServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
