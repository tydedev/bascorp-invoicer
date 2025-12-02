import { Invoice } from "@/types/invoice";
import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
  openPreview: (title: string) => ipcRenderer.invoke("open-preview", title),
  getInvoice: () => ipcRenderer.invoke("get-invoice"),
  setInvoice: (invoice: Invoice) => ipcRenderer.send("set-invoice", invoice),
  onInvoiceUpdated: (callback: (invoice: Invoice) => void) =>
    ipcRenderer.on("invoice-updated", (_e, invoice) => callback(invoice)),
});

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
});
