"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import QRCode from "qrcode"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

type TransactionFormat = "psbt" | "raw" | "payment-uri"

export function TransactionQR() {
  const [format, setFormat] = useState<TransactionFormat>("payment-uri")
  const [transactionData, setTransactionData] = useState("")
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [label, setLabel] = useState("")
  const [message, setMessage] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [error, setError] = useState("")

  const isValidHex = (str: string): boolean => {
    return /^[0-9a-fA-F]+$/.test(str)
  }

  const isValidBase64 = (str: string): boolean => {
    try {
      return btoa(atob(str)) === str
    } catch {
      return false
    }
  }

  const isValidBitcoinAddress = (addr: string): boolean => {
    // Basic validation for Bitcoin addresses
    const patterns = [
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Legacy P2PKH/P2SH
      /^bc1[a-z0-9]{39,87}$/i, // Bech32 SegWit
      /^tb1[a-z0-9]{39,87}$/i, // Testnet Bech32
    ]
    return patterns.some((pattern) => pattern.test(addr.trim()))
  }

  const validateTransaction = (): boolean => {
    if (format === "payment-uri") {
      if (!address.trim()) {
        setError("Please enter a Bitcoin address")
        return false
      }
      if (!isValidBitcoinAddress(address)) {
        setError("Invalid Bitcoin address format")
        return false
      }
      if (amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
        setError("Invalid amount")
        return false
      }
      return true
    } else {
      if (!transactionData.trim()) {
        setError(`Please enter a ${format === "psbt" ? "PSBT" : "raw transaction"}`)
        return false
      }

      if (format === "psbt") {
        // PSBT should be base64 encoded
        if (!isValidBase64(transactionData.trim())) {
          setError("Invalid PSBT format. Expected base64 encoded data.")
          return false
        }
      } else if (format === "raw") {
        // Raw transaction should be hex
        if (!isValidHex(transactionData.trim())) {
          setError("Invalid raw transaction format. Expected hexadecimal data.")
          return false
        }
      }
      return true
    }
  }

  const generatePaymentURI = (): string => {
    let uri = `bitcoin:${address.trim()}`
    const params: string[] = []

    if (amount) {
      params.push(`amount=${amount}`)
    }
    if (label) {
      params.push(`label=${encodeURIComponent(label)}`)
    }
    if (message) {
      params.push(`message=${encodeURIComponent(message)}`)
    }

    if (params.length > 0) {
      uri += `?${params.join("&")}`
    }

    return uri
  }

  const generateQR = async () => {
    setError("")

    if (!validateTransaction()) {
      return
    }

    try {
      let dataToEncode: string

      if (format === "payment-uri") {
        dataToEncode = generatePaymentURI()
      } else {
        dataToEncode = transactionData.trim()
      }

      const url = await QRCode.toDataURL(dataToEncode, {
        width: 400,
        margin: 2,
        color: {
          dark: "#1e1e1e",
          light: "#ffffff",
        },
        errorCorrectionLevel: format === "payment-uri" ? "M" : "L", // Lower EC for larger data
      })
      setQrCodeUrl(url)
    } catch (err) {
      setError("Failed to generate QR code. The data might be too long for a QR code.")
      console.error(err)
    }
  }

  const clearAll = () => {
    setTransactionData("")
    setAddress("")
    setAmount("")
    setLabel("")
    setMessage("")
    setQrCodeUrl("")
    setError("")
  }

  const downloadQR = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.download = `${format}-qr.png`
    link.href = qrCodeUrl
    link.click()
  }

  const loadExample = () => {
    if (format === "payment-uri") {
      setAddress("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh")
      setAmount("0.001")
      setLabel("Coffee Payment")
      setMessage("Thanks for the coffee!")
    } else if (format === "psbt") {
      setTransactionData(
        "cHNidP8BAHECAAAAAeVj0LhXaN8SLlGHGcqZpz8pKXVKVlGUCqFALNqC9m2qAAAAAAD/////AkBCDwAAAAAAFgAUxkgHzf0wgZwLmKG3LggTvqo0gR6w4gEAAAAAABYAFPfEVfn7fG74VR/fS1GYfvpRVRcDAAAAAAEBKwDh9QUAAAAAIgAgi9NlGq47iScWGxrKT5Z+6EXJCxwz8+2XWnWw9LxEWW0AAA=="
      )
    } else {
      setTransactionData(
        "0200000001e563d0b8576adf122e51871cea19a73f2929754a56519402a1402cdaa2f66daa0000000000ffffffff0240420f0000000000160014c64807cdfd30819c0b98a1b72e0813bea3348116b0e201000000000016001477c455f9fb7c6ef8551fdf4b51987efc51551703"
      )
    }
    setQrCodeUrl("")
    setError("")
  }

  const handleFormatChange = (newFormat: TransactionFormat) => {
    setFormat(newFormat)
    clearAll()
  }

  return (
    <div className="space-y-6">
      <Tabs value={format} onValueChange={(v) => handleFormatChange(v as TransactionFormat)} className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-secondary/50">
          <TabsTrigger value="payment-uri">Payment URI</TabsTrigger>
          <TabsTrigger value="psbt">PSBT</TabsTrigger>
          <TabsTrigger value="raw">Raw TX</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-uri" className="space-y-4 mt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Bitcoin Address *</Label>
              <Button
                onClick={loadExample}
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Load Example
              </Button>
            </div>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="bc1q... or 1... or 3..."
              className="font-mono text-sm bg-secondary/30"
            />
          </div>

          <div className="space-y-3">
            <Label>Amount (BTC, optional)</Label>
            <Input
              type="number"
              step="0.00000001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.001"
              className="font-mono text-sm bg-secondary/30"
            />
          </div>

          <div className="space-y-3">
            <Label>Label (optional)</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Payment description"
              className="text-sm bg-secondary/30"
            />
          </div>

          <div className="space-y-3">
            <Label>Message (optional)</Label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Additional message"
              className="text-sm bg-secondary/30"
            />
          </div>

          <Alert className="bg-secondary/30 border-border">
            <AlertDescription className="text-sm">
              <strong>Payment URI Format:</strong> Creates a standard BIP21 bitcoin: URI that can be opened by wallets
              to pre-fill payment details.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="psbt" className="space-y-4 mt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">PSBT (Base64)</Label>
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
              value={transactionData}
              onChange={(e) => setTransactionData(e.target.value)}
              placeholder="cHNidP8BAH..."
              className="font-mono text-sm bg-secondary/30 min-h-[150px] resize-y"
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Paste your Partially Signed Bitcoin Transaction in base64 format.
            </p>
          </div>

          <Alert className="bg-secondary/30 border-border">
            <AlertDescription className="text-sm">
              <strong>PSBT Format:</strong> Partially Signed Bitcoin Transactions (BIP174) allow wallets to
              collaboratively create and sign transactions, useful for multisig and hardware wallets.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="raw" className="space-y-4 mt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Raw Transaction (Hex)</Label>
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
              value={transactionData}
              onChange={(e) => setTransactionData(e.target.value)}
              placeholder="0200000001..."
              className="font-mono text-sm bg-secondary/30 min-h-[150px] resize-y"
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Paste your signed Bitcoin transaction in raw hexadecimal format.
            </p>
          </div>

          <Alert className="bg-secondary/30 border-border">
            <AlertDescription className="text-sm">
              <strong>Raw Transaction:</strong> Fully signed Bitcoin transaction in hexadecimal format, ready to be
              broadcast to the network.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button
          onClick={generateQR}
          disabled={format === "payment-uri" ? !address.trim() : !transactionData.trim()}
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
              <img src={qrCodeUrl || "/placeholder.svg"} alt="Transaction QR Code" className="w-full max-w-sm" />
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
              <strong className="text-accent">Usage:</strong>{" "}
              {format === "payment-uri"
                ? "Scan this QR code with a Bitcoin wallet to create a payment."
                : "This QR code contains transaction data. Use a compatible wallet to sign or broadcast."}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
