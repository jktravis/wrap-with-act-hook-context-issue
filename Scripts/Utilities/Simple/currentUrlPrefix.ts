//export default
function currentUrlPrefix(): string {
  const pathname = window.location.pathname;
  const sitename = pathname.split("/")[1];
  //const sitename = (<any>window).cobra.siteName;
  let ret = window.location.protocol + "//" + window.location.host + "/";
  if (sitename) {
    ret = ret + sitename + "/";
  }
  return ret;
}
