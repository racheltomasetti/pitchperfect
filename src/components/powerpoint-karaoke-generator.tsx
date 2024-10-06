"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"

// Mock function to simulate slide deck generation
const generateSlideDeck = (topic: string, numSlides: number) => {
  return Array.from({ length: numSlides }, (_, i) => ({
    id: i,
    title: `Slide ${i + 1}`,
    content: `Random content about ${topic}`
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
  <div>
      <div className="absolute top-0 left-1/4 w-1/2 h-40 bg-yellow-500 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-10 w-40 h-40 bg-red-500 opacity-20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-4xl mx-auto text-center mb-8 relative">
        <div className="absolute inset-0 transform skew-y-3 -z-10"></div>
        <h1 className="text-5xl font-bold text-white mb-2 relative z-10">Pitch Perfect</h1>
        <p className="text-xl text-yellow-300 relative z-10">Take the stage and improvise!</p>
      </div>
    <Card className="w-full max-w-md mx-auto shadow-lg bg-gray-800/80 backdrop-blur-sm shadow-2xl border-gray-700">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-8 h-8 p-0 absolute top-2 right-2 bg-white/10">
            <QuestionMarkCircledIcon className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h3 className="font-medium text-lg">How Pitch PerfectWorks</h3>
            <p>1. Enter a topic and number of slides.</p>
            <p>2. Generate your deck.</p>
            <p>3. Present the slides on the fly.</p>
            <p>4. Click to move to the next slide.</p>
            <p>5. Improvise and have fun!</p>
          </div>
        </PopoverContent>
      </Popover>
      
      <CardHeader>
        <div className="pr-10">
        <CardTitle className="text-2xl font-bold text-white">Prepare Your Performance</CardTitle>
            <CardDescription className="text-gray-300">Set the stage for your impromptu talk</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic" className="text-gray-200">Topic</Label>
          <Input
            id="topic"
            placeholder="Enter a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-gray-50 text-gray-800 border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numSlides" className="text-gray-200">Number of Slides</Label>
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
        <Button onClick={() => onGenerate(topic, numSlides)}  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 text-lg transition-colors duration-200"
>
          Are you ready?
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}

function PresentationScreen({ slides, onEnd }: { slides: Slide[], onEnd: (duration: number) => void }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [startTime] = useState(Date.now())
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`https://api.unsplash.com/photos/random`, {
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
      className="flex flex-col items-center justify-center min-h-screen text-gray-200 p-8"
      onClick={nextSlide}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Next slide"
    >
      <h1 className="text-4xl font-bold mb-4 text-white">{currentSlide.title}</h1>
      <p className="text-xl">{currentSlide.content}</p>
      {imageUrl && <img src={imageUrl} alt={currentSlide.title} className="mt-4 max-w-full max-h-96 object-cover" />}
      <p className="mt-8 text-gray-200">Click to continue</p>
    </div>
  )
}

function AnalysisScreen({ duration, totalSlides, onRestart }: { duration: number, totalSlides: number, onRestart: () => void }) {
  const averageTimePerSlide = duration / totalSlides / 1000 // in seconds

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800/80 backdrop-blur-sm shadow-2xl border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Performance Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-gray-200">
        <p>Total time: {(duration / 1000).toFixed(2)} seconds</p>
        <p>Total slides: {totalSlides}</p>
        <p>Average time per slide: {averageTimePerSlide.toFixed(2)} seconds</p>
        <p className="text-gray-200 italic">
          {averageTimePerSlide < 10
            ? "Wow, that was fast! Did you even look at the slides?"
            : averageTimePerSlide < 30
            ? "Great pace! You kept the audience engaged."
            : "You took your time. Hope the audience didn't fall asleep!"}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onRestart} className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 text-lg transition-colors duration-200">
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
    <div className="h-screen bg-transparent flex items-center justify-center p-4">
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


