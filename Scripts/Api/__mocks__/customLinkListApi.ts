const getUserLinks = jest.fn(() =>
  Promise.resolve([
    {
      Title: "Google",
      Link: "https://www.google.com/",
      Edit: false,
    },
    {
      Title: "Wikipedia",
      Link: "http://www.wikipedia.com/",
      Edit: false,
    },
  ]),
);

const setUserLinks = jest.fn(() => Promise.resolve());

export { getUserLinks, setUserLinks };
