import type { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header></Header>
      <main className='h-[calc(100%_-_76px)] overflow-auto'>{children}</main>
      <Footer></Footer>
    </>
  );
}
