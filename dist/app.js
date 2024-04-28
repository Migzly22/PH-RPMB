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
const PHplaces_json_1 = __importDefault(require("./json/PHplaces.json"));
const port = 4000;
const app = (0, express_1.default)();
const data = PHplaces_json_1.default;
const start = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use((0, cors_1.default)());
    app.get("/", (req, res) => {
        const simpledocumentation = {
            "to get all data ": "https://ph-rpmb.vercel.app/all",
            "to get all the regions in the Philippines ": "https://ph-rpmb.vercel.app/regions",
            "to get all the provinces in the Philippines ": "https://ph-rpmb.vercel.app/provincelist",
            "to get all the provinces in the specific Region ": "https://ph-rpmb.vercel.app/[name of region]/provincelist",
            "to get all the municipality in the specific provinces ": "https://ph-rpmb.vercel.app/[name of region]/[name of province]/municipality",
            "to get all the barangay in the specific municipalities ": "https://ph-rpmb.vercel.app/[name of region]/[name of province]/[name of municipality]/barangay",
        };
        res.status(200).json(simpledocumentation);
    });
    app.get("/all", (req, res) => {
        res.status(200).json(data);
    });
    //get all the regions
    app.get("/regions", (req, res) => {
        try {
            const valuesArray = Object.values(data);
            const regionNames = valuesArray.map((item) => item.region_name).sort();
            res.status(200).json(regionNames);
        }
        catch (error) {
            res.status(500).json(error);
        }
    });
    //province list all
    app.get("/provincelist", (req, res) => {
        try {
            const valuesArray = Object.values(data);
            const provinces = valuesArray
                .map((item) => Object.keys(item.province_list))
                .flat()
                .sort();
            res.status(200).json(provinces);
        }
        catch (error) {
            res.status(500).json(error);
        }
    });
    //province list of specific region
    app.get("/:region/provincelist", (req, res) => {
        try {
            const { params } = req;
            // Convert the object entries into an array of [key, value] pairs
            const entriesArray = Object.values(data);
            const mapss = entriesArray
                .filter((entry) => entry && entry.region_name === params.region)
                .map((entry) => Object.keys(entry.province_list))
                .sort()
                .flat();
            res.status(200).json(mapss);
        }
        catch (error) {
            res.status(500).json(error);
        }
    });
    //municipality list of specific region
    app.get("/:region/:province/municipality", (req, res) => {
        try {
            const { params } = req;
            // Convert the object entries into an array of [key, value] pairs
            const entriesArray = Object.values(data);
            const mapss = entriesArray
                .filter((entry) => entry && entry.region_name === params.region)
                .map((entry) => entry.province_list)
                .sort()
                .flat();
            const municipalities = Object.entries(mapss[0])
                .filter((entry) => entry[0] === params.province) //  console.log(  , Object.keys(entry[1].municipality_list)
                .map((filtered) => Object.keys(filtered[1].municipality_list))
                .sort()
                .flat();
            res.status(200).json(municipalities);
        }
        catch (error) {
            res.status(500).json(error);
        }
    });
    //barangay list of specific region
    app.get("/:region/:province/:municipality/barangay", (req, res) => {
        try {
            const { params } = req;
            // Convert the object entries into an array of [key, value] pairs
            const entriesArray = Object.values(data);
            const mapss = entriesArray
                .filter((entry) => entry && entry.region_name === params.region)
                .map((entry) => entry.province_list)
                .sort()
                .flat();
            const municipalities = Object.entries(mapss[0])
                .filter((entry) => entry[0] === params.province)
                .map((filtered) => filtered[1].municipality_list)
                .sort()
                .flat();
            const barangay = Object.entries(municipalities[0])
                .filter((entry) => entry[0] === params.municipality)
                .map((filtered) => filtered[1])
                .sort()
                .flat();
            const lastfiltration = Object.values(barangay[0]).flat();
            res.status(200).json(lastfiltration);
        }
        catch (error) {
            res.status(500).json(error);
        }
    });
    app.listen(port, () => {
        console.log(`API open at : http://localhost:${port}`);
    });
});
start(app);
//# sourceMappingURL=app.js.map