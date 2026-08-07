import Image from "next/image";

import { db } from "@/lib/db";
import { ProductRow } from "@/components/cardapio/product-row";
import { CartBar } from "@/components/cardapio/cart-bar";

export const dynamic = "force-dynamic";

export default async function CardapioPage() {
  const restaurant = await db.restaurant.findUnique({ where: { slug: "default" } });

  const categories = restaurant
    ? await db.category.findMany({
        where: { restaurantId: restaurant.id, isActive: true },
        orderBy: { order: "asc" },
        include: {
          products: {
            where: { isActive: true },
            orderBy: { order: "asc" },
            include: { optionGroups: { include: { options: { orderBy: { order: "asc" } } } } },
          },
        },
      })
    : [];

  const featuredTiles = [
    categories.find((c) => c.name === "Pizzas Salgadas") ?? categories[0],
    categories.find((c) => c.name === "Sobremesas") ?? categories[categories.length - 1],
  ]
    .filter((c): c is (typeof categories)[number] => Boolean(c))
    .map((c) => ({
      id: c.id,
      name: c.name,
      image: c.products.find((p) => p.image)?.image,
    }))
    .filter((t) => Boolean(t.image));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden">
        <Image
          src="/menu/hero-banner.jpg"
          alt="Ambiente do restaurante"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-center max-w-3xl mx-auto px-6 md:px-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="size-12 md:size-14 rounded-xl bg-[#E85D5D] flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-white font-bold text-xl md:text-2xl">R</span>
            </div>
            <span className="bg-white/15 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Aberto agora
            </span>
          </div>
          <h1 className="text-white font-bold text-3xl md:text-5xl leading-tight drop-shadow-sm max-w-md">
            Pizza artesanal,
            <br />
            feita com calma.
          </h1>
          <p className="text-white/85 text-sm md:text-base mt-3 max-w-sm">
            Massa de fermentação lenta e ingredientes selecionados, com o pedido enviado direto pro nosso
            WhatsApp.
          </p>
          <a
            href="#menu"
            className="mt-6 inline-flex items-center gap-2 w-fit px-6 py-3 bg-[#E85D5D] hover:bg-[#D84C4C] text-white font-semibold text-sm rounded-lg transition shadow-lg"
          >
            Ver cardápio
          </a>
        </div>
      </div>

      {/* Featured category tiles */}
      {featuredTiles.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-10 grid grid-cols-2 gap-3 pb-2">
          {featuredTiles.map((tile) => (
            <a
              key={tile.id}
              href={`#${tile.id}`}
              className="relative rounded-xl overflow-hidden h-28 md:h-36 group shadow-lg"
            >
              <Image
                src={tile.image!}
                alt={tile.name}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
                sizes="(max-width: 640px) 50vw, 340px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-white font-bold text-sm md:text-base drop-shadow-sm">{tile.name}</p>
                <span className="text-white/85 text-xs">Ver mais →</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Sticky category nav */}
      <nav
        id="menu"
        className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="max-w-3xl mx-auto px-4 flex gap-1 py-2 min-w-max md:min-w-0">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#E85D5D] hover:bg-[#E85D5D]/10 transition whitespace-nowrap"
            >
              {c.name}
            </a>
          ))}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-28">
        {categories.length === 0 && (
          <p className="text-center text-slate-500 py-12">Cardápio ainda não disponível.</p>
        )}

        <div className="space-y-10">
          {categories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-16">
              <h2 className="text-lg font-bold text-[#E85D5D] mb-1">{category.name}</h2>
              {category.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {category.description}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {category.products.map((product) => {
                  const sizeGroup = product.optionGroups.find((g) => g.type === "SIZE");
                  return (
                    <ProductRow
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      description={product.description}
                      image={product.image}
                      basePrice={Number(product.price)}
                      sizeOptions={
                        sizeGroup?.options.map((o) => ({ id: o.id, name: o.name, price: Number(o.price) })) ?? []
                      }
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      <CartBar />

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center text-slate-500 dark:text-slate-500 text-xs">
          <p>© 2026 RXSAAS - Sistema de Gestão para Bares e Restaurantes</p>
          <p className="mt-1">
            Fotos ilustrativas com licença aberta (Creative Commons) via Openverse.
          </p>
        </div>
      </footer>
    </div>
  );
}
