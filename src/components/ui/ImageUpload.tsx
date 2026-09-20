import { useRef } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';

interface ImageUploadProps {
  /** URL del archivo ya subido (edición) */
  previewUrl?: string | null;
  /** Archivo local seleccionado (nuevo) */
  fileName?: string | null;
  /** Se llama cuando el usuario elige un archivo */
  onSelect: (file: File) => void;
  label?: string;
}

export default function ImageUpload({
  previewUrl,
  fileName,
  onSelect,
  label = 'Imagen',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-600">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-xl border border-dashed border-ink-200 bg-ink-50">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Vista previa"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-8 w-8 text-ink-300" />
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-50"
        >
          <Upload className="h-4 w-4 text-flame-600" />
          <span>{fileName ?? 'Subir archivo...'}</span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
}