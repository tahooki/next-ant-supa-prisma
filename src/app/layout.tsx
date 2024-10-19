import Navigation from '@/components/Navigation';

import { Layout } from 'antd';
import { Inter } from 'next/font/google';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import 'antd/dist/reset.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const { Content, Footer } = Layout;

export const metadata = {
  title: '당신의 앱 이름',
  description: '당신의 앱 설명',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <Layout className="layout" style={{ minHeight: '100vh' }}>
            <Navigation />
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
              {children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              ©{new Date().getFullYear()} 당신의 회사 이름
            </Footer>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
