import assert from "node:assert/strict";
import test from "node:test";
import {
  gabungkanNaskahSejarah,
  pisahkanNaskahSejarah,
} from "./naskah-sejarah";

test("naskah lama tetap dibaca sebagai sejarah", () => {
  assert.deepEqual(pisahkanNaskahSejarah("<p>Riwayat lama.</p>"), {
    sejarah: "<p>Riwayat lama.</p>",
    legenda: "",
  });
});

test("sejarah dan legenda dapat disimpan lalu dipisahkan kembali", () => {
  const bagian = {
    sejarah: "<p>Riwayat Desa Sangge.</p>",
    legenda: "<p>Kisah Sendang Sangge.</p>",
  };

  assert.deepEqual(
    pisahkanNaskahSejarah(gabungkanNaskahSejarah(bagian)),
    bagian,
  );
});

test("legenda boleh dikosongkan tanpa mengubah sejarah", () => {
  const bagian = {
    sejarah: "<p>Riwayat Desa Sangge.</p>",
    legenda: "",
  };

  assert.deepEqual(
    pisahkanNaskahSejarah(gabungkanNaskahSejarah(bagian)),
    bagian,
  );
});
