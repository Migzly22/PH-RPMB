import express, { Express, Response, Request, Application } from "express";
import cors from "cors";
import phdata from "./json/PHplaces.json";
const port = 4000;
const app: Application = express();

const data = phdata;
const start = async (app: Application) => {
  app.use(cors());
  app.get("/", (req: Request, res: Response) => {
    const simpledocumentation = {
      "to get all data " : "https://ph-rpmb.vercel.app/all",
      "to get all the regions in the Philippines " : "https://ph-rpmb.vercel.app/regions",
      "to get all the provinces in the Philippines " : "https://ph-rpmb.vercel.app/provincelist",
      "to get all the municipalities in the Philippines " : "https://ph-rpmb.vercel.app/municipalitylist",
      "to get all the barangays in the Philippines " : "https://ph-rpmb.vercel.app/baranggaylist",
      "to get all the provinces in the specific Region " : "https://ph-rpmb.vercel.app/[name of region]/provincelist",
      "to get all the municipality in the specific provinces " : "https://ph-rpmb.vercel.app/[name of region]/[name of province]/municipality",
      "to get all the barangay in the specific municipalities " : "https://ph-rpmb.vercel.app/[name of region]/[name of province]/[name of municipality]/barangay",
    }
    res.status(200).json(simpledocumentation);
  });
  app.get("/all", (req: Request, res: Response) => {
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
  app.get("/municipalitylist", (req: Request, res: Response) => {
    try {
      const valuesArray = Object.values(data);

      const provinces = valuesArray.map(
        (item) => {
          let heads = Object.values(item.province_list)
          let body = Object.entries(heads[1])
          return Object.keys(body[0][1])
        }
    
    ).flat().sort()
      res.status(200).json(provinces);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  app.get("/baranggaylist", (req: Request, res: Response) => {
    try {
      const valuesArray = Object.values(data);

      const provinces = valuesArray.map(
        (item) => {
          let heads = Object.values(item.province_list)
          let body = Object.entries(heads[1])
          let municipalities = Object.values(body[0][1])
          let baranggays = Object.values(municipalities).sort()
          const test =  baranggays.map((datas2)=>{
            return datas2.barangay_list
          }).flat().sort()
          return test
        }
    
    ).flat().sort()
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
      res.status(200).json(municipalities);
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
        
        res.status(200).json(lastfiltration);
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
