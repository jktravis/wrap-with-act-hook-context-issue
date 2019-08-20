This module is intended to be used only as a reference to testing a component
that uses the `react-select` library. It focuses on v2 of the library.

It's important to note that when testing this component, the optional `classNamePrefix` must be used in order to grab
the elements and trigger the events. The gist goes like this:

1. Fire focus event on the ReactSelect component `.react-select input` element.
2. Fire a mouseDown event on the `.react-select__control` element.
3. Fire a click on the option element that you want to select.

In some cases, for instance when not using a label, you will need to also include the `className` as well in order
to have some base to select. This will allow something like:

```javascript
const { container } = render(<Comp />);
const selectInput = container.querySelector(".react-select input");
```

[SO](https://stackoverflow.com/questions/54848370/how-do-i-trigger-the-change-event-on-a-react-select-component-with-react-testing/54849326#54849326)
