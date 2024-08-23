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

export function GetDateYYYYMMDD(date) {
  const dateString = "12/05/2002";
  const [day, month, year] = dateString.split("/"); // Split the string into day, month, and year
  const dateObject = new Date(`${year}-${month}-${day}`);

  const dt = dateObject;
  const y = dt.getFullYear();
  let m = dt.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  const d = dt.getDate();

  return `${y}-${m}-${d}`;
}

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
