"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Heading2,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { unggahMedia } from "@/features/media/actions";
import { siapkanGambarUntukUnggah } from "@/features/media/gambar-klien";
import type { FolderMedia } from "@/features/media/validasi";

type TinggiEditor = "ringkas" | "sedang" | "panjang";

const KELAS_TINGGI_EDITOR: Record<TinggiEditor, string> = {
  ringkas: "min-h-32 px-4 py-4 sm:min-h-36 sm:px-5",
  sedang: "min-h-56 px-4 py-4 sm:min-h-64 sm:px-5",
  panjang: "min-h-72 px-4 py-4 sm:min-h-80 sm:px-5",
};

type TombolEditorProps = {
  label: string;
  aktif?: boolean;
  dinonaktifkan?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function TombolEditor({
  label,
  aktif,
  dinonaktifkan,
  onClick,
  children,
}: TombolEditorProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={aktif}
      disabled={dinonaktifkan}
      onClick={onClick}
      className={`grid size-10 place-items-center rounded-md border text-tinta disabled:opacity-50 ${
        aktif
          ? "border-hijau-utama bg-hijau-muda text-hijau-utama"
          : "border-transparent hover:border-garis hover:bg-permukaan"
      }`}
    >
      {children}
    </button>
  );
}

export function EditorArtikel({
  nilai,
  onChange,
  onBlur,
  pesanError,
  id = "isi-artikel-editor",
  labelAksesibel = "Isi artikel",
  tinggi = "panjang",
  folderMedia = "artikel",
}: {
  nilai: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  pesanError?: string;
  id?: string;
  labelAksesibel?: string;
  tinggi?: TinggiEditor;
  folderMedia?: FolderMedia;
}) {
  const inputGambar = useRef<HTMLInputElement>(null);
  const [sedangUnggah, setSedangUnggah] = useState(false);
  const [pesanUnggah, setPesanUnggah] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        },
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: { loading: "lazy" },
      }),
    ],
    content: nilai,
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-multiline": "true",
        class: `${KELAS_TINGGI_EDITOR[tinggi]} focus:outline-none`,
        "aria-label": labelAksesibel,
      },
    },
    onUpdate: ({ editor: aktif }) => onChange(aktif.getHTML()),
    onBlur,
  });

  function aturTautan() {
    if (!editor) return;
    const sebelumnya = editor.getAttributes("link").href as string | undefined;
    const masukan = window.prompt(
      "Masukkan alamat tautan, misalnya https://puskesmas.go.id",
      sebelumnya ?? "https://",
    );
    if (masukan === null) return;
    if (!masukan.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const href = /^https?:\/\//i.test(masukan)
      ? masukan.trim()
      : `https://${masukan.trim()}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }

  async function sisipkanGambar(e: React.ChangeEvent<HTMLInputElement>) {
    const berkas = e.target.files?.[0];
    e.target.value = "";
    if (!berkas || !editor) return;

    setSedangUnggah(true);
    setPesanUnggah(null);
    try {
      const kecil = await siapkanGambarUntukUnggah(berkas, {
        batasMb: 0.45,
        sisiMaksimal: 1600,
      });
      const hasil = await unggahMedia(kecil, folderMedia);
      if (!hasil.ok) {
        setPesanUnggah(hasil.pesan);
        return;
      }
      editor
        .chain()
        .focus()
        .setImage({ src: hasil.url, alt: berkas.name })
        .run();
      setPesanUnggah("Gambar berhasil dimasukkan ke dalam teks.");
    } catch {
      setPesanUnggah(
        "Gambar gagal diproses. Coba pilih foto berformat JPG atau PNG.",
      );
    } finally {
      setSedangUnggah(false);
    }
  }

  return (
    <div>
      <div
        className={`overflow-hidden rounded-lg border bg-white ${
          pesanError ? "border-merah-layanan" : "border-garis"
        }`}
      >
        <div
          role="toolbar"
          aria-label={`Alat pemformatan untuk ${labelAksesibel}`}
          className="flex flex-wrap gap-1 border-b border-garis bg-permukaan/70 p-2"
        >
          <TombolEditor
            label="Tebalkan teks"
            aktif={editor?.isActive("bold")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold size={19} aria-hidden="true" />
          </TombolEditor>
          <TombolEditor
            label="Miringkan teks"
            aktif={editor?.isActive("italic")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic size={19} aria-hidden="true" />
          </TombolEditor>
          <TombolEditor
            label="Buat judul bagian"
            aktif={editor?.isActive("heading", { level: 2 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 size={19} aria-hidden="true" />
          </TombolEditor>
          <TombolEditor
            label="Buat daftar bertanda"
            aktif={editor?.isActive("bulletList")}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List size={19} aria-hidden="true" />
          </TombolEditor>
          <TombolEditor
            label="Buat daftar bernomor"
            aktif={editor?.isActive("orderedList")}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={19} aria-hidden="true" />
          </TombolEditor>
          <TombolEditor
            label="Tambahkan tautan"
            aktif={editor?.isActive("link")}
            onClick={aturTautan}
          >
            <LinkIcon size={19} aria-hidden="true" />
          </TombolEditor>
          <TombolEditor
            label="Buat kutipan"
            aktif={editor?.isActive("blockquote")}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={19} aria-hidden="true" />
          </TombolEditor>
          <TombolEditor
            label="Sisipkan gambar"
            dinonaktifkan={sedangUnggah}
            onClick={() => inputGambar.current?.click()}
          >
            <ImagePlus size={19} aria-hidden="true" />
          </TombolEditor>
          <input
            ref={inputGambar}
            type="file"
            accept="image/*,.heic,.heif"
            onChange={sisipkanGambar}
            className="hidden"
          />
        </div>

        <EditorContent
          editor={editor}
          className="
            [&_.ProseMirror_p]:mb-4
            [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:mt-6 [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold
            [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:mt-5 [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold
            [&_.ProseMirror_ul]:mb-4 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6
            [&_.ProseMirror_ol]:mb-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6
            [&_.ProseMirror_blockquote]:my-5 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-hijau-muda [&_.ProseMirror_blockquote]:pl-4
            [&_.ProseMirror_a]:text-hijau-utama [&_.ProseMirror_a]:underline
            [&_.ProseMirror_img]:my-5 [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-lg
          "
        />
      </div>
      {pesanError && (
        <p role="alert" className="mt-1.5 text-sm text-merah-layanan">
          {pesanError}
        </p>
      )}
      {pesanUnggah && (
        <p role="status" className="mt-1.5 text-sm text-tinta-redup">
          {sedangUnggah ? "Mengunggah gambar..." : pesanUnggah}
        </p>
      )}
    </div>
  );
}
