import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {format} from 'date-fns'

export const ONE_GB = 1073741824;
export const MAXIMUM_STORAGE = 1000;

export const ONE_MB_PER_GB = 1024;
export const ONE_MB = 1048576;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getGoogleUrl = (from: string) => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

  const options = {
    redirect_uri: import.meta.env.GOOGLE_OAUTH_REDIRECT as string,
    client_id: import.meta.env.GOOGLE_OAUTH_CLIENT_ID as string,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    state: from,
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};

export const formatCreatedDate = (createdAt: Date | undefined) => {
  if (!createdAt) return ''
  return format(createdAt, 'dd/MM/yyyy HH:mm')
}

export function nFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  // @ts-ignore
  const item = lookup.findLast(item => num >= item.value);
  return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
}

export function padNumber(n : number) {
  return String(n).padStart(2, '0')
}

export function createRandomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function numberWithCommas(x: number) {
  if (x == undefined || x == null) return ''
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
}

export function getNameMonthNearest(n : number) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const today = new Date();
  let d;
  let month;

  let rlt: any[] = [];
  for(let i = n; i > 0; i -= 1) {
    d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    month = monthNames[d.getMonth()];

    rlt = [...rlt, {
      mth: d.getMonth() + 1,
      name: month
    }]
  }

  return rlt;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return {
    amount: 0,
    unit: 'Bytes'
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return {
    amount: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    unit: sizes[i]
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}