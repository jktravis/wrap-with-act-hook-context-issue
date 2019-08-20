/**
 * Set the new URL to trigger a redirect to the lockout page.
 * @param {string} fromUser the userId?
 */
function redirectToLockout(fromUser: string) {
  window.location.href = `${currentUrlPrefix()}Account/RedirectToLockout?lockoutString=${fromUser}`;
}

export default redirectToLockout;
