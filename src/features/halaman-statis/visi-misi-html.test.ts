import assert from "node:assert/strict";
import test from "node:test";
import {
  ambilButirMisiHtml,
  gabungkanMisiHtml,
  normalkanHtml,
  punyaIsiHtml,
} from "./visi-misi-html";

test("teks lama dinormalkan menjadi paragraf aman", () => {
  assert.equal(
    normalkanHtml('Desa <Sangge> & "maju"'),
    "<p>Desa &lt;Sangge&gt; &amp; &quot;maju&quot;</p>",
  );
});

test("daftar misi lama digabung menjadi ordered list", () => {
  assert.equal(
    gabungkanMisiHtml(["Misi pertama", "Misi kedua"]),
    "<ol><li><p>Misi pertama</p></li><li><p>Misi kedua</p></li></ol>",
  );
});

test("butir misi kaya dipisahkan tanpa kehilangan format inline", () => {
  assert.deepEqual(
    ambilButirMisiHtml(
      "<ol><li><p>Misi <strong>pertama</strong></p></li><li><p>Misi <em>kedua</em></p></li></ol>",
    ),
    [
      "<p>Misi <strong>pertama</strong></p>",
      "<p>Misi <em>kedua</em></p>",
    ],
  );
});

test("paragraf menjadi fallback ketika daftar bernomor dilepas", () => {
  assert.deepEqual(ambilButirMisiHtml("<p>Satu</p><p>Dua</p>"), [
    "<p>Satu</p>",
    "<p>Dua</p>",
  ]);
});

test("elemen editor kosong tidak dianggap memiliki isi", () => {
  assert.equal(punyaIsiHtml("<p></p>"), false);
  assert.equal(punyaIsiHtml("<ol><li><p><br></p></li></ol>"), false);
  assert.equal(punyaIsiHtml('<p><img src="/media/foto.jpg"></p>'), true);
});

