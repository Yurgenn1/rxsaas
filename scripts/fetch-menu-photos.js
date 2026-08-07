const fs = require("fs");
const path = require("path");
const https = require("https");

const OUT_DIR = path.join(__dirname, "..", "public", "menu");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const items = [
  { slug: "pizza-margherita", term: "margherita pizza close up basil" },
  { slug: "pizza-calabresa", term: "pepperoni sausage pizza slice" },
  { slug: "pizza-portuguesa", term: "portuguese pizza ham egg olives" },
  { slug: "pizza-frango-catupiry", term: "chicken cheese pizza shredded chicken" },
  { slug: "pizza-quatro-queijos", term: "four cheese pizza quattro formaggi" },
  { slug: "pizza-pepperoni", term: "pepperoni pizza melted cheese overhead" },
  { slug: "pizza-bresaola", term: "arugula parmesan gourmet pizza" },
  { slug: "pizza-camarao-catupiry", term: "shrimp cream cheese pizza gourmet" },
  { slug: "pizza-figo-gorgonzola", term: "fig gorgonzola prosciutto pizza honey" },
  { slug: "refrigerante", term: "cold soda can condensation" },
  { slug: "suco-laranja", term: "fresh orange juice glass pitcher" },
  { slug: "agua-mineral", term: "mineral water bottle table restaurant" },
  { slug: "cerveja-ipa", term: "craft beer IPA long neck bottle" },
  { slug: "chopp-pilsen", term: "pilsner beer can pouring glass" },
  { slug: "limonada-suica", term: "swiss lemonade condensed milk drink glass" },
  { slug: "pao-de-alho", term: "garlic bread grilled" },
  { slug: "bolinho-de-queijo", term: "fried cheese balls appetizer" },
  { slug: "batata-frita", term: "rustic fries rosemary bowl restaurant" },
  { slug: "borda-recheada", term: "stuffed crust pizza edge closeup" },
  { slug: "pizza-chocolate-morango", term: "chocolate strawberry dessert pizza" },
  { slug: "pizza-banana-canela", term: "banana cinnamon dessert pizza" },
  { slug: "pizza-doce-de-leite-coco", term: "dulce de leche coconut dessert pizza" },
  { slug: "pizza-nutella-morango", term: "nutella strawberry dessert pizza" },
  { slug: "petit-gateau", term: "petit gateau molten chocolate cake ice cream" },
  { slug: "pudim-de-leite", term: "flan caramel pudding dessert" },
  { slug: "brigadeiro", term: "gourmet chocolate truffle dessert" },
  { slug: "brownie-sorvete", term: "brownie sundae ice cream chocolate sauce" },
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
  const pick =
    data.results.find((r) => r.width >= 600 && r.height >= 400) || data.results[0];
  return pick;
}

async function main() {
  const attributions = {};
  for (const item of items) {
    try {
      const result = await searchOpenverse(item.term);
      if (!result) {
        console.log(`⚠️  Sem resultado: ${item.slug} (${item.term})`);
        continue;
      }
      const ext = result.url.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/i)?.[1] || "jpg";
      const filename = `${item.slug}.${ext}`;
      const destPath = path.join(OUT_DIR, filename);
      await downloadFile(result.url, destPath);
      attributions[item.slug] = {
        file: `/menu/${filename}`,
        attribution: result.attribution || `Photo by ${result.creator}`,
        source: result.foreign_landing_url,
        license: result.license,
      };
      console.log(`✅ ${item.slug} -> ${filename} (${result.license})`);
    } catch (err) {
      console.log(`❌ Erro em ${item.slug}: ${err.message}`);
    }
    // Small delay to be polite to the API
    await new Promise((r) => setTimeout(r, 300));
  }

  fs.writeFileSync(
    path.join(__dirname, "..", "public", "menu", "attributions.json"),
    JSON.stringify(attributions, null, 2)
  );
  console.log(`\n✅ Concluído: ${Object.keys(attributions).length}/${items.length} fotos baixadas.`);
}

main();
