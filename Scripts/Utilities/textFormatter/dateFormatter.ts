import moment from "moment";

const dateFormat = "lll"; //per Phil's suggestion for internationalization, but this is returns Feb 26, 2019 2:23 PM, which isn't what I want either
const timeFormat = "LTS"; //consider using m.format(dateFormat) + " " + m.format(timeformat) , replacing dateformat with 'l'

function formatDate(dt: any): string {
  if (dt === null || dt === undefined) {
    return null;
  }
  const m = moment.utc(dt).local();
  return m.format(dateFormat);
}

function formatDateFromUnix(dt: number): string {
  const m = moment.unix(dt).local();
  return m.format(dateFormat);
}

export { formatDate, formatDateFromUnix };
