const options = {
  year: "2-digit",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  weekday: "long",
  hour12: false,
  timeZone: "America/Santiago",
};

export function FormatDate(date = new Date()) {
  return new Intl.DateTimeFormat("fr-FR", options).format(date);
}

export function FormatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
