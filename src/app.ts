import express, { Express, Response, Request, Application } from "express";
import cors from "cors";
import phdata from "./json/PHplaces.json";
const port = 4000;
const app: Application = express();

const data = phdata;
const start = async (app: Application) => {
  app.use(cors());
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json(data);
  });
  //get all the regions
  app.get("/regions", (req: Request, res: Response) => {
    try {
      const valuesArray = Object.values(data);
      const regionNames = valuesArray.map((item) => item.region_name).sort();
      res.status(200).json(regionNames);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  //province list all
  app.get("/provincelist", (req: Request, res: Response) => {
    try {
      const valuesArray = Object.values(data);
      const provinces = valuesArray
        .map((item) => Object.keys(item.province_list))
        .flat()
        .sort();
      res.status(200).json(provinces);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  //province list of specific region
  app.get("/:region/provincelist", (req: Request, res: Response) => {
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
    } catch (error) {
      res.status(500).json(error);
    }
  });

  //municipality list of specific region
  app.get("/:region/:province/municipality", (req: Request, res: Response) => {
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
      res.json(municipalities);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  //barangay list of specific region
  app.get(
    "/:region/:province/:municipality/barangay",
    (req: Request, res: Response) => {
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
          .map((filtered)=> filtered[1])
          .sort()
          .flat();


        const lastfiltration = Object.values(barangay[0]).flat()
        
        res.json(lastfiltration);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );

  app.listen(port, () => {
    console.log(`API open at : http://localhost:${port}`);
  });
};
start(app);
