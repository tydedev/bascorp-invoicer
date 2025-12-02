import fs from "fs";
import path from "path";
import sharp from "sharp";

// --- CONFIG ---
const svgPath = path.resolve("src/assets/logo.svg");
const outputDir = path.join("build", "icons");

const windowsSizes = [16, 32, 48, 256];
const macSizes = [16, 32, 128, 256, 512, 1024];
const linuxSizes = [16, 32, 48, 64, 128, 256, 512];

// crea cartelle se non esistono
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(path.join(outputDir, "win"))) fs.mkdirSync(path.join(outputDir, "win"));
if (!fs.existsSync(path.join(outputDir, "mac"))) fs.mkdirSync(path.join(outputDir, "mac"));
if (!fs.existsSync(path.join(outputDir, "png"))) fs.mkdirSync(path.join(outputDir, "png"));

// --- WINDOWS (.ico) ---
async function generateWindowsIcon() {
  const images = [];
  for (const size of windowsSizes) {
    const buffer = await sharp(svgPath)
      .resize(size, size)
      .png()
      .toBuffer();
    images.push(buffer);
  }
  // sharp non genera .ico direttamente, usiamo npm package 'to-ico'
  const toIco = (await import("to-ico")).default;
  const icoBuffer = await toIco(images);
  fs.writeFileSync(path.join(outputDir, "win", "app-icon.ico"), icoBuffer);
  console.log("✅ Windows .ico generato");
}

// --- MAC (.icns) ---
async function generateMacIcon() {
  const iconsetDir = path.join(outputDir, "mac", "MyIcon.iconset");
  if (!fs.existsSync(iconsetDir)) fs.mkdirSync(iconsetDir, { recursive: true });

  const iconMapping = [
    [16, "icon_16x16.png"],
    [32, "icon_16x16@2x.png"],
    [32, "icon_32x32.png"],
    [64, "icon_32x32@2x.png"],
    [128, "icon_128x128.png"],
    [256, "icon_128x128@2x.png"],
    [256, "icon_256x256.png"],
    [512, "icon_256x256@2x.png"],
    [512, "icon_512x512.png"],
    [1024, "icon_512x512@2x.png"],
  ];

  for (const [size, name] of iconMapping) {
    await sharp(svgPath).resize(size, size).png().toFile(path.join(iconsetDir, name));
  }

  // genera .icns usando icnsutil (solo mac)
  const { execSync } = await import("child_process");
  const icnsPath = path.join(outputDir, "mac", "app-icon.icns");
  execSync(`iconutil -c icns ${iconsetDir} -o ${icnsPath}`);
  console.log("✅ Mac .icns generato");
}

// --- LINUX (PNG multipli) ---
async function generateLinuxIcons() {
  for (const size of linuxSizes) {
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, "png", `${size}x${size}.png`));
  }
  console.log("✅ Linux PNG generati");
}

// --- ESECUZIONE ---
async function main() {
  await generateWindowsIcon();
  await generateMacIcon();
  await generateLinuxIcons();
  console.log("🎉 Tutte le icone sono pronte!");
}

main();
