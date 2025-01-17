"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [excerpt, setExcerpt] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<any>();

  async function fetchArticle(url: string) {
    setLoading(true);
    setError("");
    setTitle("");
    setExcerpt("");
    setContent("");

    try {
      const { title, excerpt, content } = await fetch(
        `/api/readability?url=${encodeURIComponent(url)}`
      ).then((resp) => resp.json());
      setTitle(title);
      setExcerpt(excerpt);
      setContent(content);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex gap-8">
        <input
          className="flex-grow rounded-md ring-1 ring-gray-300 border-0 py-1.5 px-2"
          placeholder="url"
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && url && !loading) {
              fetchArticle(url);
            }
          }}
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
        {title && <h1 className="text-balance text-3xl text-center text-zinc-950 font-serif">{title}</h1>}
        {excerpt && (
          <div className="border-l-2 border-gray-300 pl-2 text-gray-400 font-light font-serif my-6">
            <blockquote>{excerpt}</blockquote>
          </div>
        )}
        {content && <div className="content font-serif text-zinc-900" dangerouslySetInnerHTML={{ __html: content }}></div>}
      </div>
    </main>
  );
}
