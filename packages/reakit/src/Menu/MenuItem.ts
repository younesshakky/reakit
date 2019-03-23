import { mergeProps } from "../utils/mergeProps";
import { unstable_createComponent } from "../utils/createComponent";
import { useHook } from "../system/useHook";
import {
  unstable_RoverOptions,
  unstable_RoverProps,
  useRover
} from "../Rover/Rover";
import { Keys } from "../__utils/types";
import { useMenuState, unstable_MenuStateReturn } from "./MenuState";

export type unstable_MenuItemOptions = unstable_RoverOptions &
  Partial<
    Pick<unstable_MenuStateReturn, "unstable_parent" | "placement" | "hide">
  >;

export type unstable_MenuItemProps = unstable_RoverProps;

export function useMenuItem(
  { unstable_focusable = true, ...options }: unstable_MenuItemOptions,
  htmlProps: unstable_MenuItemProps = {}
) {
  const allOptions: unstable_MenuItemOptions = {
    unstable_focusable,
    ...options
  };

  htmlProps = mergeProps(
    {
      role: "menuitem",
      onKeyDown: event => {
        const { unstable_parent: parent, hide, placement } = options;
        if (!parent || !hide || !placement) return;

        const [dir] = placement.split("-");
        const target = event.target as Element;
        const parentIsHorizontal = parent.orientation === "horizontal";
        const isDisclosure = target.getAttribute("aria-haspopup") === "menu";

        const keyMap = {
          ArrowRight:
            parentIsHorizontal && !isDisclosure
              ? () => {
                  parent.unstable_next();
                  hide();
                }
              : dir === "left" && hide,
          ArrowLeft:
            parentIsHorizontal && !isDisclosure
              ? () => {
                  parent.unstable_previous();
                  hide();
                }
              : dir === "right" && hide
        };

        if (event.key in keyMap) {
          const key = event.key as keyof typeof keyMap;
          const action = keyMap[key];
          if (typeof action === "function") {
            event.preventDefault();
            action();
          }
        }
      }
    } as typeof htmlProps,
    htmlProps
  );

  htmlProps = useRover(allOptions, htmlProps);
  htmlProps = useHook("useMenuItem", allOptions, htmlProps);
  return htmlProps;
}

const keys: Keys<unstable_MenuItemOptions> = [
  ...useRover.__keys,
  "unstable_parent",
  "placement",
  "hide"
];

const allKeys = [...useRover.__allKeys, ...useMenuState.__allKeys, ...keys];

useMenuItem.__keys = keys;
useMenuItem.__allKeys = allKeys;

export const MenuItem = unstable_createComponent({
  as: "button",
  useHook: useMenuItem
});
