function toDatetimeLocalString(dateString: string | Date) {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
}

export default toDatetimeLocalString