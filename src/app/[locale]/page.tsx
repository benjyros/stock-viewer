import Hero from "@/src/components/hero";
import ConnectSupabaseSteps from "@/src/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/src/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { useTranslations } from "next-intl";

export default function Index() {
  const t = useTranslations('Index');

  return (
    <div>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main>
    </div>
  );
}
