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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const icd_11_1 = require("../models/icd_11");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const base_url = "https://icd-codes.onrender.com";
app.get("/v1/get_all_icd_11", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json(icd_11_1.icd_11.map((icd) => ({
        id: icd.id,
        name: (icd === null || icd === void 0 ? void 0 : icd.code) + ((icd === null || icd === void 0 ? void 0 : icd.code) ? " - " : "") + (icd === null || icd === void 0 ? void 0 : icd.title),
    })));
}));
app.get("/v1/get_icd_11", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const req_url = new URL(base_url + req.url);
    const params = [];
    (_a = req_url.searchParams) === null || _a === void 0 ? void 0 : _a.forEach((val, key) => params.push({ [key]: val }));
    const page = Number((_b = params[0]) === null || _b === void 0 ? void 0 : _b.page) || 1;
    console.log("app.get ~ page:", page);
    const NUM_P_PAGE = 100;
    const LIMIT = page * NUM_P_PAGE;
    res
        .status(200)
        .json(icd_11_1.icd_11.slice(page === 1 ? 0 : LIMIT - NUM_P_PAGE, LIMIT));
}));
app.get("/v1/get_icd_11_by_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const req_url = new URL(base_url + req.url);
    if (!req_url.search)
        return res.status(400).json({ message: "No Id Provided" });
    const params = [];
    (_c = req_url.searchParams) === null || _c === void 0 ? void 0 : _c.forEach((val, key) => params.push({ [key]: val }));
    const id = params[0].id;
    if (!id)
        return res.status(400).json({ message: "No Id Provided" });
    const icd = icd_11_1.icd_11.find((item) => item.id === id);
    if (icd)
        return res.status(200).json(icd);
    return res.status(400).json({ message: `No Code Found for id of ${id}` });
}));
app.get("/v1/get_icd_11_by_keyword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const req_url = new URL(base_url + req.url);
    if (!req_url.search)
        return res.status(400).json({ message: "No keyword Provided" });
    const params = [];
    (_d = req_url.searchParams) === null || _d === void 0 ? void 0 : _d.forEach((val, key) => params.push({ [key]: val }));
    const keyword = params[0].keyword;
    if (!keyword)
        return res.status(400).json({ message: "No keyword Provided" });
    const icds = icd_11_1.icd_11.filter((icd) => `${(icd.code || "") + icd.title}`
        .replace(/\s+/g, "")
        .toLowerCase()
        .includes(keyword.replace(/\s+/g, "").toLowerCase()));
    console.log("app.get ~ icds:", icds.length);
    if ((icds === null || icds === void 0 ? void 0 : icds.length) > 0)
        return res.status(200).json(icds);
    return res.status(400).json({ message: `No Match for ${keyword}` });
}));
app.listen(process.env.PORT || 42069, () => console.log("Server started"));
//# sourceMappingURL=index.js.map