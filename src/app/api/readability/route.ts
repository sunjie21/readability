import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const newUrl = searchParams.get("url");
  if (!newUrl) {
    return Response.json({});
  }
  const newReq = new Request(decodeURIComponent(newUrl), req);

  const html = await fetch(newReq).then((resp) => resp.text());
  const doc = new JSDOM(html, { url: newUrl });
  const article = new Readability(doc.window.document).parse();

  const purify = DOMPurify(doc.window);
  if (article?.content) {
    article.content = purify.sanitize(article?.content || "");
  }

  return Response.json(article);
}
