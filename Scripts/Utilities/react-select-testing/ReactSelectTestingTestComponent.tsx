import React, { useState } from "react";
import Select from "react-select";

const options = [
  { value: "First", label: "First" },
  { value: "Second", label: "Second" },
  { value: "Third", label: "Third" },
];

function ReactSelectTestingTestComponent() {
  const [option, setOption] = useState(null);
  return (
    <div>
      <label htmlFor="option-select">Select Option</label>
      <Select
        className="react-select"
        classNamePrefix="react-select"
        name="option-select"
        id="option-select"
        value={option}
        options={options}
        onChange={option => setOption(option)}
      />
      {option && <div data-testid="render-result">{option.label}</div>}
    </div>
  );
}

export default ReactSelectTestingTestComponent;
