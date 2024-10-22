// src/components/footer.tsx
import Link from "next/link";
import { Mail } from "lucide-react";
import { SiGithub } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-12 pt-16 pb-7">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <div className="space-y-4">
              <p className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                <Link
                  href="mailto:jaeuu.dev@gmail.com"
                  className="text-primary hover:underline"
                >
                  jaeuu.dev@gmail.com
                </Link>
              </p>
              <p className="flex items-center">
                <SiGithub className="mr-2 h-4 w-4" />
                <Link
                  href="https://github.com/nullisdefined"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/nullisdefined
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pb-5 pt-4">
          <div className="flex justify-center items-center text-muted-foreground text-sm">
            <p>© 2024 Jaewoo Kim. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
