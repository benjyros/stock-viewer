'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const switchLanguage = (newLocale: any) => {
    router.push(`/${newLocale}`);
  };

  return (
    <div>
      <button onClick={() => switchLanguage('en')} disabled={locale === 'en'}>English</button>
      <button onClick={() => switchLanguage('de')} disabled={locale === 'de'}>Deutsch</button>
    </div>
  );
}