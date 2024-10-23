import Link from "next/link";
import { Mail } from "lucide-react";
import { SiGithub, SiLinkedin, SiNotion } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col items-start py-8 space-y-6">
          <div className="flex flex-col items-start space-y-2">
            <h3 className="text-lg font-semibold text-primary">
              {/* Contact */}
            </h3>
          </div>

          <div className="flex justify-start items-center gap-8">
            <Link
              href="mailto:jaeuu.dev@gmail.com"
              className="text-primary hover:text-primary/80 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </Link>
            <Link
              href="https://github.com/nullisdefined"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
              aria-label="GitHub"
            >
              <SiGithub className="h-6 w-6" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
              aria-label="LinkedIn"
            >
              <SiLinkedin className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pb-5 pt-4">
          <div className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Jaewoo Kim. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
