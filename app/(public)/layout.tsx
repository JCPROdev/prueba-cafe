import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { getCachedLandingData } from "@/lib/sanity/queries";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const { brand } = await getCachedLandingData();

  return (
    <>
      <Navbar brand={brand} />
      <main className="flex-1">{children}</main>
      <Footer brand={brand} />
    </>
  );
}
