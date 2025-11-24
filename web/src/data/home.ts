import type {
  ContactInfo,
  EventItem,
  SocialLink,
  TeamMember,
} from "@/lib/types";
import { ShieldCheck, Zap, Waves } from "lucide-react";

export const teamMembers: (TeamMember & { name: string; role: string; bio: string })[] = [
  {
    id: "1",
    translationKey: "members.sin",
    name: "Sex Instructor NATO",
    role: "Командир рейда",
    bio: "Отвечает за темп и итоговые решения. Переключает состав между full send и методичной зачисткой за одно предложение.",
    initials: "SIN",
  },
  {
    id: "2",
    translationKey: "members.thirteen",
    name: "13th",
    role: "Shot-caller",
    bio: "Живёт в голосовом канале и фиксит любую рассыпавшуюся коммуникацию. Параллельно подбрасывает инфу и сарказм.",
    initials: "13",
  },
  {
    id: "3",
    translationKey: "members.satana",
    name: "Satana v Triko",
    role: "Саботаж и фланги",
    bio: "Заходит там, где стены на карте. Ломает экономику, пока остальные думают, где он вообще появился.",
    initials: "SvT",
  },
  {
    id: "4",
    translationKey: "members.metr",
    name: "Metr Pihalych",
    role: "Деф-блок",
    bio: "Ставит непроходимые щиты, отслеживает тайминги спама и держит тиммейтов в живых чистой волей.",
    initials: "MP",
  },
];

export const contactInfo: ContactInfo = {
  email: "dixon.ltd50@gmail.com",
  discord: "https://discord.gg/9w4N777V",
  regionKey: "regionValue",
};

export const socialLinks: SocialLink[] = [
  { id: "1", labelKey: "items.twitch", url: "https://twitch.tv", icon: "twitch" },
  { id: "2", labelKey: "items.youtube", url: "https://youtube.com", icon: "youtube" },
  { id: "3", labelKey: "items.x", url: "https://x.com", icon: "x" },
  { id: "4", labelKey: "items.discord", url: "https://discord.gg", icon: "discord" },
  {
    id: "5",
    labelKey: "items.steam",
    url: "https://steamcommunity.com/groups",
    icon: "steam",
  },
];

export const highlightCards = [
  {
    id: "discipline",
    label: "Связь",
    title: "Дисциплина без скуки",
    description:
      "Чёткие каллауты держатся на привычке, а не на страхе. Мы реагируем за 0.8 секунды и при этом успеваем шутить.",
    metric: "0.8 сек // средний отклик",
    icon: Waves,
    accent: "cyan" as const,
  },
  {
    id: "adapt",
    label: "Игра",
    title: "Адаптивные компы",
    description:
      "Меняем ролики на лету. Если нужен двойной саппорт или три инженера — это не обсуждение на 10 минут.",
    metric: "3.2 // замены за матч",
    icon: Zap,
    accent: "amber" as const,
  },
  {
    id: "shield",
    label: "Защита",
    title: "Силовое удержание",
    description:
      "В сетапе — стенки, на точке — хладнокровные люди. Наша оборона держится на мат-анализе и вере в друг друга.",
    metric: "87% удержание точек",
    icon: ShieldCheck,
    accent: "violet" as const,
  },
];

export const intelFeed = [
  {
    id: "ops",
    title: "Серия побед",
    detail:
      "Последние официальные Invasion лобби закрыты без поражений. Противники ливают на стадии третьей волны.",
    value: "12-0",
    delta: "+4 к прошлой неделе",
    status: "up" as const,
    timestamp: "24 NOV // 23:40",
  },
  {
    id: "scrim",
    title: "Тренировки",
    detail:
      "Каждая среда — кастомка против дружественных кланов. Формируем новые связки и отрабатываем анти-мету.",
    value: "4 сета",
    delta: "стабильный график",
    status: "steady" as const,
    timestamp: "24 NOV // 20:10",
  },
  {
    id: "recruits",
    title: "Новые бойцы",
    detail:
      "Запускаем воркшоп для свежих игроков. Берём тех, кто быстро встаёт на связь и не боится слушать.",
    value: "+6 кандидатов",
    delta: "дофильтровано 2",
    status: "up" as const,
    timestamp: "23 NOV // 18:55",
  },
  {
    id: "support",
    title: "Медиа и сообщество",
    detail:
      "Твич живой, хайлайты улетают в тикток. Мы хотим, чтобы атмосфера чувствовалась до того, как человек зайдёт в игру.",
    value: "3 канала",
    delta: "-1 офф неделя",
    status: "down" as const,
    timestamp: "22 NOV // 14:20",
  },
];

export type { EventItem };

