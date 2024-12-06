'use client'

import { Button, Form, Input, message } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
const SignUpTemplate: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    const { email, password, name } = values

    try {
      const response = await axios.post('/api/auth/signup/email', {
        email,
        password,
        username: name,
      })

      if (response.status !== 200) {
        throw new Error('Failed to sign up')
      }

      message.success('회원가입이 완료되었습니다.')
    } catch (error) {
      console.error('Error during sign up:', error)
      message.error('회원가입 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      name="signup"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 300, margin: '0 auto' }}
    >
      <Form.Item
        name="email"
        label="이메일"
        rules={[{ required: true, type: 'email', message: '유효한 이메일을 입력해주세요.' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="비밀번호"
        rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="name"
        label="이름"
        rules={[{ required: true, message: '이름을 입력해주세요.' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          회원가입
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SignUpTemplate
