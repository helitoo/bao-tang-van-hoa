import { getLangDict, Locale } from "@/lib/lang";
import {
  getHomeStatsServer,
  getNewestArtifactsServer,
  getNewestCollectionsServer,
} from "@/lib/serverArtifacts";

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
  // Aggregates and the two "newest" rows are computed on the server over the
  // full dataset; the browser only receives counts and 12 + 6 cards.
  const [dict, stats, newestCollections, newestArtifacts] = await Promise.all([
    getLangDict(locale),
    getHomeStatsServer(),
    getNewestCollectionsServer(6),
    getNewestArtifactsServer(12),
  ]);

  return (
    <div className="space-y-16 pb-24 md:pb-32">
      {/* Animated Hero Section */}
      <HeroSection locale={locale} dict={dict} />

      {/* Animated Introduction & Mission */}
      <IntroductionSection dict={dict} />

      {/* Rigid Dashboard: Adapted for Mobile & Desktop */}
      <Statistics locale={locale as Locale} dict={dict} stats={stats} />

      {/* Badges Preview */}
      <BadgeSection locale={locale as Locale} dict={dict} />

      {/* Newest collections */}
      <NewestCollections
        locale={locale as Locale}
        dict={dict}
        collections={newestCollections}
      />

      {/* Newest artifacts */}
      <NewestArtifacts
        locale={locale as Locale}
        dict={dict}
        artifacts={newestArtifacts}
      />

      {/* Donate (tạm thời ẩn) */}
      {/* <Donate /> */}
    </div>
  );
}
