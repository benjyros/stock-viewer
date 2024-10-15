"use client";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Earth } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { routing } from "@/src/i18n/routing";

export default function LanguageSwitcher() {
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LanguageSwitcher')

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLanguage = useCallback((newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPathname)
  }, [locale, pathname, router])

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"sm"}>
          <Earth
            key="system"
            size={ICON_SIZE}
            className={"text-muted-foreground"}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={switchLanguage}
        >
          
          {routing.locales.map((loc: any) => (
          <DropdownMenuRadioItem className="flex gap-2" key={loc} value={loc}>
              {t(`language.${loc}`)}
          </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
