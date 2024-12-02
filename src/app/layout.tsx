
import { Inter } from 'next/font/google';


import { createClient } from '@/utils/supabase/server';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import 'antd/dist/reset.css';
import React from 'react';
import { requestModel } from './(apis)/model.api';
import LayoutHeader from './(layout)/header';
import './globals.css';
import initAxios from './init-axios';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '당신의 앱 이름',
  description: '당신의 앱 설명',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  initAxios();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userModel: any = null;

  if (user?.id) {
    const res = await requestModel('user', {
      auth: user?.id,
    });

    userModel = res.data;
  }
  
  if (user?.id) {
    console.log('user : ', user);
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <LayoutHeader user={userModel}></LayoutHeader>
          {React.Children.map(children, child =>
            React.cloneElement(child as React.ReactElement, { user: userModel })
          )}
        </AntdRegistry>
      </body>
    </html>
  );
}