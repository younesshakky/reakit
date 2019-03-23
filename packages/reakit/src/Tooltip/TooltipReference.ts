import { mergeProps } from "../utils/mergeProps";
import { unstable_createComponent } from "../utils/createComponent";
import { useHook } from "../system/useHook";
import { unstable_BoxOptions, unstable_BoxProps, useBox } from "../Box/Box";
import { Keys } from "../__utils/types";
import { useTooltipState, unstable_TooltipStateReturn } from "./TooltipState";

export type unstable_TooltipReferenceOptions = unstable_BoxOptions &
  Partial<
    Pick<
      unstable_TooltipStateReturn,
      "unstable_referenceRef" | "unstable_hiddenId"
    >
  > &
  Pick<unstable_TooltipStateReturn, "show" | "hide">;

export type unstable_TooltipReferenceProps = unstable_BoxProps;

export function useTooltipReference(
  options: unstable_TooltipReferenceOptions,
  htmlProps: unstable_TooltipReferenceProps = {}
) {
  htmlProps = mergeProps(
    {
      ref: options.unstable_referenceRef,
      tabIndex: 0,
      onFocus: options.show,
      onBlur: options.hide,
      onMouseEnter: options.show,
      onMouseLeave: options.hide,
      "aria-describedby": options.unstable_hiddenId
    } as typeof htmlProps,
    htmlProps
  );
  htmlProps = useBox(options, htmlProps);
  htmlProps = useHook("useTooltipReference", options, htmlProps);
  return htmlProps;
}

const keys: Keys<unstable_TooltipReferenceOptions> = [
  ...useBox.__keys,
  "unstable_referenceRef",
  "unstable_hiddenId",
  "show",
  "hide"
];

const allKeys = [...useBox.__allKeys, ...useTooltipState.__allKeys, ...keys];

useTooltipReference.__keys = keys;
useTooltipReference.__allKeys = allKeys;

export const TooltipReference = unstable_createComponent({
  as: "div",
  useHook: useTooltipReference
});
