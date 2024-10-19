'use client';

import { Layout, Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header } = Layout;

export default function Navigation() {
  const pathname = usePathname();

  const items = [
    { key: '/', label: <Link href="/">홈</Link> },
    { key: '/login', label: <Link href="/login">로그인</Link> },
    { key: '/signup', label: <Link href="/signup">회원가입</Link> },
  ];

  return (
    <Header>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[pathname]}
        items={items}
      />
    </Header>
  );
}