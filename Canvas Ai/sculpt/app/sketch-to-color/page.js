'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Brush, Upload, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import "../globals.css"

export default function PageJsx() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setUploadedImage(e.target?.result)
      reader.readAsDataURL(file)
    }
  }

  const handleColorization = async () => {
    setIsProcessing(true)
    setProgress(0)

    try {
      const response = await fetch('http://localhost:5000/api/sketch-to-color', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: uploadedImage.split(',')[1] }), // Send base64 string without the prefix
      })

      const data = await response.json()
      setResultImage(`data:image/png;base64,${data.image}`)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsProcessing(false)
      setProgress(100)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Brush className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Sculpt</span>
          </Link>
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Sketch to Color GAN</h1>
        
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">1. Upload Your Sketch</h2>
                <div className="flex items-center justify-center w-full">
                  <Label
                    htmlFor="sketch-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input
                      id="sketch-upload"
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*" />
                  </Label>
                </div>
                {uploadedImage && (
                  <div className="mt-4">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded sketch"
                      width={300}
                      height={400}
                      className="mx-auto rounded-lg" />
                  </div>
                )}
              </div>

              <Button
                onClick={handleColorization}
                className="w-full mb-4"
                disabled={!uploadedImage || isProcessing}>
                {isProcessing ? 'Processing...' : 'Colorize Sketch'}
              </Button>

              {isProcessing && (
                <div className="mb-6">
                  <Progress value={progress} className="w-full" />
                  <p className="text-center mt-2">Colorizing your sketch... {progress}%</p>
                </div>
              )}

              {resultImage && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-2">2. Colorized Result</h2>
                  <div className="flex justify-center space-x-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Original Sketch</h3>
                      <Image
                        src={uploadedImage}
                        alt="Original sketch"
                        width={300}
                        height={400}
                        className="rounded-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Colorized Image</h3>
                      <Image
                        src={resultImage}
                        alt="Colorized result"
                        width={300}
                        height={400}
                        className="rounded-lg" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}