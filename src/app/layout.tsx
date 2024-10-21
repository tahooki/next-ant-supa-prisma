
import { Layout } from 'antd';
import { Inter } from 'next/font/google';

import { createClient } from '@/utils/supabase/server';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import 'antd/dist/reset.css';
import LayoutHeader from './(layout)/header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const { Content, Footer } = Layout;

export const metadata = {
  title: '당신의 앱 이름',
  description: '당신의 앱 설명',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log("user : ", user);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <LayoutHeader user={user}></LayoutHeader>
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}
