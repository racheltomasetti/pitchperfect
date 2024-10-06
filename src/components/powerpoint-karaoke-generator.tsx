"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock function to simulate slide deck generation
const generateSlideDeck = (topic: string, numSlides: number) => {
  return Array.from({ length: numSlides }, (_, i) => ({
    id: i,
    title: `Slide ${i + 1}`,
    content: `${topic}`
  }))
}

type Slide = {
  id: number
  title: string
  content: string
  imageUrl?: string
}

function GeneratorScreen({ onGenerate }: { onGenerate: (topic: string, numSlides: number) => void }) {
  const [topic, setTopic] = useState("")
  const [numSlides, setNumSlides] = useState(5)

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-800">PowerPoint Karaoke Generator</CardTitle>
        <CardDescription className="text-gray-600">Generate a random slide deck for PowerPoint Karaoke</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic" className="text-gray-700">Topic</Label>
          <Input
            id="topic"
            placeholder="Enter a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-gray-50 text-gray-800 border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numSlides" className="text-gray-700">Number of Slides</Label>
          <Input
            id="numSlides"
            type="number"
            min="1"
            max="20"
            value={numSlides}
            onChange={(e) => setNumSlides(parseInt(e.target.value, 10))}
            className="bg-gray-50 text-gray-800 border-gray-300"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onGenerate(topic, numSlides)} className="w-full">
          Generate Slide Deck
        </Button>
      </CardFooter>
    </Card>
  )
}

function PresentationScreen({ slides, onEnd }: { slides: Slide[], onEnd: (duration: number) => void }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [startTime] = useState(Date.now())
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`https://api.unsplash.com/photos/random?orientation=landscape`, {
          params: { query: slides[currentSlideIndex].title },
          headers: {
            Authorization: `Client-ID GcSje_mNiuoVfOVKjG4EsiSLNtgqsqtvtKLIPbZmzb8`
          }
        })
        setImageUrl(response.data.urls.regular)
      } catch (error) {
        console.error("Error fetching image from Unsplash:", error)
      }
    }

    fetchImage()
  }, [currentSlideIndex, slides])

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    } else {
      onEnd(Date.now() - startTime)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === "Space") {
      nextSlide()
    }
  }

  const currentSlide = slides[currentSlideIndex]

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 p-8"
      onClick={nextSlide}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Next slide"
    >
      <h1 className="text-4xl font-bold mb-4">{currentSlide.content}</h1>
      <p className="text-xl">{currentSlide.title}/{slides.length}</p>
      {imageUrl && <img src={imageUrl} alt={currentSlide.title} className="mt-4 max-w-full max-h-100 object-fill" />}
      <p className="mt-8 text-gray-600">Click or press space to continue</p>
    </div>
  )
}

function AnalysisScreen({ duration, totalSlides, onRestart }: { duration: number, totalSlides: number, onRestart: () => void }) {
  const averageTimePerSlide = duration / totalSlides / 1000 // in seconds

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-800">Performance Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-gray-700">
        <p>Total time: {(duration / 1000).toFixed(2)} seconds</p>
        <p>Total slides: {totalSlides}</p>
        <p>Average time per slide: {averageTimePerSlide.toFixed(2)} seconds</p>
        <p className="text-gray-600 italic">
          {averageTimePerSlide < 10
            ? "Wow, that was fast! Did you even look at the slides?"
            : averageTimePerSlide < 30
            ? "Great pace! You kept the audience engaged."
            : "You took your time. Hope the audience didn't fall asleep!"}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onRestart} className="w-full">
          Start Over
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function PowerPointKaraokeGenerator() {
  const [slideDeck, setSlideDeck] = useState<Slide[]>([])
  const [presentationMode, setPresentationMode] = useState<"generate" | "present" | "analyze">("generate")
  const [presentationDuration, setPresentationDuration] = useState(0)

  const handleGenerate = (topic: string, numSlides: number) => {
    const newSlideDeck = generateSlideDeck(topic, numSlides)
    setSlideDeck(newSlideDeck)
    setPresentationMode("present")
  }

  const handlePresentationEnd = (duration: number) => {
    setPresentationDuration(duration)
    setPresentationMode("analyze")
  }

  const handleRestart = () => {
    setSlideDeck([])
    setPresentationMode("generate")
  }

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4">
      {presentationMode === "generate" && (
        <GeneratorScreen onGenerate={handleGenerate} />
      )}
      {presentationMode === "present" && (
        <PresentationScreen slides={slideDeck} onEnd={handlePresentationEnd} />
      )}
      {presentationMode === "analyze" && (
        <AnalysisScreen
          duration={presentationDuration}
          totalSlides={slideDeck.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}
