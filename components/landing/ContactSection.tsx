import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import type { BrandInfo } from "@/types/sanity";

interface ContactItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

function buildItems(brand: BrandInfo): ContactItem[] {
  const items: ContactItem[] = [];
  if (brand.address) items.push({ icon: MapPin, label: "Dirección", value: brand.address });
  if (brand.phone) {
    items.push({
      icon: Phone,
      label: "Teléfono",
      value: brand.phone,
      href: `tel:${brand.phone.replace(/[^\d+]/g, "")}`,
    });
  }
  if (brand.email) {
    items.push({ icon: Mail, label: "Correo", value: brand.email, href: `mailto:${brand.email}` });
  }
  if (brand.schedule) items.push({ icon: Clock, label: "Horario", value: brand.schedule });
  return items;
}

export function ContactSection({ brand }: { brand: BrandInfo | null }) {
  const items = brand ? buildItems(brand) : [];

  return (
    <section id="contacto" className="scroll-mt-16 bg-white px-6 py-20">
      <RevealOnScroll className="mx-auto max-w-4xl">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Ubicación y contacto
        </h2>
        {items.length === 0 ? (
          <p className="text-center text-stone-500">Pronto compartiremos nuestros datos de contacto.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {items.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4 rounded-2xl border border-stone-200 p-5">
                <Icon className="mt-1 size-5 shrink-0 text-amber-700" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-stone-500">{label}</p>
                  {href ? (
                    <a href={href} className="whitespace-pre-line text-stone-900 hover:text-amber-700">
                      {value}
                    </a>
                  ) : (
                    <p className="whitespace-pre-line text-stone-900">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </RevealOnScroll>
    </section>
  );
}
