import React from 'react'
import SignUpTemplate from './page-template'


const SignUpPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>회원가입</h1>
      <SignUpTemplate />
    </div>
  )
}

export default SignUpPage
