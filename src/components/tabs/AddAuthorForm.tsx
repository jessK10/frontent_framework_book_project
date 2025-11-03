// src/components/tabs/AddAuthorForm.tsx
import { useState, type FormEvent } from "react";
import { countries } from "@/mockData/countries";
import type { AuthorInput } from "@/types/Authors";

interface AddAuthorFormProps {
  onSubmit: (author: AuthorInput) => void;
  onCancel?: () => void;
}

const AddAuthorForm = ({ onSubmit, onCancel }: AddAuthorFormProps) => {
  const [formData, setFormData] = useState<AuthorInput>({
    name: "",
    bio: "",
    birthYear: new Date().getFullYear(),
    country: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AuthorInput, string>>>({});

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "birthYear" ? parseInt(value) || 0 : value,
    }));
    if (errors[name as keyof AuthorInput]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof AuthorInput, string>> = {};
    if (!formData.name.trim()) next.name = "Name is required";
    if (!formData.bio.trim()) next.bio = "Bio is required";
    if (!formData.country.trim()) next.country = "Country is required";
    if (
      !formData.birthYear ||
      formData.birthYear < 1000 ||
      formData.birthYear > new Date().getFullYear()
    ) next.birthYear = "Please enter a valid birth year";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    setFormData({ name: "", bio: "", birthYear: new Date().getFullYear(), country: "" });
    setErrors({});
  };

  const inputClasses = (err?: string) =>
    ["glass-input", err ? "ring-2 ring-red-400/60 focus:ring-red-400/70" : "focus:ring-cyan-400/40"].join(" ");

  return (
    <div className="form-card max-w-3xl">
      <h2 className="text-xl font-semibold text-sky-100">Add New Author</h2>
      <p className="mt-1 mb-6 text-sm text-sky-200/70">
        Provide a short bio and basic details for the author.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-sky-200/80">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses(errors.name)}
            placeholder="Enter author's full name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="bio" className="mb-1 block text-sm font-medium text-sky-200/80">
            Biography <span className="text-red-400">*</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className={inputClasses(errors.bio)}
            placeholder="Enter a brief biography"
          />
          {errors.bio && <p className="mt-1 text-xs text-red-400">{errors.bio}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="birthYear" className="mb-1 block text-sm font-medium text-sky-200/80">
              Birth Year <span className="text-red-400">*</span>
            </label>
            <input
              id="birthYear"
              name="birthYear"
              type="number"
              value={formData.birthYear}
              onChange={handleChange}
              min={1000}
              max={new Date().getFullYear()}
              className={inputClasses(errors.birthYear)}
              placeholder="e.g., 1950"
            />
            {errors.birthYear && <p className="mt-1 text-xs text-red-400">{errors.birthYear}</p>}
          </div>

          <div>
            <label htmlFor="country" className="mb-1 block text-sm font-medium text-sky-200/80">
              Country <span className="text-red-400">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClasses(errors.country)}
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.country && <p className="mt-1 text-xs text-red-400">{errors.country}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1">Add Author</button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-ghost flex-1">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddAuthorForm;
