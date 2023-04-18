"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchFactory = void 0;
exports.FetchFactory = {
    build: (options) => {
        return fetchFactory(options);
    },
};
function fetchFactory(options) {
    var _a, _b, _c;
    const basePath = (_a = options === null || options === void 0 ? void 0 : options.baseUrl) !== null && _a !== void 0 ? _a : "";
    const defaultInit = (_b = options === null || options === void 0 ? void 0 : options.defaultInit) !== null && _b !== void 0 ? _b : {};
    const fetchMethod = (_c = options === null || options === void 0 ? void 0 : options.fetchMethod) !== null && _c !== void 0 ? _c : fetch;
    function fetcher(input, init) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const options = init;
            const path = getPath(input, (_a = options.parameters) === null || _a === void 0 ? void 0 : _a.path);
            const query = getQuery((_b = options.parameters) === null || _b === void 0 ? void 0 : _b.query);
            const url = basePath + path + query;
            const fetchInit = buildInit(defaultInit, options);
            const response = yield fetchMethod(url, fetchInit);
            return new Response([101, 204, 205, 302, 304].includes(response.status)
                ? null
                : response.body, {
                status: response.status,
                headers: response.headers,
                statusText: response.statusText,
            });
        });
    }
    return fetcher;
}
function buildInit(defaultInit, options) {
    return Object.assign(Object.assign({}, Object.assign({}, Object.assign({}, defaultInit), Object.assign({}, options))), { body: options.body ? JSON.stringify(options.body) : undefined, method: options.method, headers: Object.assign({}, defaultInit.headers, options.headers) });
}
function getPath(path, pathParams) {
    if (!pathParams) {
        return path;
    }
    return path.replace(/\{([^}]+)\}/g, (_, key) => {
        const value = encodeURIComponent(pathParams[key]);
        return value;
    });
}
function getQuery(params) {
    if (!params) {
        return "";
    }
    const searchParams = Object.entries(params).map(([key, value]) => {
        if (Array.isArray(value)) {
            return value
                .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(`${v}`)}`)
                .join("&");
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(`${params[key]}`)}`;
    });
    return "?" + searchParams.join("&");
}
//# sourceMappingURL=fetch-factory.js.map