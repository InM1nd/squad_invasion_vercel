import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Team from "@/components/Team";
import Events from "@/components/Events";
import Contact from "@/components/Contact";
import Links from "@/components/Links";
import Highlights, { type HighlightCard } from "@/components/Highlights";
import IntelFeed, { type IntelItem } from "@/components/IntelFeed";
import type { TeamMember, EventItem, ContactInfo, SocialLink } from "@/lib/types";
import { ShieldCheck, Zap, Waves } from "lucide-react";

const teamMembers: (TeamMember & { name: string; role: string; bio: string })[] = [
  {
    id: '1',
    translationKey: "sin",
    name: "Sex Instructor NATO",
    role: "Командир рейда",
    bio: "Отвечает за темп и итоговые решения. Переключает состав между full send и методичной зачисткой за одно предложение.",
    initials: "SIN",
  },
  {
    id: '2',
    translationKey: "thirteen",
    name: "13th",
    role: "Shot-caller",
    bio: "Живёт в голосовом канале и фиксит любую рассыпавшуюся коммуникацию. Параллельно подбрасывает инфу и сарказм.",
    initials: "13",
  },
  {
    id: '3',
    translationKey: "satana",
    name: "Satana v Triko",
    role: "Саботаж и фланги",
    bio: "Заходит там, где стены на карте. Ломает экономику, пока остальные думают, где он вообще появился.",
    initials: "SvT",
  },
  {
    id: '4',
    translationKey: "metr",
    name: "Metr Pihalych",
    role: "Деф-блок",
    bio: "Ставит непроходимые щиты, отслеживает тайминги спама и держит тиммейтов в живых чистой волей.",
    initials: "MP",
  },
];

const contactInfo: ContactInfo = { email: "dixon.ltd50@gmail.com", discord: "https://discord.gg/9w4N777V", regionKey: "regionValue" };
const socialLinks: SocialLink[] = [
  { id: "1", labelKey: "twitch", url: "https://twitch.tv", icon: "twitch" },
  { id: "2", labelKey: "youtube", url: "https://youtube.com", icon: "youtube" },
  { id: "3", labelKey: "x", url: "https://x.com", icon: "x" },
  { id: "4", labelKey: "discord", url: "https://discord.gg", icon: "discord" },
  { id: "5", labelKey: "steam", url: "https://steamcommunity.com/groups", icon: "steam" },
];

const highlightCards: HighlightCard[] = [
  {
    id: "discipline",
    label: "Связь",
    title: "Дисциплина без скуки",
    description: "Чёткие каллауты держатся на привычке, а не на страхе. Мы реагируем за 0.8 секунды и при этом успеваем шутить.",
    metric: "0.8 сек // средний отклик",
    icon: Waves,
    accent: "cyan",
  },
  {
    id: "adapt",
    label: "Игра",
    title: "Адаптивные компы",
    description: "Меняем ролики на лету. Если нужен двойной саппорт или три инженера — это не обсуждение на 10 минут.",
    metric: "3.2 // замены за матч",
    icon: Zap,
    accent: "amber",
  },
  {
    id: "shield",
    label: "Защита",
    title: "Силовое удержание",
    description: "В сетапе — стенки, на точке — хладнокровные люди. Наша оборона держится на мат-анализе и вере в друг друга.",
    metric: "87% удержание точек",
    icon: ShieldCheck,
    accent: "violet",
  },
];

const intelFeed: IntelItem[] = [
  {
    id: "ops",
    title: "Серия побед",
    detail: "Последние официальные Invasion лобби закрыты без поражений. Противники ливают на стадии третьей волны.",
    value: "12-0",
    delta: "+4 к прошлой неделе",
    status: "up",
    timestamp: "24 NOV // 23:40",
  },
  {
    id: "scrim",
    title: "Тренировки",
    detail: "Каждая среда — кастомка против дружественных кланов. Формируем новые связки и отрабатываем анти-мету.",
    value: "4 сета",
    delta: "стабильный график",
    status: "steady",
    timestamp: "24 NOV // 20:10",
  },
  {
    id: "recruits",
    title: "Новые бойцы",
    detail: "Запускаем воркшоп для свежих игроков. Берём тех, кто быстро встаёт на связь и не боится слушать.",
    value: "+6 кандидатов",
    delta: "дофильтровано 2",
    status: "up",
    timestamp: "23 NOV // 18:55",
  },
  {
    id: "support",
    title: "Медиа и сообщество",
    detail: "Твич живой, хайлайты улетают в тикток. Мы хотим, чтобы атмосфера чувствовалась до того, как человек зайдёт в игру.",
    value: "3 канала",
    delta: "-1 офф неделя",
    status: "down",
    timestamp: "22 NOV // 14:20",
  },
];

export default function Home() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_KEY = 'AIzaSyAF0AxGPf7BI9F7sz9sxpltqSkZRi4y1RE';
    const calendarId = "8f501d7b182f551c0a655c10f9fe0c5ff177e75a2435ffda4ea07d60545b6fa3@group.calendar.google.com";

    async function fetchEvents() {
      try {
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${API_KEY}&singleEvents=true&orderBy=startTime`
        );
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        const parsedEvents: EventItem[] = items.map((item: any) => ({
          id: item.id,
          title: item.summary,
          date: item.start.dateTime || item.start.date,
          time: item.start.dateTime
            ? new Date(item.start.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "",
          location: item.location || "",
        }));
        setEvents(parsedEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.12),_transparent_55%)]">
      <Header />
      <Highlights highlights={highlightCards} />
      <Team members={teamMembers} />

      {loading ? (
        <p className="text-center py-8 text-muted-foreground">Загружаем расписание...</p>
      ) : (
        <Events events={events} />
      )}

      <IntelFeed intel={intelFeed} />
      <Contact contact={contactInfo} />
      <Links links={socialLinks} />

      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 Штаб Наслаждений.</p>
      </footer>
    </div>
  );
}
