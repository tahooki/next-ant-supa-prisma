
import { Inter } from 'next/font/google';


import { createClient } from '@/utils/supabase/server';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import 'antd/dist/reset.css';
import React from 'react';
import { User } from '../models/user.model';
import LayoutHeader from './(layout)/header';
import './globals.css';

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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let userModel: User | any | null = null;
  
  if (user?.id) {
    console.log('user : ', user);
    userModel = new User({
      auth: user?.id,
    });

    await userModel.read();
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <LayoutHeader user={userModel?.toJSON()}></LayoutHeader>
          {React.Children.map(children, child =>
            React.cloneElement(child as React.ReactElement, { user: userModel?.toJSON() })
          )}
        </AntdRegistry>
      </body>
    </html>
  );
}
