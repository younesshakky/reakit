import * as React from "react";
import { unstable_createComponent } from "../utils/createComponent";
import { unstable_useCreateElement } from "../utils/useCreateElement";
import { mergeProps } from "../utils/mergeProps";
import { useHook } from "../system/useHook";
import { Portal } from "../Portal/Portal";
import {
  unstable_HiddenOptions,
  unstable_HiddenProps,
  useHidden
} from "../Hidden/Hidden";
import { Keys } from "../__utils/types";
import { useDialogState } from "./DialogState";

export type unstable_DialogBackdropOptions = unstable_HiddenOptions;

export type unstable_DialogBackdropProps = unstable_HiddenProps;

export function useDialogBackdrop(
  options: unstable_DialogBackdropOptions = {},
  htmlProps: unstable_DialogBackdropProps = {}
) {
  htmlProps = mergeProps(
    {
      id: undefined,
      role: undefined,
      style: {
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    } as typeof htmlProps,
    htmlProps
  );
  htmlProps = useHidden(options, htmlProps);
  htmlProps = useHook("useDialogBackdrop", options, htmlProps);
  return htmlProps;
}

const keys: Keys<unstable_DialogBackdropOptions> = [...useHidden.__keys];

const allKeys = [...useHidden.__allKeys, ...useDialogState.__allKeys, ...keys];

useDialogBackdrop.__keys = keys;
useDialogBackdrop.__allKeys = allKeys;

export const DialogBackdrop = unstable_createComponent({
  as: "div",
  useHook: useDialogBackdrop,
  useCreateElement: (type, props, children) => {
    const element = unstable_useCreateElement(type, props, children);
    return <Portal>{element}</Portal>;
  }
});
