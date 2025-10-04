"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import QRCode from "qrcode"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"

export function SeedPhraseQR() {
  const [wordCount, setWordCount] = useState<12 | 24>(12)
  const [words, setWords] = useState<string[]>(Array(12).fill(""))
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [error, setError] = useState("")

  const handleWordCountChange = (count: 12 | 24) => {
    setWordCount(count)
    setWords(Array(count).fill(""))
    setQrCodeUrl("")
    setError("")
  }

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words]
    newWords[index] = value.trim().toLowerCase()
    setWords(newWords)
  }

  const handlePaste = (e: React.ClipboardEvent, index: number) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    const pastedWords = pastedText.trim().split(/\s+/).filter(Boolean)

    if (pastedWords.length === wordCount) {
      setWords(pastedWords.map((w) => w.toLowerCase()))
    } else if (pastedWords.length === 1) {
      // If only one word is pasted, just update that field
      handleWordChange(index, pastedWords[0])
    } else {
      setError(`Please paste exactly ${wordCount} words`)
    }
  }

  const generateQR = async () => {
    setError("")
    const filledWords = words.filter((w) => w.length > 0)

    if (filledWords.length !== wordCount) {
      setError(`Please enter all ${wordCount} words`)
      return
    }

    try {
      const seedPhrase = words.join(" ")
      const url = await QRCode.toDataURL(seedPhrase, {
        width: 400,
        margin: 2,
        color: {
          dark: "#1e1e1e",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      })
      setQrCodeUrl(url)
    } catch (err) {
      setError("Failed to generate QR code")
      console.error(err)
    }
  }

  const clearAll = () => {
    setWords(Array(wordCount).fill(""))
    setQrCodeUrl("")
    setError("")
  }

  const downloadQR = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.download = "seed-phrase-qr.png"
    link.href = qrCodeUrl
    link.click()
  }

  const filledCount = words.filter((w) => w.length > 0).length

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base">Select Seed Phrase Length</Label>
        <div className="flex gap-3">
          <Button
            onClick={() => handleWordCountChange(12)}
            variant={wordCount === 12 ? "default" : "outline"}
            className={
              wordCount === 12
                ? "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                : "flex-1 border-border hover:bg-secondary bg-transparent"
            }
          >
            12 Words
          </Button>
          <Button
            onClick={() => handleWordCountChange(24)}
            variant={wordCount === 24 ? "default" : "outline"}
            className={
              wordCount === 24
                ? "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                : "flex-1 border-border hover:bg-secondary bg-transparent"
            }
          >
            24 Words
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-base">Enter Seed Phrase</Label>
          <span className={`text-sm font-mono ${filledCount === wordCount ? "text-accent" : "text-muted-foreground"}`}>
            {filledCount} / {wordCount} words
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {words.map((word, index) => (
            <div key={index} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                {index + 1}.
              </span>
              <Input
                value={word}
                onChange={(e) => handleWordChange(index, e.target.value)}
                onPaste={(e) => handlePaste(e, index)}
                placeholder={`word ${index + 1}`}
                className="pl-10 font-mono text-sm bg-secondary/30"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Paste your entire {wordCount}-word seed phrase into any box, or enter words individually.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button
          onClick={generateQR}
          disabled={filledCount !== wordCount}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Generate QR Code
        </Button>
        <Button onClick={clearAll} variant="outline" className="border-border hover:bg-secondary bg-transparent">
          Clear
        </Button>
      </div>

      {qrCodeUrl && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-6 rounded-lg">
              <img src={qrCodeUrl || "/placeholder.svg"} alt="Seed Phrase QR Code" className="w-full max-w-sm" />
            </div>
            <Button
              onClick={downloadQR}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download QR Code
            </Button>
          </div>
          <Alert className="bg-accent/10 border-accent/30">
            <AlertDescription className="text-sm">
              <strong className="text-accent">Security Warning:</strong> Store this QR code securely. Anyone with access
              to it can access your wallet.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
