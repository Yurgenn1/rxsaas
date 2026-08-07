const fs = require("fs");
const path = require("path");
const https = require("https");

const OUT_DIR = path.join(__dirname, "..", "public", "menu");

const retryItems = [
  { slug: "pizza-margherita", terms: ["margherita pizza", "cheese pizza", "pizza"] },
  { slug: "pizza-portuguesa", terms: ["ham egg pizza", "pizza slice", "pizza"] },
  { slug: "pizza-pepperoni", terms: ["pepperoni pizza", "pizza"] },
  { slug: "pizza-bresaola", terms: ["gourmet pizza", "arugula pizza", "pizza"] },
  { slug: "pizza-figo-gorgonzola", terms: ["gorgonzola pizza", "cheese pizza", "pizza"] },
  { slug: "suco-laranja", terms: ["orange juice", "fresh juice glass"] },
  { slug: "agua-mineral", terms: ["water bottle", "mineral water"] },
  { slug: "cerveja-ipa", terms: ["craft beer bottle", "beer bottle"] },
  { slug: "chopp-pilsen", terms: ["beer glass", "beer can"] },
  { slug: "limonada-suica", terms: ["lemonade glass", "lemonade"] },
  { slug: "batata-frita", terms: ["french fries", "fries bowl"] },
  { slug: "borda-recheada", terms: ["pizza crust", "pizza slice cheese"] },
  { slug: "pizza-banana-canela", terms: ["banana dessert", "banana pizza", "sweet pizza"] },
  { slug: "pizza-doce-de-leite-coco", terms: ["coconut dessert", "caramel dessert"] },
  { slug: "pizza-nutella-morango", terms: ["chocolate strawberry", "nutella dessert", "chocolate pizza"] },
  { slug: "petit-gateau", terms: ["chocolate lava cake", "molten chocolate cake", "chocolate cake"] },
];

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "RXSAAS-demo/1.0" } }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "RXSAAS-demo/1.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadFile(res.headers.location, destPath).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on("finish", () => fileStream.close(resolve));
      })
      .on("error", reject);
  });
}

async function searchOpenverse(term) {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(
    term
  )}&license_type=commercial&size=medium&mature=false&page_size=5`;
  const data = await httpGetJson(url);
  if (!data.results || data.results.length === 0) return null;
  return data.results.find((r) => r.width >= 600 && r.height >= 400) || data.results[0];
}

async function main() {
  const attributions = JSON.parse(
    fs.readFileSync(path.join(OUT_DIR, "attributions.json"), "utf-8")
  );

  for (const item of retryItems) {
    let found = null;
    let usedTerm = null;
    for (const term of item.terms) {
      found = await searchOpenverse(term);
      if (found) {
        usedTerm = term;
        break;
      }
      await new Promise((r) => setTimeout(r, 300));
    }
    if (!found) {
      console.log(`❌ Ainda sem resultado: ${item.slug}`);
      continue;
    }
    const ext = found.url.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/i)?.[1] || "jpg";
    const filename = `${item.slug}.${ext}`;
    const destPath = path.join(OUT_DIR, filename);
    try {
      await downloadFile(found.url, destPath);
      attributions[item.slug] = {
        file: `/menu/${filename}`,
        attribution: found.attribution || `Photo by ${found.creator}`,
        source: found.foreign_landing_url,
        license: found.license,
      };
      console.log(`✅ ${item.slug} -> ${filename} (termo: "${usedTerm}", licença: ${found.license})`);
    } catch (err) {
      console.log(`❌ Erro ao baixar ${item.slug}: ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "attributions.json"),
    JSON.stringify(attributions, null, 2)
  );
  console.log(`\n✅ Total agora: ${Object.keys(attributions).length}/27 fotos.`);
}

main();
