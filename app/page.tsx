'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(0)
  
  const steps = [
    { id: 0, name: '选择类型', description: '选择信件或明信片' },
    { id: 1, name: 'AI创作', description: '使用AI辅助创作内容' },
    { id: 2, name: '填写信息', description: '填写收寄件人信息' },
    { id: 3, name: '预览提交', description: '预览并提交订单' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary-600">CloudPost AI</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/login" className="text-gray-600 hover:text-primary-600">登录</Link></li>
              <li><Link href="/dashboard" className="text-gray-600 hover:text-primary-600">管理</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            用AI创作，邮寄真实信件
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            通过AI辅助，轻松创作并邮寄实体信件或明信片。让科技传递温度。
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
          <div className="flex justify-between items-center mb-8">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center w-1/4">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    currentStep === step.id 
                      ? 'bg-primary-600 text-white' 
                      : currentStep > step.id 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.id + 1}
                </div>
                <h3 className="font-medium text-gray-900">{step.name}</h3>
                <p className="text-sm text-gray-500 hidden md:block">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-8 min-h-[400px] flex flex-col items-center justify-center">
            {currentStep === 0 && (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">选择信件类型</h3>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="bg-white border-2 border-primary-500 rounded-xl p-8 w-64 hover:bg-primary-50 transition-colors"
                  >
                    <div className="text-5xl mb-4">✉️</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">信件</h4>
                    <p className="text-gray-600">撰写个性化信件内容</p>
                  </button>
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="bg-white border-2 border-primary-500 rounded-xl p-8 w-64 hover:bg-primary-50 transition-colors"
                  >
                    <div className="text-5xl mb-4">🃏</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">明信片</h4>
                    <p className="text-gray-600">AI生成个性化图片</p>
                  </button>
                </div>
              </div>
            )}

            {currentStep > 0 && (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {steps[currentStep]?.name}
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <p className="text-gray-600 mb-4">
                    {steps[currentStep]?.description}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={() => setCurrentStep((prev: number) => Math.max(0, prev - 1))}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      上一步
                    </button>
                    <button 
                      onClick={() => setCurrentStep((prev: number) => Math.min(steps.length - 1, prev + 1))}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      {currentStep === steps.length - 1 ? '完成' : '下一步'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI辅助创作</h3>
            <p className="text-gray-600">
              利用先进的AI技术帮助您轻松创作个性化的信件内容或生成独特的明信片图像。
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl mb-4">💌</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">实体邮寄</h3>
            <p className="text-gray-600">
              我们将您创作的内容打印并邮寄到指定地址，让数字创作变为真实的触感体验。
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">安全可靠</h3>
            <p className="text-gray-600">
              采用Cloudflare安全技术保护您的数据隐私，确保您的创作内容安全送达。
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>© {new Date().getFullYear()} CloudPost AI. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}