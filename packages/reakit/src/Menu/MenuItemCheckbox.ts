import * as React from "react";
import { mergeProps } from "../utils/mergeProps";
import { unstable_createComponent } from "../utils/createComponent";
import { useHook } from "../system/useHook";
import { unstable_CheckboxOptions, useCheckbox } from "../Checkbox/Checkbox";
import { Keys } from "../__utils/types";
import {
  unstable_MenuItemOptions,
  unstable_MenuItemProps,
  useMenuItem
} from "./MenuItem";
import { useMenuState, unstable_MenuStateReturn } from "./MenuState";

export type unstable_MenuItemCheckboxOptions = unstable_CheckboxOptions &
  unstable_MenuItemOptions &
  Pick<unstable_MenuStateReturn, "unstable_values" | "unstable_update"> & {
    /** TODO: Description */
    name: string;
  };

export type unstable_MenuItemCheckboxProps = unstable_MenuItemProps &
  React.InputHTMLAttributes<any>;

export function unstable_useMenuItemCheckbox(
  options: unstable_MenuItemCheckboxOptions,
  htmlProps: unstable_MenuItemCheckboxProps = {}
) {
  const currentValue = options.unstable_values[options.name];
  const setValue = (value: any) => options.unstable_update(options.name, value);

  htmlProps = mergeProps(
    {
      role: "menuitemcheckbox",
      name: options.name
    } as typeof htmlProps,
    htmlProps
  );

  htmlProps = useCheckbox({ ...options, currentValue, setValue }, htmlProps);
  htmlProps = useMenuItem(options, htmlProps);
  htmlProps = useHook("useMenuItemCheckbox", options, htmlProps);
  return htmlProps;
}

const keys: Keys<unstable_MenuItemCheckboxOptions> = [
  ...useCheckbox.__keys,
  ...useMenuItem.__keys,
  "unstable_values",
  "unstable_update",
  "name"
];

const allKeys = [
  ...useCheckbox.__allKeys,
  ...useMenuItem.__allKeys,
  ...useMenuState.__allKeys,
  ...keys
];

unstable_useMenuItemCheckbox.__keys = keys;
unstable_useMenuItemCheckbox.__allKeys = allKeys;

export const unstable_MenuItemCheckbox = unstable_createComponent({
  as: "input",
  useHook: unstable_useMenuItemCheckbox
});
