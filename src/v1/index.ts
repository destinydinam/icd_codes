import express, { Request, Response } from "express";
import cors from "cors";
import { icd_11 } from "../models/icd_11";

const app = express();
app.use(cors());

const base_url = "https://us-zipcodes.onrender.com";

app.get("/v1/get_icd_11", async (req: Request, res: Response) => {
  const req_url = new URL(base_url + req.url);

  const params: { [x: string]: string }[] = [];
  req_url.searchParams?.forEach((val, key) => params.push({ [key]: val }));
  const page = Number(params[0]?.page) || 1;

  const NUM_P_PAGE = 100;
  const LIMIT = page * NUM_P_PAGE;

  res
    .status(200)
    .json(icd_11.slice(page === 1 ? 0 : LIMIT - NUM_P_PAGE, LIMIT));
});

app.get("/v1/get_icd_11_by_id", async (req: Request, res: Response) => {
  const req_url = new URL(base_url + req.url);

  if (!req_url.search)
    return res.status(400).json({ message: "No Id Provided" });

  const params: { [x: string]: string }[] = [];
  req_url.searchParams?.forEach((val, key) => params.push({ [key]: val }));
  const id = params[0].id;

  if (!id) return res.status(400).json({ message: "No Id Provided" });

  const icd = icd_11.find((item) => item.id === id);

  if (icd) return res.status(200).json(icd);

  return res.status(400).json({ message: `No Code Found for id of ${id}` });
});

app.listen(process.env.PORT || 42069, () => console.log("Server started"));
