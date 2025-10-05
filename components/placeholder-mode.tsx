import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Github, Mail } from "lucide-react"

interface PlaceholderModeProps {
  title: string
  description: string
}

export function PlaceholderMode({ title, description }: PlaceholderModeProps) {
  return (
    <div className="space-y-6 py-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-2">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground max-w-md mx-auto text-pretty">{description}</p>
      </div>

      <Alert className="bg-secondary/30 border-border">
        <AlertDescription className="text-center">
          This feature is currently a placeholder. It can be implemented by other developers or AI assistants.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 pt-4">
        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
          <h4 className="font-semibold mb-2 text-foreground">Implementation Ready</h4>
          <p className="text-sm text-muted-foreground">
            The UI structure is in place and ready for functionality to be added.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
          <h4 className="font-semibold mb-2 text-foreground">Consistent Design</h4>
          <p className="text-sm text-muted-foreground">
            Follows the same Bitcoin-themed design system as the rest of the app.
          </p>
        </div>
      </div>

      {/* Contribution Section */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="text-center space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Want to Contribute?</h4>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            This is an open-source project. Contributions, feature requests, and feedback are always welcome!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open('https://github.com/krrish-sehgal/bitcoin-qr-tools', '_blank')}
            >
              <Github className="w-4 h-4" />
              Contribute on GitHub
            </Button>
            
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.location.href = 'mailto:krrishsehgal03@gmail.com?subject=Bitcoin QR Tools - Feature Request'}
            >
              <Mail className="w-4 h-4" />
              Request Features
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
