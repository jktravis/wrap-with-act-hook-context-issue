function handleJqError(xhr, status, error) {
  const verr = `${xhr.status}
${status}
${error}`;
  console.error(verr);
  if (xhr.status === 403) {
    Main.notifyMessage(
      {
        message:
          "You do not have permission to perform this action, please check your permission level, or refresh your browser.",
      },
      { type: "danger" },
    );
  }
}

export default handleJqError;
