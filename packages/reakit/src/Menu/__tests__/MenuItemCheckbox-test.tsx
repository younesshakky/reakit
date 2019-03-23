import * as React from "react";
import { render } from "react-testing-library";
import { unstable_MenuItemCheckbox as MenuItemCheckbox } from "../MenuItemCheckbox";

const props: Parameters<typeof MenuItemCheckbox>[0] = {
  name: "checkbox",
  unstable_values: {},
  stopId: "item",
  stops: [],
  currentId: null,
  pastId: null,
  unstable_update: jest.fn(),
  register: jest.fn(),
  unregister: jest.fn(),
  move: jest.fn(),
  next: jest.fn(),
  previous: jest.fn(),
  first: jest.fn(),
  last: jest.fn()
};

test("render", () => {
  const { baseElement } = render(<MenuItemCheckbox {...props} />);
  expect(baseElement).toMatchInlineSnapshot(`
<body>
  <div>
    <input
      aria-checked="false"
      id="item"
      name="checkbox"
      role="menuitemcheckbox"
      tabindex="0"
      type="checkbox"
      value=""
    />
  </div>
</body>
`);
});
