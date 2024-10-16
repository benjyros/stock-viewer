import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

interface IndexProps {
  params: { locale: string };
}

export default function Index({ params: { locale } }: IndexProps) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("Index");

  return (
    <div>
      <p>Hello</p>
    </div>
  );
}
