"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<any>();

  async function fetchArticle(url: string) {
    setLoading(true);
    setError("");
    setContent("");

    try {
      const { content } = await fetch(
        `/api/readability?url=${encodeURIComponent(url)}`
      ).then((resp) => resp.json());
      setContent(content);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex gap-8">
        <input
          className="flex-grow rounded-md ring-1 ring-gray-300 border-0 py-1.5 px-2"
          placeholder="url"
          onChange={(event) => setUrl(event.target.value)}
        />
        <button
          type="button"
          disabled={loading || !url}
          className="rounded-md shadow-sm px-3 py-2 ring-1 ring-gray-300 text-gray-900"
          onClick={() => fetchArticle(url)}
        >
          Fetch
        </button>
      </div>

      <div className="mt-8 lg:w-full lg:max-w-5xl">
        {loading && <p>Loading...</p>}
        {error && <pre>{error?.message}</pre>}
        {content && <div dangerouslySetInnerHTML={{ __html: content }}></div>}
      </div>
    </main>
  );
}
