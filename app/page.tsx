import { BitcoinQRGenerator } from "@/components/bitcoin-qr-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <BitcoinQRGenerator />
    </main>
  )
}
