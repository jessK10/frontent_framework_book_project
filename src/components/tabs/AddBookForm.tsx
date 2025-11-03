// src/components/tabs/AddBookForm.tsx
import { useMemo, useState } from "react";
import BookSearchResults from "./BookSearchResults";
import { searchBooksByTitle, type GoogleBook } from "../../services/googleBooksService";

type AuthorLite = { id: number; name: string };

interface Props {
  authors: AuthorLite[];
  onSubmit: (book: {
    title: string;
    authorId?: number;
    publishedYear: number;
    // UI-only
    isbn?: string;
    coverUrl?: string;
    description?: string;
  }) => void;
  onCancel: () => void;
}

type FormState = {
  title: string;
  authorId: number;
  publishedYear: number;
  isbn: string;
  coverUrl: string;
  description: string;
};

export default function AddBookForm({ authors, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<FormState>({
    title: "",
    authorId: 0,
    publishedYear: new Date().getFullYear(),
    isbn: "",
    coverUrl: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const authorOptions = useMemo<AuthorLite[]>(
    () => [{ id: 0, name: "Unknown" }, ...authors],
    [authors]
  );

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "authorId" || name === "publishedYear" ? parseInt(value || "0", 10) : value,
    }));

    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "title") {
      const q = value.trim();
      if (q.length > 2) {
        setIsSearching(true);
        searchBooksByTitle(q)
          .then(setResults)
          .catch(() => setResults([]))
          .finally(() => setIsSearching(false));
      } else {
        setResults([]);
      }
    }
  };

  const handlePick = (b: GoogleBook) => {
    const pickedYear = b.publishedDate ? parseInt(String(b.publishedDate).slice(0, 4), 10) : NaN;
    const pickedAuthorName = (b.author || "").trim().toLowerCase();
    const matched = authors.find(
      (a) => a.name.trim().toLowerCase() === pickedAuthorName && a.id > 0
    );

    setFormData((prev) => ({
      ...prev,
      title: b.title || prev.title,
      publishedYear: !isNaN(pickedYear) ? pickedYear : prev.publishedYear,
      isbn: b.isbn || prev.isbn,
      coverUrl: b.thumbnail || prev.coverUrl,
      authorId: matched ? matched.id : 0,
    }));

    setErrors((prev) => ({
      ...prev,
      authorId: matched ? "" : "No matching author found. Please select manually.",
    }));

    setResults([]);
  };

  const clearResults = () => setResults([]);

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!formData.title.trim()) next.title = "Title is required";
    if (!formData.publishedYear || isNaN(formData.publishedYear))
      next.publishedYear = "Year is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: formData.title.trim(),
      authorId: formData.authorId || undefined,
      publishedYear: formData.publishedYear,
      isbn: formData.isbn || undefined,
      coverUrl: formData.coverUrl || undefined,
      description: formData.description || undefined,
    });

    setFormData({
      title: "",
      authorId: 0,
      publishedYear: new Date().getFullYear(),
      isbn: "",
      coverUrl: "",
      description: "",
    });
    clearResults();
  };

  // ---------- Styling helpers ----------
  const cardCls =
    "relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur " +
    "supports-[backdrop-filter]:bg-white/5 shadow-[0_30px_140px_rgba(6,182,212,.12)] " +
    "ring-1 ring-white/10 p-6 sm:p-8";

  const labelCls = "block text-[13px] font-medium text-sky-200/80 mb-1.5";

  const inputBase =
    "w-full rounded-lg border border-white/10 bg-white/[0.06] text-sky-100 " +
    "placeholder:text-sky-200/40 outline-none transition " +
    "focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent " +
    "hover:border-white/20";

  const inputCls = `${inputBase} px-4 py-2.5`;
  const selectCls = `${inputBase} px-3 py-2.5`;
  const textAreaCls = `${inputBase} px-4 py-2.5 resize-y min-h-[120px]`;

  const errText = "mt-1 text-xs text-rose-400";

  return (
    <form onSubmit={submit} className={cardCls}>
      <h2 className="text-xl font-semibold text-sky-100">Add New Book</h2>
      <p className="mt-1 text-sm text-sky-200/60">
        Quickly prefill with Google Books by typing the title.
      </p>

      {/* 2-column grid on md+ */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title + suggestions */}
        <div className="md:col-span-2">
          <label htmlFor="title" className={labelCls}>
            Title <span className="text-cyan-300">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={inputCls}
            placeholder="Enter book title"
            autoComplete="off"
          />
          <BookSearchResults
            results={results}
            isSearching={isSearching}
            onSelect={handlePick}
            onClear={clearResults}
          />
          {errors.title && <p className={errText}>{errors.title}</p>}
        </div>

        {/* Author */}
        <div>
          <label htmlFor="authorId" className={labelCls}>
            Author
          </label>
          <select
            id="authorId"
            name="authorId"
            value={formData.authorId}
            onChange={handleChange}
            className={selectCls}
          >
            {authorOptions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          {errors.authorId && <p className={errText}>{errors.authorId}</p>}
        </div>

        {/* Year */}
        <div>
          <label htmlFor="publishedYear" className={labelCls}>
            Published year <span className="text-cyan-300">*</span>
          </label>
          <input
            id="publishedYear"
            name="publishedYear"
            type="number"
            value={formData.publishedYear}
            onChange={handleChange}
            className={inputCls}
          />
          {errors.publishedYear && <p className={errText}>{errors.publishedYear}</p>}
        </div>

        {/* ISBN */}
        <div>
          <label htmlFor="isbn" className={labelCls}>
            ISBN (optional)
          </label>
          <input
            id="isbn"
            name="isbn"
            type="text"
            value={formData.isbn}
            onChange={handleChange}
            className={inputCls}
            placeholder="e.g., 9780132350884"
          />
        </div>

        {/* Cover URL */}
        <div>
          <label htmlFor="coverUrl" className={labelCls}>
            Cover URL (optional)
          </label>
          <input
            id="coverUrl"
            name="coverUrl"
            type="text"
            value={formData.coverUrl}
            onChange={handleChange}
            className={inputCls}
            placeholder="https://…"
          />
        </div>

        {/* Description – full width */}
        <div className="md:col-span-2">
          <label htmlFor="description" className={labelCls}>
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={textAreaCls}
            placeholder="Short summary or notes…"
          />
        </div>
      </div>

      <div className="mt-7 flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-white shadow-[0_10px_30px_rgba(37,99,235,.35)] hover:bg-blue-700 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sky-100 hover:bg-white/[0.07] transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
