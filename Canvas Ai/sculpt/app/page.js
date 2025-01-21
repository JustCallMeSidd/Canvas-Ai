'use client'

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { PaintbrushIcon as PaintBrush, Palette, Brush } from 'lucide-react'
import { Button } from "@/components/ui/button"
import "./globals.css"

export default function PageJsx() {
  return (
    (<div className="w-full min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Brush className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Sculpt</span>
          </Link>
          <div className="space-x-4">
            <Button variant="ghost">Log in</Button>
            <Button>Sign up</Button>
          </div>
        </div>
      </header>
      {/* Hero Section with gradient background */}
      <section
        className="relative w-full py-20 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1
              className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Experience AI-Powered Image Transformation
            </h1>
            <p className="text-lg text-blue-100 md:text-xl">
              Transform your images with state-of-the-art GAN models. Try our style transfer and sketch colorization tools.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent to-white/20 pointer-events-none" />
      </section>
      {/* GAN Models Cards Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Style Transfer GAN Card */}
            <Link
              href="/style-transfer"
              className="block transition-transform hover:scale-105">
              <Card className="h-full">
                <CardHeader>
                  <div
                    className="w-12 h-12 mb-4 rounded-lg bg-blue-100 flex items-center justify-center">
                    <PaintBrush className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Style Transfer GAN</CardTitle>
                  <CardDescription>
                    Transform your photos into artistic masterpieces using various style presets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="aspect-video rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
                    <span className="text-sm text-blue-600">Style Transfer Preview</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Sketch to Color GAN Card */}
            <Link
              href="/sketch-to-color"
              className="block transition-transform hover:scale-105">
              <Card className="h-full">
                <CardHeader>
                  <div
                    className="w-12 h-12 mb-4 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Sketch to Color GAN</CardTitle>
                  <CardDescription>
                    Bring your sketches to life with automatic colorization powered by AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="aspect-video rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
                    <span className="text-sm text-blue-600">Colorization Preview</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>)
  );
}