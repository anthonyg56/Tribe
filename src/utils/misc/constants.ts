export const BaseUrl = process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_DEV_ENV_URL : process.env.NEXT_PUBLIC_PROD_ENV_URL

export const capitalize = (string: string) => string.replace(/\b(\w)/g, (s) => s.toUpperCase())   //.charAt(0).toUpperCase() + string.slice(1)

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]