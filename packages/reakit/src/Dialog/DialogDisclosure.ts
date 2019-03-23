import { mergeProps } from "../utils/mergeProps";
import { unstable_createComponent } from "../utils/createComponent";
import { useHook } from "../system/useHook";
import {
  unstable_HiddenDisclosureOptions,
  unstable_HiddenDisclosureProps,
  useHiddenDisclosure
} from "../Hidden/HiddenDisclosure";
import { Keys } from "../__utils/types";
import { useDialogState } from "./DialogState";

export type unstable_DialogDisclosureOptions = unstable_HiddenDisclosureOptions;

export type unstable_DialogDisclosureProps = unstable_HiddenDisclosureProps;

export function useDialogDisclosure(
  options: unstable_DialogDisclosureOptions,
  htmlProps: unstable_DialogDisclosureProps = {}
) {
  htmlProps = mergeProps(
    {
      "aria-haspopup": "dialog"
    } as typeof htmlProps,
    htmlProps
  );
  htmlProps = useHiddenDisclosure(options, htmlProps);
  htmlProps = useHook("useDialogDisclosure", options, htmlProps);
  return htmlProps;
}

const keys: Keys<unstable_DialogDisclosureOptions> = [
  ...useHiddenDisclosure.__keys
];

const allKeys = [
  ...useHiddenDisclosure.__allKeys,
  ...useDialogState.__allKeys,
  ...keys
];

useDialogDisclosure.__keys = keys;
useDialogDisclosure.__allKeys = allKeys;

export const DialogDisclosure = unstable_createComponent({
  as: "button",
  useHook: useDialogDisclosure
});
