import { ipcMain as d, app as l, BrowserWindow as p } from "electron";
import { fileURLToPath as u } from "node:url";
import i from "path";
const w = 0, h = {
  invoiceNumber: `${w + 1}`,
  date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
  jobType: "",
  clientName: "",
  clientSurname: "",
  clientStreet: "",
  clientStreetNumber: "",
  clientCity: "",
  clientProvince: "",
  clientCountry: "",
  clientCompany: "",
  clientVAT: "",
  clientPostalCode: "",
  clientEmail: "",
  clientPhone: "",
  items: [
    { id: 1, description: "", quantity: 0, measure: "", price: 0, total: 0 }
  ],
  notes: [],
  subTotal: 0,
  total: 0,
  tax: 0
}, v = i.dirname(u(import.meta.url));
process.env.APP_ROOT = i.join(v, "..");
const c = process.env.VITE_DEV_SERVER_URL, T = i.join(process.env.APP_ROOT, "dist-electron"), m = i.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = c ? i.join(process.env.APP_ROOT, "public") : m;
let n, e, a = h;
const s = [];
function f() {
  n = new p({
    title: "Bascorp Invoicer",
    width: 1024,
    height: 728,
    icon: i.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: i.join(v, "preload.mjs")
    }
  }), n.on("close", (r) => {
    if (s.some((t) => t && !t.isDestroyed())) {
      r.preventDefault(), n == null || n.focus(), s.forEach((t) => t.focus());
      return;
    }
  }), n.webContents.on("did-finish-load", () => {
    n == null || n.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), c ? n.loadURL(c) : n.loadFile(i.join(m, "index.html"));
}
function P(r = "Anteprima") {
  return e && !e.isDestroyed() ? (e.focus(), e.setTitle(r), e) : (e = new p({
    title: r,
    width: 800,
    height: 600,
    parent: n,
    // <--- la finestra principale diventa "madre"
    modal: !1,
    // puoi anche mettere true se vuoi che blocchi la finestra madre
    icon: i.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: i.join(v, "preload.mjs")
    }
  }), c ? e.loadURL(c + "/preview.html") : e.loadFile(i.join(m, "preview.html")), s.push(e), e.on("closed", () => {
    const o = s.indexOf(e);
    o > -1 && s.splice(o, 1), e = null;
  }), e);
}
d.handle("open-preview", (r, o) => {
  P(o);
});
d.handle("get-invoice", () => a);
d.on("set-invoice", (r, o) => {
  a = o, s.forEach((t) => {
    t.isDestroyed() || t.webContents.send("invoice-updated", a);
  });
});
l.on("window-all-closed", () => {
  process.platform !== "darwin" && (l.quit(), n = null, e = null);
});
l.on("activate", () => {
  p.getAllWindows().length === 0 && f();
});
l.whenReady().then(f);
export {
  T as MAIN_DIST,
  m as RENDERER_DIST,
  c as VITE_DEV_SERVER_URL
};
