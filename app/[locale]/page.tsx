import { getLangDict, Locale } from "@/lib/lang";
import { getCollectionsWithArtifactsServer } from "@/lib/serverArtifacts";

import HeroSection from "@/components/homepage/HeroSection";
import IntroductionSection from "@/components/homepage/IntroductionSection";
import Statistics from "@/components/homepage/Statistics";
import NewestCollections from "@/components/homepage/NewestCollections";
import NewestArtifacts from "@/components/homepage/NewestArtifacts";
import BadgeSection from "@/components/homepage/BadgeSection";
import Donate from "@/components/homepage/Donate";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [dict, collections] = await Promise.all([
    getLangDict(locale),
    getCollectionsWithArtifactsServer(),
  ]);

  return (
    <div className="space-y-16 pb-24 md:pb-32">
      {/* Animated Hero Section */}
      <HeroSection locale={locale} dict={dict} />

      {/* Animated Introduction & Mission */}
      <IntroductionSection dict={dict} />

      {/* Rigid Dashboard: Adapted for Mobile & Desktop */}
      <Statistics locale={locale as Locale} dict={dict} />

      {/* Badges Preview */}
      <BadgeSection locale={locale as Locale} dict={dict} />

      {/* Newest collections */}
      <NewestCollections
        locale={locale as Locale}
        dict={dict}
        initialCollections={collections}
      />

      {/* Newest artifacts */}
      <NewestArtifacts locale={locale as Locale} dict={dict} />

      {/* Donate (tạm thời ẩn) */}
      {/* <Donate /> */}
    </div>
  );
}
