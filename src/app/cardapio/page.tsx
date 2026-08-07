import Link from "next/link";
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero banner */}
      <div className="relative h-56 md:h-72 w-full overflow-hidden">
        <Image
          src="/menu/hero-banner.jpg"
          alt="Ambiente do restaurante"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-50 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Aberto agora
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-4 flex items-end gap-4">
          <div className="size-16 md:size-20 rounded-2xl bg-[#E85D5D] border-4 border-white dark:border-slate-950 shadow-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-2xl md:text-3xl">R</span>
          </div>
          <div className="pb-1">
            <h1 className="text-white font-bold text-xl md:text-3xl drop-shadow-sm">RXSAAS Pizzaria</h1>
            <p className="text-white/80 text-sm hidden md:block">
              Massa artesanal · Ingredientes selecionados
            </p>
          </div>
        </div>
      </div>

      {/* Sticky category nav */}
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
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
          <Link href="/" className="text-[#E85D5D] hover:underline mt-2 inline-block">
            ← Voltar para o site
          </Link>
        </div>
      </footer>
    </div>
  );
}
