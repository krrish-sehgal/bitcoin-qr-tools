"use client"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SeedPhraseQR } from "@/components/seed-phrase-qr"
import { WalletDescriptorQR } from "@/components/wallet-descriptor-qr"
import { TransactionQR } from "@/components/transaction-qr"
import { PlaceholderMode } from "@/components/placeholder-mode"
import { BitcoinIcon } from "@/components/bitcoin-icon"
import { ThemeToggle } from "@/components/theme-toggle"

export function BitcoinQRGenerator() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <header className="text-center mb-12 relative">
        <div className="absolute right-0 top-0">
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <BitcoinIcon className="w-12 h-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-balance">Bitcoin QR Tools</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
          Secure, client-side tools for generating QR codes from seed phrases, wallet descriptors, and transactions
        </p>
      </header>

      {/* Main Tool */}
      <Card className="bg-card border-border">
        <Tabs defaultValue="seed-phrase" className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 bg-secondary/50 p-2">
            <TabsTrigger
              value="seed-phrase"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Seed Phrase
            </TabsTrigger>
            <TabsTrigger
              value="descriptor"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Wallet Descriptor
            </TabsTrigger>
            <TabsTrigger
              value="transaction"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Transaction
            </TabsTrigger>
            <TabsTrigger
              value="other"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Other
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seed-phrase" className="p-6">
            <SeedPhraseQR />
          </TabsContent>

          <TabsContent value="descriptor" className="p-6">
            <WalletDescriptorQR />
          </TabsContent>

          <TabsContent value="transaction" className="p-6">
            <TransactionQR />
          </TabsContent>

          <TabsContent value="other" className="p-6">
            <PlaceholderMode
              title="Additional Tools"
              description="More Bitcoin-related QR code generation tools coming soon."
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Security Notice */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg border border-border">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-sm text-muted-foreground">
            All processing happens locally in your browser. Your data never leaves your device.
          </p>
        </div>
      </div>
    </div>
  )
}
