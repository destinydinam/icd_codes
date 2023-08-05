import express, { Request, Response } from "express";
import cors from "cors";
import { icd_11 } from "./models/icd_11";

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

// type RowData = { id: number; code: string; title: string };

// app.get("/v1/getCodes", async (_, res: Response) => {
//   const file = "./assets/11To10MapToOneCategory.xlsx";

//   console.time();
//   const result = readXlsxFile(file);
//   console.timeEnd();
//   console.log(result.length);
//   res.status(200).json(result);
// });

// function readXlsxFile(file: string): RowData[] {
//   const workbook = xlsx.readFile(file);
//   const sheetName = workbook.SheetNames[0];
//   const sheet = workbook.Sheets[sheetName];
//   const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any;
//   const result: RowData[] = [];
//   for (let i = 1; i < data.length; i++) {
//     const row = data[i];
//     result.push({
//       id: row[0],
//       code: row[1],
//       title: row[3],
//     });
//   }
//   return result;
// }

app.listen(process.env.PORT || 42069, () => console.log("Server started"));
