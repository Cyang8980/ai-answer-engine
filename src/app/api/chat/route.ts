// TODO: Implement the chat API with Groq and web scraping with Cheerio and Puppeteer
// Refer to the Next.js Docs on how to read the Request body: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// Refer to the Groq SDK here on how to use an LLM: https://www.npmjs.com/package/groq-sdk
// Refer to the Cheerio docs here on how to parse HTML: https://cheerio.js.org/docs/basics/loading
// Refer to Puppeteer docs here: https://pptr.dev/guides/what-is-puppeteer
import { NextResponse } from "next/server";
import { getGroqResponse } from "@/utils/groqClient";
import { scrapeUrl, urlPattern } from "@/utils/scraper";

// Exported POST handler
export async function POST(req: { json: () => any }) {
  try {
    const { message, messages } = await req.json();

    console.log("message received", message);
    console.log("messages: ", messages);
    const url = message.match(urlPattern);

    let scrapedContent = "";

    if (url) {
      console.log("Url found", url);
      const scrapedResponse = await scrapeUrl(url);
      if (scrapedResponse) {
        scrapedContent = scrapedResponse.content;
      }
    }
    // Extract the users Query by removing the URL if present

    const userQuery = message.replace(url ? url[0] : "", "").trim();
    console.log("question: ", userQuery);
    const userPrompt = `
      answer my question "${userQuery}"

      Based on the following content:
      <content>
        ${scrapedContent}
      </content>
    `;

    const llmMessages = [
      ...(Array.isArray(messages) ? messages : []),
      {
        role: "user",
        content: userPrompt,
      },
    ];
    const response = await getGroqResponse(llmMessages);

    return NextResponse.json({ message: response });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ Message: "Error" });
  }
}
