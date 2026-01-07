import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock } from 'lucide-react';

export default function Login() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, hsl(180 100% 50% / 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, hsl(270 100% 65% / 0.1) 0%, transparent 50%),
          hsl(230 25% 7%)
        `,
      }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(hsl(180 100% 50% / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(180 100% 50% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        <div className="glass-panel p-8 neon-border">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 border border-primary/30 mb-4"
              style={{ boxShadow: '0 0 30px hsl(180 100% 50% / 0.3)' }}
            >
              <Lock className="w-8 h-8 text-primary drop-shadow-[0_0_10px_hsl(180_100%_50%/0.8)]" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground tracking-wider glow-text">
              NEXUS<span className="text-secondary">ADMIN</span>
            </h1>
            <p className="mt-2 text-muted-foreground tracking-wide">
              Authentication required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-display tracking-widest text-muted-foreground uppercase">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                className="bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-display tracking-widest text-muted-foreground uppercase">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                className="bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full font-display tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground cyber-button"
              disabled={isLoading}
              style={{ boxShadow: '0 0 20px hsl(180 100% 50% / 0.3)' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                'INITIALIZE SESSION'
              )}
            </Button>

            <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs text-muted-foreground text-center tracking-wide">
                <span className="font-display text-primary">DEMO ACCESS:</span><br />
                <span className="font-mono text-foreground/80">admin@example.com / admin123</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
