const options = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  weekday: "long",
  hour12: false,
  timeZone: "America/Santiago",
};

export const DATE_TYPE = {
  DDMMYYYY: "ddmmyyyy",
  DATE_TIME_OBJECT: "dtobj",
};

export function arrayToObject(arr) {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    obj[arr[i][0]] = arr[i][1];
  }
  return obj;
}

export const swapKeysAndValues = (obj) => {
  const swapped = {};
  for (const [key, value] of Object.entries(obj)) {
    swapped[value] = key;
  }
  return swapped;
};

export function formatFrenchDateTime(dateString, type) {
  // Create a Date object from the date string
  const date = new Date(dateString);

  if (DATE_TYPE.DATE_TIME_OBJECT === type) {
    // Extract the day, month, and year for the date
    const day = String(date.getDate()).padStart(2, "0"); // Ensures 2 digits for day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1
    const year = date.getFullYear();

    // Format the date as 'dd/mm/yyyy'
    const formattedDate = `${day}/${month}/${year}`;

    // Extract hours and minutes for the time
    const hours = String(date.getHours()).padStart(2, "0"); // Ensures 2 digits for hours
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensures 2 digits for minutes

    // Format the time as 'hh:mm'
    const formattedTime = `${hours}:${minutes}`;

    // Return an object with formatted date and time
    return {
      date: formattedDate,
      time: formattedTime,
    };
  }

  if (DATE_TYPE.DDMMYYYY === type) {
    const day = String(date.getDate()).padStart(2, "0"); // Ensures 2 digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so we add 1
    const year = date.getFullYear();

    // Format the date as 'dd/mm/yyyy'
    return `${day}/${month}/${year}`;
  }

  // Create a formatter for the 'fr-FR' locale
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full", // Full date style (e.g., "lundi 1 janvier 2024")
    timeStyle: "medium", // Medium time style (e.g., "07:46:44")
  });

  // Format the date and return it
  return formatter.format(date);
}

export function formatCDF(amount) {
  // Create a formatter for the 'fr-CD' locale with 'CDF' currency
  const formatter = new Intl.NumberFormat("fr-CD", {
    style: "currency",
    currency: "CDF",
    minimumFractionDigits: 0, // No decimal points
    maximumFractionDigits: 0,
  });

  // Format the amount and return it
  return formatter.format(amount);
}

/* export function GetDateYYYYMMDD(date) {
  return date;
  console.log(`Parsing dateString "${date}"`);

  const dateString = date;
  const [day, month, year] = dateString.split("/"); // Split the string into day, month, and year
  const dateObject = new Date(`${year}-${month}-${day}`);

  const dt = dateObject;
  const y = dt.getFullYear();
  let m = dt.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  const d = dt.getDate();

  return `${y}-${m}-${d}`;
} */

export function FormatDate(date = new Date()) {
  if (date.getHours) {
    // date = date.setHours(date.getHours() + 7);
    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  }
  return date;
}

export function FormatNumberWithCommas(number) {
  return !isNaN(number)
    ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : number;
}

export function Login(userdata) {
  console.log("Loggin in with userdata ... \n", userdata);
  localStorage.setItem("llu", JSON.stringify(userdata));

  setTimeout(() => {
    let path = window.location.origin + "/lalouise/";
    window.location = path;
  }, 2000);
}

export function Logout() {
  localStorage.removeItem("llu");
  const path = window.location.origin + "/lalouise/";
  window.location = path;
}

/* export function CheckLogginExpired(user) {
  const expired = user.login_expires - new Date().getTime() <= 0;

  console.log(
    "user.loggin_expires => ",
    FormatDate(new Date(user.login_expires))
  );
  console.log("new Date().getTime() => ", FormatDate(new Date()));
  console.log(
    "expired",
    expired,
    "\nIn: ",
    hhmmss((user.login_expires - new Date().getTime()) / 1000)
  );

  if (expired) {
    localStorage.removeItem("llu");
    window.location.reload();
  }
} */

/* export function UpdateSessionExpirationTime() {
  //console.log("UpdateSessionExpirationTime");
} */

function pad(num) {
  return ("0" + num).slice(-2);
}

function hhmmss(secs) {
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
}
