import { app, BrowserWindow, ipcMain } from "electron";
// import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "path";
import { initialInvoiceData } from "../src/lib/constants";

// const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let previewWindow: BrowserWindow | null;
let currentInvoice = initialInvoiceData;
const previewWindows: BrowserWindow[] = [];

function createWindow() {
  win = new BrowserWindow({
    title: "Bascorp Invoicer",
    width: 1024,
    height: 728,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  // Blocca la chiusura se c'è almeno una preview aperta
  win.on("close", (event) => {
    const anyPreviewOpen = previewWindows.some((pw) => pw && !pw.isDestroyed());
    if (anyPreviewOpen) {
      event.preventDefault();
      win?.focus(); // porta la finestra principale in focus
      previewWindows.forEach((pw) => pw.focus()); // porta la preview in primo piano
      return;
    }
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

function createPreviewWindow(title = "Anteprima") {
  if (previewWindow && !previewWindow.isDestroyed()) {
    previewWindow.focus();
    previewWindow.setTitle(title);
    return previewWindow;
  }

  previewWindow = new BrowserWindow({
    title,
    width: 800,
    height: 600,
    parent: win!, // <--- la finestra principale diventa "madre"
    modal: false, // puoi anche mettere true se vuoi che blocchi la finestra madre
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  if (VITE_DEV_SERVER_URL) {
    previewWindow.loadURL(VITE_DEV_SERVER_URL + "/preview.html");
  } else {
    previewWindow.loadFile(path.join(RENDERER_DIST, "preview.html"));
  }

  previewWindows.push(previewWindow);

  previewWindow.on("closed", () => {
    const index = previewWindows.indexOf(previewWindow!);
    if (index > -1) previewWindows.splice(index, 1);
    previewWindow = null;
  });

  return previewWindow;
}

// IPC
ipcMain.handle("open-preview", (_event, title: string) => {
  createPreviewWindow(title);
});

ipcMain.handle("get-invoice", () => currentInvoice);

ipcMain.on("set-invoice", (_event, invoice) => {
  currentInvoice = invoice;

  // Aggiorna live tutte le preview aperte
  previewWindows.forEach((pw) => {
    if (!pw.isDestroyed()) {
      pw.webContents.send("invoice-updated", currentInvoice);
    }
  });
});

// Eventi app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    previewWindow = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
