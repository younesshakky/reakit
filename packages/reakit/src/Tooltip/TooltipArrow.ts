import { unstable_createComponent } from "../utils/createComponent";
import { useHook } from "../system/useHook";
import {
  unstable_PopoverArrowOptions,
  unstable_PopoverArrowProps,
  usePopoverArrow
} from "../Popover/PopoverArrow";
import { Keys } from "../__utils/types";
import { useTooltipState } from "./TooltipState";

export type unstable_TooltipArrowOptions = unstable_PopoverArrowOptions;

export type unstable_TooltipArrowProps = unstable_PopoverArrowProps;

export function useTooltipArrow(
  options: unstable_TooltipArrowOptions,
  htmlProps: unstable_TooltipArrowProps = {}
) {
  htmlProps = usePopoverArrow(options, htmlProps);
  htmlProps = useHook("useTooltipArrow", options, htmlProps);
  return htmlProps;
}

const keys: Keys<unstable_TooltipArrowOptions> = [...usePopoverArrow.__keys];

const allKeys = [
  ...usePopoverArrow.__allKeys,
  ...useTooltipState.__allKeys,
  ...keys
];

useTooltipArrow.__keys = keys;
useTooltipArrow.__allKeys = allKeys;

export const TooltipArrow = unstable_createComponent({
  as: "div",
  useHook: useTooltipArrow
});
