"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import QRCode from "qrcode"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

export function WalletDescriptorQR() {
  const [descriptor, setDescriptor] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [error, setError] = useState("")

  const isValidDescriptor = (desc: string): boolean => {
    if (!desc || desc.trim().length === 0) return false

    // Check for common descriptor patterns
    const descriptorPatterns = [
      /^pkh\(/i, // Legacy P2PKH
      /^wpkh\(/i, // Native SegWit P2WPKH
      /^sh\(wpkh\(/i, // Nested SegWit P2SH-P2WPKH
      /^wsh\(/i, // Native SegWit P2WSH
      /^sh\(wsh\(/i, // Nested SegWit P2SH-P2WSH
      /^tr\(/i, // Taproot
      /^combo\(/i, // Combo descriptor
      /^multi\(/i, // Multisig
      /^sortedmulti\(/i, // Sorted multisig
      /^addr\(/i, // Address descriptor
      /^raw\(/i, // Raw descriptor
    ]

    return descriptorPatterns.some((pattern) => pattern.test(desc.trim()))
  }

  const getDescriptorType = (desc: string): string => {
    const trimmed = desc.trim()
    if (trimmed.startsWith("pkh(")) return "Legacy (P2PKH)"
    if (trimmed.startsWith("wpkh(")) return "Native SegWit (P2WPKH)"
    if (trimmed.startsWith("sh(wpkh(")) return "Nested SegWit (P2SH-P2WPKH)"
    if (trimmed.startsWith("wsh(")) return "Native SegWit (P2WSH)"
    if (trimmed.startsWith("sh(wsh(")) return "Nested SegWit (P2SH-P2WSH)"
    if (trimmed.startsWith("tr(")) return "Taproot (P2TR)"
    if (trimmed.startsWith("combo(")) return "Combo"
    if (trimmed.startsWith("multi(") || trimmed.startsWith("sortedmulti(")) return "Multisig"
    if (trimmed.startsWith("addr(")) return "Address"
    if (trimmed.startsWith("raw(")) return "Raw"
    return "Unknown"
  }

  const handleDescriptorChange = (value: string) => {
    setDescriptor(value)
    setError("")
    setQrCodeUrl("")
  }

  const generateQR = async () => {
    setError("")

    if (!descriptor.trim()) {
      setError("Please enter a wallet descriptor")
      return
    }

    if (!isValidDescriptor(descriptor)) {
      setError("Invalid descriptor format. Expected format: pkh(...), wpkh(...), sh(wpkh(...)), tr(...), etc.")
      return
    }

    try {
      const url = await QRCode.toDataURL(descriptor.trim(), {
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
      setError("Failed to generate QR code. The descriptor might be too long.")
      console.error(err)
    }
  }

  const clearAll = () => {
    setDescriptor("")
    setQrCodeUrl("")
    setError("")
  }

  const downloadQR = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.download = "wallet-descriptor-qr.png"
    link.href = qrCodeUrl
    link.click()
  }

  const loadExample = () => {
    const exampleDescriptor = "wpkh([d34db33f/84h/0h/0h]xpub6ERApfZwUNrhLCkDtcHTcxd75RbzS1ed54G1LkBUHQVHQKqhMkhgbmJbZRkrgZw4koxb5JaHWkY4ALHY2grBGRjaDMzQLcgJvLJuZZvRcEL/0/*)"
    setDescriptor(exampleDescriptor)
    setError("")
    setQrCodeUrl("")
  }

  const descriptorType = descriptor.trim() ? getDescriptorType(descriptor) : null

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base">Wallet Output Descriptor</Label>
          <Button
            onClick={loadExample}
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Load Example
          </Button>
        </div>
        <Textarea
          value={descriptor}
          onChange={(e) => handleDescriptorChange(e.target.value)}
          placeholder="wpkh([fingerprint/derivation]xpub.../*) or other descriptor format"
          className="font-mono text-sm bg-secondary/30 min-h-[120px] resize-y"
          rows={5}
        />
        {descriptorType && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Detected:</span>
            <span className="text-xs font-medium text-accent">{descriptorType}</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Enter an output descriptor for your wallet. Supports pkh, wpkh, sh, wsh, tr, and other standard formats.
        </p>
      </div>

      <Alert className="bg-secondary/30 border-border">
        <AlertDescription className="text-sm">
          <strong>What are Output Descriptors?</strong>
          <br />
          Output descriptors are a compact way to describe Bitcoin wallet addresses and keys. They enable wallet
          recovery and address generation across different software.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button
          onClick={generateQR}
          disabled={!descriptor.trim()}
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
              <img src={qrCodeUrl || "/placeholder.svg"} alt="Wallet Descriptor QR Code" className="w-full max-w-sm" />
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
              <strong className="text-accent">Privacy Notice:</strong> This descriptor contains extended public keys
              (xpubs) which can reveal all your addresses. Share carefully.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
