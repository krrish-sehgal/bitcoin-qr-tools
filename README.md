# Bitcoin QR Tools

A secure, client-side Bitcoin QR code generator for seed phrases, wallet descriptors, and transactions.

## Features

### 🔑 Seed Phrase QR Generator
- Support for 12 and 24-word seed phrases
- Paste entire seed phrase or enter words individually
- High error correction QR codes
- Download QR code as PNG

### 💼 Wallet Descriptor QR Generator
- Support for various descriptor formats:
  - Legacy P2PKH (`pkh(...)`)
  - Native SegWit P2WPKH (`wpkh(...)`)
  - Nested SegWit P2SH-P2WPKH (`sh(wpkh(...))`)
  - Native SegWit P2WSH (`wsh(...)`)
  - Taproot P2TR (`tr(...)`)
  - Multisig (`multi(...)`, `sortedmulti(...)`)
  - And more!
- Automatic descriptor type detection
- Load example descriptors
- Export as QR code

### 💸 Transaction QR Generator
Three modes for different transaction types:

1. **Payment URI (BIP21)**
   - Enter Bitcoin address
   - Optional amount, label, and message
   - Creates standard `bitcoin:` URI
   - Compatible with all major wallets

2. **PSBT (Partially Signed Bitcoin Transaction)**
   - Paste base64-encoded PSBT
   - Useful for hardware wallets and multisig
   - Follows BIP174 standard

3. **Raw Transaction**
   - Paste hex-encoded signed transaction
   - Ready to broadcast to network
   - Share transaction data via QR

## Security Features

✅ **100% Client-Side Processing** - All operations happen in your browser  
✅ **No Data Transmission** - Your sensitive data never leaves your device  
✅ **No Server Communication** - Completely offline capable  
✅ **Open Source** - Fully auditable code  

## Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS + shadcn/ui components
- **QR Generation**: qrcode library
- **Theme**: Light/Dark mode support
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ or 20 LTS
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Development

The app will be available at `http://localhost:3000` (or next available port).

```bash
# Run linting
pnpm lint
```

## Project Structure

```
bitcoin-qr-tool/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── bitcoin-qr-generator.tsx    # Main component with tabs
│   ├── seed-phrase-qr.tsx          # Seed phrase QR generator
│   ├── wallet-descriptor-qr.tsx    # Wallet descriptor QR generator
│   ├── transaction-qr.tsx          # Transaction QR generator
│   ├── bitcoin-icon.tsx            # Bitcoin logo icon
│   ├── theme-toggle.tsx            # Dark/light mode toggle
│   └── ui/                         # shadcn/ui components
└── lib/
    └── utils.ts                    # Utility functions
```

## Usage Examples

### Seed Phrase
1. Select 12 or 24 words
2. Enter your seed phrase (paste all at once or one word at a time)
3. Click "Generate QR Code"
4. Download and store securely

### Wallet Descriptor
1. Enter your output descriptor (e.g., `wpkh([fingerprint/84h/0h/0h]xpub.../*)`)
2. Click "Load Example" to see a sample format
3. Generate QR code
4. Use for wallet recovery or sharing xpubs

### Transaction
**Payment URI Mode:**
1. Enter recipient address
2. Optionally add amount, label, and message
3. Generate QR for payment request

**PSBT Mode:**
1. Paste base64 PSBT from your wallet
2. Generate QR for hardware wallet signing

**Raw TX Mode:**
1. Paste hex-encoded signed transaction
2. Generate QR to share transaction data

## Deployment

### Vercel (Recommended)

```bash
# Deploy to production
vercel --prod
```

The project is optimized for Vercel deployment with:
- Automatic Next.js detection
- Edge functions support
- Zero configuration needed

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Cloudflare Pages
- AWS Amplify
- Self-hosted

## Security Best Practices

⚠️ **Important Security Notes:**

1. **Never share seed phrase QR codes** - They provide full access to your wallet
2. **Store QR codes securely** - Treat them like private keys
3. **Verify transactions** - Always verify transaction details before signing
4. **Use offline** - For maximum security, use on an air-gapped device
5. **Review descriptors** - Wallet descriptors contain xpubs that reveal addresses

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- QR generation by [node-qrcode](https://github.com/soldair/node-qrcode)
- Icons from [Lucide](https://lucide.dev/)

---

**⚠️ Disclaimer**: This tool is provided as-is. Always verify the correctness of generated QR codes and use at your own risk. The developers are not responsible for any loss of funds.
