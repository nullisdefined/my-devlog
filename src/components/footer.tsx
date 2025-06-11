import Link from "next/link";
import { Mail } from "lucide-react";
import { SiGithub, SiLinkedin, SiNotion } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col items-center py-8 space-y-6">
          {/* Social Links */}
          <div className="flex justify-center items-center gap-6">
            <Link
              href="mailto:jaeuu.dev@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/nullisdefined"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent"
              aria-label="GitHub"
            >
              <SiGithub className="h-5 w-5" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent"
              aria-label="LinkedIn"
            >
              <SiLinkedin className="h-5 w-5" />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Jaewoo Kim. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
