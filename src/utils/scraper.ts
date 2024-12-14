import axios from "axios";
import * as cheerio from "cheerio";

export const urlPattern: RegExp = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

export async function scrapeUrl(url: string) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    console.log($);
}