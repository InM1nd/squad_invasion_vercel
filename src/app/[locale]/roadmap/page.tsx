import { getTranslations, getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { PhaseCard } from "@/components/roadmap/phase-card";

export const dynamic = 'force-dynamic';

const phases = [
  {
    id: "phase0",
    iconName: "Settings",
    color: "bg-slate-500",
  },
  {
    id: "phase1",
    iconName: "Rocket",
    color: "bg-blue-500",
  },
  {
    id: "phase2",
    iconName: "Users",
    color: "bg-purple-500",
  },
  {
    id: "phase3",
    iconName: "Target",
    color: "bg-green-500",
  },
  {
    id: "phase4",
    iconName: "Trophy",
    color: "bg-amber-500",
  },
  {
    id: "phase5",
    iconName: "MessageSquare",
    color: "bg-cyan-500",
  },
  {
    id: "phase6",
    iconName: "Zap",
    color: "bg-rose-500",
  },
] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RoadmapPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as (typeof routing.locales)[number];
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: "roadmapPage" });
  const messages = await getMessages({ locale });

  const roadmapMessages = messages.roadmapPage as {
    phases: {
      items: {
        [key: string]: {
          title: string;
          duration: string;
          description: string;
          features: string[];
        };
      };
    };
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.4em] text-primary animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            {t("hero.badge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {t("hero.title")}
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {/* Phases Section */}
      <section className="space-y-10">
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("phases.title")}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl">
            {t("phases.description")}
          </p>
        </div>

        <div className="space-y-8">
          {phases.map((phase, index) => {
            const phaseKey = phase.id;
            const phaseData = roadmapMessages.phases.items[phaseKey];
            const isCompleted = index < 0; // Можно настроить логику завершения

            if (!phaseData) return null;

            return (
              <PhaseCard
                key={phaseKey}
                phaseKey={phaseKey}
                title={phaseData.title}
                duration={phaseData.duration}
                description={phaseData.description}
                features={phaseData.features}
                iconName={phase.iconName}
                color={phase.color}
                index={index}
                isCompleted={isCompleted}
                completedLabel={t("phases.completed")}
                featuresLabel={t("phases.features")}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
