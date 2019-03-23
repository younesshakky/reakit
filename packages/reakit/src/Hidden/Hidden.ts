import { unstable_createComponent } from "../utils/createComponent";
import { mergeProps } from "../utils/mergeProps";
import { useHook } from "../system/useHook";
import { unstable_BoxOptions, unstable_BoxProps, useBox } from "../Box/Box";
import { Keys } from "../__utils/types";
import { useHiddenState, unstable_HiddenStateReturn } from "./HiddenState";

export type unstable_HiddenOptions = unstable_BoxOptions &
  Partial<Pick<unstable_HiddenStateReturn, "visible" | "unstable_hiddenId">>;

export type unstable_HiddenProps = unstable_BoxProps;

export function useHidden(
  options: unstable_HiddenOptions = {},
  htmlProps: unstable_HiddenProps = {}
) {
  htmlProps = mergeProps(
    {
      role: "region",
      id: options.unstable_hiddenId,
      hidden: !options.visible,
      "aria-hidden": !options.visible
    } as typeof htmlProps,
    htmlProps
  );
  htmlProps = useBox(options, htmlProps);
  htmlProps = useHook("useHidden", options, htmlProps);
  return htmlProps;
}

const keys: Keys<unstable_HiddenOptions> = [
  ...useBox.__keys,
  "unstable_hiddenId",
  "visible"
];

const allKeys: Keys<unstable_HiddenOptions & unstable_HiddenStateReturn> = [
  ...useBox.__allKeys,
  ...useHiddenState.__allKeys,
  ...keys
];

useHidden.__keys = keys;
useHidden.__allKeys = allKeys;

export const Hidden = unstable_createComponent({
  as: "div",
  useHook: useHidden
});
