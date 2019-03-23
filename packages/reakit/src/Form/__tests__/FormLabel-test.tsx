import * as React from "react";
import { render } from "react-testing-library";
import { unstable_FormLabel as FormLabel } from "../FormLabel";

test("render", () => {
  const { baseElement } = render(
    <FormLabel name="a" label="b" values={{ a: "" }} />
  );
  expect(baseElement).toMatchInlineSnapshot(`
<body>
  <div>
    <label>
      b
    </label>
  </div>
</body>
`);
});
