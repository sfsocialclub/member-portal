export const timeZone: Intl.DateTimeFormatOptions['timeZone'] = 'America/Los_Angeles'
export const locale: Intl.LocalesArgument = 'en-US'

export function formatDateTimeForTable(args: any): string {
  const options: Intl.DateTimeFormatOptions = {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone
  };
  return new Date(args).toLocaleString(locale, options);
}

export function formatDateToLocaleStringLA(args:any ): string {
    return new Date(args).toLocaleString(locale, { timeZone });
}

export function formatDateToMonthAndYear(year: number, month: number): string {
    return new Date(year, month).toLocaleString(locale, { month: "long", year: "numeric" })
}

export function formatDateTimeForForm(dateInput: string | Date): string {
  const date = new Date(dateInput);

  // Convert to Pacific Time explicitly
  const pacificDate = new Date(
    date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  );

  const pad = (n: number) => String(n).padStart(2, '0');

  const year = pacificDate.getFullYear();
  const month = pad(pacificDate.getMonth() + 1);
  const day = pad(pacificDate.getDate());
  const hour = pad(pacificDate.getHours());
  const minute = pad(pacificDate.getMinutes());

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

