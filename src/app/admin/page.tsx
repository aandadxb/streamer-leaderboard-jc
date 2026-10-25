"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  HERO_IMAGE_REQUIREMENTS,
  HERO_MAX_IMAGE_SIZE_BYTES,
  type HeroImageKind,
} from "@/lib/hero-config";

interface Streamer {
  id: number;
  name: string;
  slug: string;
  stag: string;
  hasAvatar: boolean;
  hasHeroBanner: boolean;
  hasHeroStreamerImage: boolean;
  avatarMimeType: string | null;
  prizes: Record<string, string>;
  registrationUrl: string | null;
  loginUrl: string | null;
  ctaUrl: string | null;
  campaignId: string | null;
  termsAndConditionsHtml: string | null;
  heroCaption: string | null;
  heroMainText: string | null;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = {
  name: "",
  slug: "",
  stag: "",
  campaignId: "",
  prize1: "",
  prize2: "",
  prize3: "",
  registrationUrl: "",
  loginUrl: "",
  ctaUrl: "",
  termsAndConditionsHtml: "",
  heroCaption: "",
  heroMainText: "",
};

type StreamerForm = typeof emptyForm;

const textInputClass =
  "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

function streamerToForm(streamer: Streamer): StreamerForm {
  const prizes = streamer.prizes || {};

  return {
    name: streamer.name,
    slug: streamer.slug,
    stag: streamer.stag,
    campaignId: streamer.campaignId || "",
    prize1: prizes["1st"] || "",
    prize2: prizes["2nd"] || "",
    prize3: prizes["3rd"] || "",
    registrationUrl: streamer.registrationUrl || "",
    loginUrl: streamer.loginUrl || "",
    ctaUrl: streamer.ctaUrl || "",
    termsAndConditionsHtml: streamer.termsAndConditionsHtml || "",
    heroCaption: streamer.heroCaption || "",
    heroMainText: streamer.heroMainText || "",
  };
}

function buildPrizes(form: StreamerForm) {
  const prizes: Record<string, string> = {};
  if (form.prize1) prizes["1st"] = form.prize1;
  if (form.prize2) prizes["2nd"] = form.prize2;
  if (form.prize3) prizes["3rd"] = form.prize3;
  return prizes;
}

function PreviewImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const loaded = loadedSrc === src;

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-500 animate-pulse">
          Loading…
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoadedSrc(src)}
        className={`w-full h-full transition-opacity duration-200 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

function LocalPreviewImage({
  file,
  alt,
  className,
}: {
  file: File;
  alt: string;
  className: string;
}) {
  const src = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(src);
  }, [src]);

  return <img src={src} alt={alt} className={className} />;
}

async function getAdminStreamers(): Promise<Streamer[]> {
  const res = await fetch("/api/admin/streamers", { credentials: "include" });

  if (!res.ok) {
    let message = `Failed to load streamers (${res.status})`;
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {
      // Some server errors return an empty body during development.
    }
    throw new Error(message);
  }

  return res.json();
}

function focusAtEnd(
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) {
  const input = e.currentTarget;
  const end = input.value.length;
  window.requestAnimationFrame(() => {
    input.setSelectionRange(end, end);
  });
}

function ClearableInput({
  value,
  onChange,
  onClear,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={focusAtEnd}
        placeholder={placeholder}
        className={`${textInputClass} pr-9`}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear field"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-sm leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-gray-200 pt-5 first:border-t-0 first:pt-0">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="w-4 h-4">
      <path
        d="M16 5L8 13L4 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="w-4 h-4">
      <rect
        x="7"
        y="5"
        width="9"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 13V4.5C4 3.7 4.7 3 5.5 3H13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminPage() {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [heroBannerFile, setHeroBannerFile] = useState<File | null>(null);
  const [heroStreamerImageFile, setHeroStreamerImageFile] =
    useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [removeHeroBanner, setRemoveHeroBanner] = useState(false);
  const [removeHeroStreamerImage, setRemoveHeroStreamerImage] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [heroBannerError, setHeroBannerError] = useState("");
  const [heroStreamerImageError, setHeroStreamerImageError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroBannerInputRef = useRef<HTMLInputElement>(null);
  const heroStreamerImageInputRef = useRef<HTMLInputElement>(null);

  async function fetchStreamers() {
    try {
      const data = await getAdminStreamers();
      setStreamers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load streamers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadStreamers() {
      try {
        const data = await getAdminStreamers();
        if (cancelled) return;
        setStreamers(data);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load streamers",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadStreamers();

    return () => {
      cancelled = true;
    };
  }, []);

  function slugify(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-");
  }

  function resetImageState() {
    setAvatarFile(null);
    setHeroBannerFile(null);
    setHeroStreamerImageFile(null);
    setRemoveAvatar(false);
    setRemoveHeroBanner(false);
    setRemoveHeroStreamerImage(false);
    setHeroBannerError("");
    setHeroStreamerImageError("");
  }

  function clearMessages() {
    setError("");
    setNotice("");
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    resetImageState();
    setSlugTouched(false);
    clearMessages();
    setShowForm(true);
  }

  function openEdit(s: Streamer) {
    setEditingId(s.id);
    setSlugTouched(true);
    setForm(streamerToForm(s));
    resetImageState();
    clearMessages();
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    resetImageState();
    setError("");
  }

  function getImageDimensions(file: File) {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to read image dimensions"));
      };
      img.src = url;
    });
  }

  async function handleHeroImageSelect(kind: HeroImageKind, file: File | null) {
    if (!file) return;

    const requirement = HERO_IMAGE_REQUIREMENTS[kind];
    const setFieldError =
      kind === "heroBanner" ? setHeroBannerError : setHeroStreamerImageError;

    setFieldError("");
    setError("");

    if (!(requirement.mimeTypes as readonly string[]).includes(file.type)) {
      setFieldError(
        `${requirement.label} must be ${requirement.formatsLabel}.`,
      );
      return;
    }

    if (file.size > HERO_MAX_IMAGE_SIZE_BYTES) {
      setFieldError(`${requirement.label} must be 5MB or smaller.`);
      return;
    }

    try {
      const dimensions = await getImageDimensions(file);
      if (
        dimensions.width !== requirement.width ||
        dimensions.height !== requirement.height
      ) {
        setFieldError(
          `${requirement.label} must be exactly ${requirement.width}x${requirement.height}px.`,
        );
        return;
      }
    } catch {
      setFieldError(`${requirement.label} could not be read as a valid image.`);
      return;
    }

    setError("");
    if (kind === "heroBanner") {
      setHeroBannerFile(file);
      setRemoveHeroBanner(false);
    } else {
      setHeroStreamerImageFile(file);
      setRemoveHeroStreamerImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId && !hasChanges) return;

    setSaving(true);
    setError("");
    setNotice("");

    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("slug", slugTouched ? form.slug : slugify(form.name));
    fd.set("stag", form.stag);
    fd.set("campaignId", form.campaignId);
    if (form.registrationUrl) fd.set("registrationUrl", form.registrationUrl);
    if (form.loginUrl) fd.set("loginUrl", form.loginUrl);
    if (form.ctaUrl) fd.set("ctaUrl", form.ctaUrl);
    if (form.termsAndConditionsHtml) {
      fd.set("termsAndConditionsHtml", form.termsAndConditionsHtml);
    }
    fd.set("heroCaption", form.heroCaption);
    fd.set("heroMainText", form.heroMainText);

    fd.set("prizes", JSON.stringify(buildPrizes(form)));

    if (avatarFile) fd.set("avatar", avatarFile);
    if (removeAvatar) fd.set("removeAvatar", "true");
    if (heroBannerFile) fd.set("heroBanner", heroBannerFile);
    if (heroStreamerImageFile) {
      fd.set("heroStreamerImage", heroStreamerImageFile);
    }
    if (removeHeroBanner) fd.set("removeHeroBanner", "true");
    if (removeHeroStreamerImage) fd.set("removeHeroStreamerImage", "true");

    const url = editingId
      ? `/api/admin/streamers/${editingId}`
      : "/api/admin/streamers";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: fd });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setSaving(false);
      return;
    }

    setSaving(false);
    setNotice(editingId ? "Streamer updated." : "Streamer created.");
    closeForm();
    void fetchStreamers();
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete streamer "${name}"?`)) return;
    await fetch(`/api/admin/streamers/${id}`, { method: "DELETE" });
    setNotice("Streamer deleted.");
    void fetchStreamers();
  }

  function copyUrl(slug: string, id: number) {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function confirmRemove(label: string, onConfirm: () => void) {
    if (
      !window.confirm(
        `Remove ${label}? It will use the default fallback after saving.`,
      )
    ) {
      return;
    }

    onConfirm();
  }

  const editingStreamer = editingId
    ? streamers.find((s) => s.id === editingId)
    : null;
  const hasChanges = useMemo(() => {
    if (!editingId) return true;
    if (!editingStreamer) return false;

    return (
      JSON.stringify(form) !==
        JSON.stringify(streamerToForm(editingStreamer)) ||
      !!avatarFile ||
      !!heroBannerFile ||
      !!heroStreamerImageFile ||
      removeAvatar ||
      removeHeroBanner ||
      removeHeroStreamerImage
    );
  }, [
    avatarFile,
    editingId,
    editingStreamer,
    form,
    heroBannerFile,
    heroStreamerImageFile,
    removeAvatar,
    removeHeroBanner,
    removeHeroStreamerImage,
  ]);

  if (loading) {
    return <p className="text-gray-500">Loading…</p>;
  }

  return (
    <div>
      {error && !showForm && (
        <p className="text-red-600 text-sm mb-4">{error}</p>
      )}
      {notice && (
        <p className="text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 text-sm mb-4">
          {notice}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-lg font-medium">Streamers ({streamers.length})</h2>
        {!showForm && (
          <button
            onClick={openCreate}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 rounded text-sm hover:bg-blue-700"
          >
            Add Streamer
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 border border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50"
        >
          <h3 className="font-medium mb-4">
            {editingId ? "Edit Streamer" : "New Streamer"}
          </h3>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="space-y-6 mb-4">
            <FormSection
              title="Basic Info"
              description="Core streamer identity and leaderboard campaign mapping."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onFocus={focusAtEnd}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        name: newName,
                        ...(slugTouched ? {} : { slug: slugify(newName) }),
                      }));
                    }}
                    className={textInputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Slug <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={slugTouched ? form.slug : slugify(form.name)}
                    onFocus={focusAtEnd}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setForm({ ...form, slug: e.target.value });
                    }}
                    className={textInputClass}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {slugTouched ? "Custom slug" : "Auto-generated from name"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Stag <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.stag}
                    onFocus={focusAtEnd}
                    onChange={(e) => setForm({ ...form, stag: e.target.value })}
                    className={textInputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Campaign ID <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.campaignId}
                    onFocus={focusAtEnd}
                    onChange={(e) =>
                      setForm({ ...form, campaignId: e.target.value })
                    }
                    placeholder="e.g. 12345"
                    className={textInputClass}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Prizes"
              description="Optional prize labels shown on the podium."
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    1st Prize
                  </label>
                  <ClearableInput
                    value={form.prize1}
                    onChange={(value) => setForm({ ...form, prize1: value })}
                    onClear={() => setForm({ ...form, prize1: "" })}
                    placeholder="e.g. $500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    2nd Prize
                  </label>
                  <ClearableInput
                    value={form.prize2}
                    onChange={(value) => setForm({ ...form, prize2: value })}
                    onClear={() => setForm({ ...form, prize2: "" })}
                    placeholder="e.g. $300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    3rd Prize
                  </label>
                  <ClearableInput
                    value={form.prize3}
                    onChange={(value) => setForm({ ...form, prize3: value })}
                    onClear={() => setForm({ ...form, prize3: "" })}
                    placeholder="e.g. $200"
                  />
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Links"
              description="Destination URLs for player registration, login, and campaign CTA."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Registration URL
                  </label>
                  <ClearableInput
                    type="url"
                    value={form.registrationUrl}
                    onChange={(value) =>
                      setForm({ ...form, registrationUrl: value })
                    }
                    onClear={() => setForm({ ...form, registrationUrl: "" })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Login URL
                  </label>
                  <ClearableInput
                    type="url"
                    value={form.loginUrl}
                    onChange={(value) => setForm({ ...form, loginUrl: value })}
                    onClear={() => setForm({ ...form, loginUrl: "" })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    CTA URL
                  </label>
                  <ClearableInput
                    type="url"
                    value={form.ctaUrl}
                    onChange={(value) => setForm({ ...form, ctaUrl: value })}
                    onClear={() => setForm({ ...form, ctaUrl: "" })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Hero Content"
              description="Optional copy displayed over the hero. Empty fields use the current defaults."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Hero Caption
                  </label>
                  <ClearableInput
                    value={form.heroCaption}
                    onChange={(value) =>
                      setForm({ ...form, heroCaption: value })
                    }
                    onClear={() => setForm({ ...form, heroCaption: "" })}
                    placeholder="Streamer's Wager Race"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use the default caption.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Hero Main Text
                  </label>
                  <ClearableInput
                    value={form.heroMainText}
                    onChange={(value) =>
                      setForm({ ...form, heroMainText: value })
                    }
                    onClear={() => setForm({ ...form, heroMainText: "" })}
                    placeholder="EXCLUSIVE PRIZES TO BE WON"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use the default text.
                  </p>
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Terms"
              description="Optional custom terms content for the footer modal."
            >
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Terms & Conditions HTML
                </label>
                <textarea
                  value={form.termsAndConditionsHtml}
                  onChange={(e) =>
                    setForm({ ...form, termsAndConditionsHtml: e.target.value })
                  }
                  onFocus={focusAtEnd}
                  placeholder="<h2>Custom Terms</h2><p>Enter HTML content here...</p>"
                  rows={5}
                  className={`${textInputClass} font-mono`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use default Lucky Dreams terms. Supports HTML
                  tags.
                </p>
              </div>
            </FormSection>

            <FormSection
              title="Images"
              description="Optional uploads for avatar and hero assets. Empty hero images use the current defaults."
            >
              <div className="space-y-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Avatar
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        setAvatarFile(file);
                        setRemoveAvatar(false);
                      }
                      e.target.value = "";
                    }}
                  />
                  {editingStreamer?.hasAvatar &&
                    !removeAvatar &&
                    !avatarFile && (
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <img
                          src={`/api/streamers/${editingStreamer.id}/avatar?v=${editingStreamer.updatedAt}`}
                          alt="Current avatar"
                          className="w-16 h-16 rounded-full object-cover border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            confirmRemove("avatar", () => setRemoveAvatar(true))
                          }
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  {removeAvatar && !avatarFile && (
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs border border-gray-300">
                        Removed
                      </div>
                      <button
                        type="button"
                        onClick={() => setRemoveAvatar(false)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Undo
                      </button>
                    </div>
                  )}
                  {avatarFile && (
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <LocalPreviewImage
                        file={avatarFile}
                        alt="New avatar"
                        className="w-16 h-16 rounded-full object-cover border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarFile(null);
                          setRemoveAvatar(false);
                        }}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  {!editingStreamer?.hasAvatar &&
                    !avatarFile &&
                    !removeAvatar && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Upload avatar
                      </button>
                    )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Hero Banner (1520x400)
                  </label>
                  <input
                    ref={heroBannerInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      await handleHeroImageSelect(
                        "heroBanner",
                        e.target.files?.[0] || null,
                      );
                      e.target.value = "";
                    }}
                  />
                  {editingStreamer?.hasHeroBanner &&
                    !removeHeroBanner &&
                    !heroBannerFile && (
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <PreviewImage
                          src={`/api/streamers/${editingStreamer.slug}/hero-banner?v=${editingStreamer.updatedAt}`}
                          alt="Current hero banner"
                          className="w-40 h-[42px] object-cover border border-gray-300 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => heroBannerInputRef.current?.click()}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            confirmRemove("hero banner", () =>
                              setRemoveHeroBanner(true),
                            )
                          }
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  {removeHeroBanner && !heroBannerFile && (
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div className="w-40 h-[42px] rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs border border-gray-300">
                        Removed
                      </div>
                      <button
                        type="button"
                        onClick={() => setRemoveHeroBanner(false)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Undo
                      </button>
                    </div>
                  )}
                  {heroBannerFile && (
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <LocalPreviewImage
                        file={heroBannerFile}
                        alt="New hero banner"
                        className="w-40 h-[42px] object-cover border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => heroBannerInputRef.current?.click()}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHeroBannerFile(null);
                          setRemoveHeroBanner(false);
                        }}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  {!editingStreamer?.hasHeroBanner &&
                    !heroBannerFile &&
                    !removeHeroBanner && (
                      <button
                        type="button"
                        onClick={() => heroBannerInputRef.current?.click()}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Upload hero banner
                      </button>
                    )}
                  {heroBannerError && (
                    <p className="text-xs text-red-600 mt-2">
                      {heroBannerError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, or WEBP. Max 5MB. Leave empty to use the default
                    banner.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Hero Streamer Image (1566x915)
                  </label>
                  <input
                    ref={heroStreamerImageInputRef}
                    type="file"
                    accept="image/png,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      await handleHeroImageSelect(
                        "heroStreamerImage",
                        e.target.files?.[0] || null,
                      );
                      e.target.value = "";
                    }}
                  />
                  {editingStreamer?.hasHeroStreamerImage &&
                    !removeHeroStreamerImage &&
                    !heroStreamerImageFile && (
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <PreviewImage
                          src={`/api/streamers/${editingStreamer.slug}/hero-streamer?v=${editingStreamer.updatedAt}`}
                          alt="Current hero streamer"
                          className="w-28 h-16 object-cover object-top border border-gray-300 rounded"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            heroStreamerImageInputRef.current?.click()
                          }
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            confirmRemove("hero streamer image", () =>
                              setRemoveHeroStreamerImage(true),
                            )
                          }
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  {removeHeroStreamerImage && !heroStreamerImageFile && (
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div className="w-28 h-16 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs border border-gray-300">
                        Removed
                      </div>
                      <button
                        type="button"
                        onClick={() => setRemoveHeroStreamerImage(false)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Undo
                      </button>
                    </div>
                  )}
                  {heroStreamerImageFile && (
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <LocalPreviewImage
                        file={heroStreamerImageFile}
                        alt="New hero streamer"
                        className="w-28 h-16 object-cover object-top border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          heroStreamerImageInputRef.current?.click()
                        }
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHeroStreamerImageFile(null);
                          setRemoveHeroStreamerImage(false);
                        }}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  {!editingStreamer?.hasHeroStreamerImage &&
                    !heroStreamerImageFile &&
                    !removeHeroStreamerImage && (
                      <button
                        type="button"
                        onClick={() =>
                          heroStreamerImageInputRef.current?.click()
                        }
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Upload hero streamer image
                      </button>
                    )}
                  {heroStreamerImageError && (
                    <p className="text-xs text-red-600 mt-2">
                      {heroStreamerImageError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    PNG or WEBP. Max 5MB. Leave empty to use the default
                    streamer image.
                  </p>
                </div>
              </div>
            </FormSection>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving || (Boolean(editingId) && !hasChanges)}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="w-full sm:w-auto border border-gray-300 px-4 py-2.5 rounded text-sm hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {streamers.length === 0 ? (
        <p className="text-gray-500">No streamers yet.</p>
      ) : (
        <>
          <div className="lg:hidden divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white overflow-hidden">
            {streamers.map((s) => (
              <div key={s.id} className="p-3">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    {s.hasAvatar ? (
                      <img
                        src={`/api/streamers/${s.id}/avatar?v=${s.updatedAt}`}
                        alt={s.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-[10px]">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-gray-900 truncate">
                        {s.name}
                      </p>
                      <span className="shrink-0 text-[11px] text-gray-500">
                        {s.campaignId || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <a
                        href={`/${s.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline truncate"
                      >
                        /{s.slug}
                      </a>
                      <button
                        onClick={() => copyUrl(s.slug, s.id)}
                        aria-label={copiedId === s.id ? "Copied" : "Copy URL"}
                        title={copiedId === s.id ? "Copied" : "Copy URL"}
                        className={`shrink-0 p-1 rounded hover:bg-gray-100 ${
                          copiedId === s.id
                            ? "text-green-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <CopyIcon copied={copiedId === s.id} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-gray-500">
                      <span>
                        Stag{" "}
                        <span className="font-medium text-gray-800">
                          {s.stag}
                        </span>
                      </span>
                      <span>
                        Campaign{" "}
                        <span className="font-medium text-gray-800">
                          {s.campaignId || "—"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => openEdit(s)}
                    className="rounded bg-blue-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id, s.name)}
                    className="rounded border border-red-200 px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 px-3">Avatar</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Slug</th>
                  <th className="py-2 px-3">Stag</th>
                  <th className="py-2 px-3">Campaign</th>
                  <th className="py-2 px-3">URL</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {streamers.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100">
                    <td className="py-2 px-3">
                      {s.hasAvatar ? (
                        <img
                          src={`/api/streamers/${s.id}/avatar?v=${s.updatedAt}`}
                          alt={s.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-3 font-medium">{s.name}</td>
                    <td className="py-2 px-3 text-gray-500">{s.slug}</td>
                    <td className="py-2 px-3">{s.stag}</td>
                    <td className="py-2 px-3 text-gray-500">
                      {s.campaignId || "—"}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/${s.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-[200px]"
                        >
                          /{s.slug}
                        </a>
                        <button
                          onClick={() => copyUrl(s.slug, s.id)}
                          className="text-xs text-gray-500 hover:text-gray-700 whitespace-nowrap"
                        >
                          {copiedId === s.id ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => openEdit(s)}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
