import fs from "fs";
import path from "node:path";

const url = "https://data.cityofnewyork.us/resource/ebb7-mvp5.json";
const response = await fetch(url);
const tonnage = await response.json();

console.log(`Fetched ${tonnage.length} tonnage.`);

const dataDir = path.join("src", "lib", "data");
fs.mkdirSync(dataDir, { recursive: true });

const outputPath = path.join(dataDir, "tonnage.json");
fs.writeFileSync(outputPath, JSON.stringify(tonnage, null, 2));
console.log(`Saved to ${outputPath}`);
