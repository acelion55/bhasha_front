import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import BottomNav from '@/components/layout/bottom-nav';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh' }} className="flex flex-col justify-between pb-[70px] md:pb-0">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
