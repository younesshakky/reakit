import { unstable_createComponent } from "../utils/createComponent";
import { useHook } from "../system/useHook";
import {
  unstable_SeparatorOptions,
  unstable_SeparatorProps,
  useSeparator
} from "../Separator/Separator";
import { Keys } from "../__utils/types";
import { useMenuState } from "./MenuState";

export type unstable_MenuSeparatorOptions = unstable_SeparatorOptions;

export type unstable_MenuSeparatorProps = unstable_SeparatorProps;

export function useMenuSeparator(
  options: unstable_MenuSeparatorOptions,
  htmlProps: unstable_MenuSeparatorProps = {}
) {
  htmlProps = useSeparator(options, htmlProps);
  htmlProps = useHook("useMenuSeparator", options, htmlProps);
  return htmlProps;
}

const keys: Keys<unstable_MenuSeparatorOptions> = [...useSeparator.__keys];

const allKeys = [...useSeparator.__allKeys, ...useMenuState.__allKeys, ...keys];

useMenuSeparator.__keys = keys;
useMenuSeparator.__allKeys = allKeys;

export const MenuSeparator = unstable_createComponent({
  as: "hr",
  useHook: useMenuSeparator
});
