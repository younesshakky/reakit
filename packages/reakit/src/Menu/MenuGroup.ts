import * as React from "react";
import { mergeProps } from "../utils/mergeProps";
import { unstable_createComponent } from "../utils/createComponent";
import { useHook } from "../system/useHook";
import { unstable_BoxOptions, unstable_BoxProps, useBox } from "../Box/Box";
import { Keys } from "../__utils/types";
import { useMenuState } from "./MenuState";

export type unstable_MenuGroupOptions = unstable_BoxOptions;

export type unstable_MenuGroupProps = unstable_BoxProps &
  React.FieldsetHTMLAttributes<any>;

export function useMenuGroup(
  options: unstable_MenuGroupOptions,
  htmlProps: unstable_MenuGroupProps = {}
) {
  htmlProps = mergeProps(
    {
      role: "group"
    } as typeof htmlProps,
    htmlProps
  );

  htmlProps = useBox(options, htmlProps);
  htmlProps = useHook("useMenuGroup", options, htmlProps);
  return htmlProps;
}

const keys: Keys<unstable_MenuGroupOptions> = [...useBox.__keys];

const allKeys = [...useBox.__allKeys, ...useMenuState.__allKeys, ...keys];

useMenuGroup.__keys = keys;
useMenuGroup.__allKeys = allKeys;

export const MenuGroup = unstable_createComponent({
  as: "fieldset",
  useHook: useMenuGroup
});
