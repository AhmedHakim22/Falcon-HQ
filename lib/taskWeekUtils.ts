// Egyptian / Arab Business Week Utilities (Saturday -> Friday)

export function formatLocalDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekSaturday(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday, 6 is Saturday
  const diffToSaturday = (day + 1) % 7;
  const sat = new Date(d);
  sat.setDate(d.getDate() - diffToSaturday);
  sat.setHours(0, 0, 0, 0);
  return sat;
}

export function getWeekKey(date: Date = new Date()): string {
  return formatLocalDate(getWeekSaturday(date));
}

export interface WeekInfo {
  key: string;
  label: string;
  rangeStr: string;
  startDate: Date;
  endDate: Date;
  offset: number;
}

export function getWeekInfo(offset: number = 0): WeekInfo {
  const baseSat = getWeekSaturday(new Date());
  const sat = new Date(baseSat);
  sat.setDate(baseSat.getDate() + (offset * 7));

  const fri = new Date(sat);
  fri.setDate(sat.getDate() + 6);
  fri.setHours(23, 59, 59, 999);

  const key = formatLocalDate(sat);
  let label = '';
  if (offset === 0) label = 'الأسبوع الحالي';
  else if (offset === 1) label = 'الأسبوع القادم';
  else if (offset === -1) label = 'الأسبوع الماضي';
  else if (offset > 1) label = `بعد ${offset} أسابيع`;
  else label = `قبل ${Math.abs(offset)} أسابيع`;

  const rangeStr = `${sat.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })} - ${fri.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return { key, label, rangeStr, startDate: sat, endDate: fri, offset };
}

export const ARABIC_DAYS = [
  'السبت',
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
] as const;

export type ArabicDay = typeof ARABIC_DAYS[number];
