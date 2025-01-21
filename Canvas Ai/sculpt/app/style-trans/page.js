'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Brush, Upload, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import "../globals.css"

export default function PageJsx() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const styleOptions = [
    { id: 'style1', src: '/img/starrynight.jfif', alt: 'Starry Night' },
    { id: 'style2', src: '/img/scream.png', alt: 'The Scream' },
    { id: 'style3', src: '/img/mona.png', alt: 'Mona Lisa' },
  ]
  const convertImageToBase64 = async (imageSrc) => {
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Base64 without prefix
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const handleStyleTransfer = async () => {
    if (!uploadedImage || !selectedStyle) {
      alert('Please upload an image and select a style.');
      return;
    }
  
    setIsProcessing(true);
  
    try {
      const styleBase64 = await convertImageToBase64(selectedStyle);
  
      const requestBody = {
        content_image: uploadedImage.split(',')[1], // Base64 without prefix
        style_image: styleBase64, // Base64 of selected style
      };
  
      console.log('Request Body:', requestBody); // Confirm format
  
      const response = await fetch('http://localhost:5000/api/style-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (response.ok) {
        setResultImage(`data:image/png;base64,${data.image}`);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setUploadedImage(e.target?.result)
      reader.readAsDataURL(file)
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
        <h1 className="text-4xl font-bold text-center mb-8">Style Transfer</h1>
        
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">1. Upload Your Image</h2>
                <div className="flex items-center justify-center w-full">
                  <Label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input
                      id="image-upload"
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
                      alt="Uploaded image"
                      width={300}
                      height={400}
                      className="mx-auto rounded-lg" />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">2. Select a Style</h2>
                <RadioGroup
                  onValueChange={(value) => {
                    console.log('onValueChange triggered with value:', value);
                    setSelectedStyle(value);
                    console.log('Updated selectedStyle:', value);
                  }}
                >

                  {styleOptions.map((style) => (
                    <Label key={style.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={style.src} />
                      <Image src={style.src} alt={style.alt} width={50} height={50} className="rounded-lg" />
                      <span>{style.alt}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <Button
                onClick={handleStyleTransfer}
                className="w-full mb-4"
                disabled={!uploadedImage || !selectedStyle || isProcessing}>
                {isProcessing ? 'Processing...' : 'Apply Style Transfer'}
              </Button>

              {resultImage && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-2">3. Result</h2>
                  <div className="flex justify-center">
                    <Image
                      src={resultImage}
                      alt="Result"
                      width={300}
                      height={400}
                      className="rounded-lg" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}