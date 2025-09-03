// Patch localhost port in manifest.xml (dev only)
const fs = require("fs");
const path = require("path");

const DEV_PORT =
  Number(process.env.PORT) ||
  Number(process.env.npm_package_config_dev_server_port) ||
  7000;

const manifestPath = path.join(process.cwd(), "manifest.xml");
const devUrl = `https://localhost:${DEV_PORT}/`;

function patch(file) {
  const xml = fs.readFileSync(file, "utf8");
  // Replace any https://localhost:<port>/taskpane.html or /commands.html with our chosen port
  const replaced = xml
    .replace(/https:\/\/localhost:\d+\/taskpane\.html/g, `${devUrl}taskpane.html`)
    .replace(/https:\/\/localhost:\d+\/commands\.html/g, `${devUrl}commands.html`)
    .replace(/<AppDomain>https:\/\/localhost:\d+<\/AppDomain>/g, `<AppDomain>https://localhost:${DEV_PORT}</AppDomain>`);
  if (replaced !== xml) {
    fs.writeFileSync(file, replaced, "utf8");
    console.log(`✅ Patched ${path.basename(file)} to ${devUrl}`);
  } else {
    console.log(`ℹ️  No localhost URLs to patch in ${path.basename(file)} (already ${devUrl}?)`);
  }
}

patch(manifestPath);