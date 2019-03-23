import { mergeProps } from "../utils/mergeProps";
import { unstable_createComponent } from "../utils/createComponent";
import { useHook } from "../system/useHook";
import {
  unstable_RadioOptions,
  unstable_RadioProps,
  unstable_useRadio
} from "../Radio/Radio";
import { Keys } from "../__utils/types";
import { useMenuState, unstable_MenuStateReturn } from "./MenuState";

export type unstable_MenuItemRadioOptions = unstable_RadioOptions &
  Partial<
    Pick<unstable_MenuStateReturn, "unstable_parent" | "hide" | "placement">
  > &
  Pick<unstable_MenuStateReturn, "unstable_values" | "unstable_update"> & {
    /** TODO: Description */
    name: string;
  };

export type unstable_MenuItemRadioProps = unstable_RadioProps;

export function unstable_useMenuItemRadio(
  options: unstable_MenuItemRadioOptions,
  htmlProps: unstable_MenuItemRadioProps = {}
) {
  const currentValue = options.unstable_values[options.name];
  const setValue = (value: any) => options.unstable_update(options.name, value);

  htmlProps = mergeProps(
    {
      role: "menuitemradio",
      onKeyDown: event => {
        const { unstable_parent: parent, hide, placement } = options;
        if (!parent || !hide || !placement) return;

        const [dir] = placement.split("-");
        const parentIsHorizontal = parent.orientation === "horizontal";

        const keyMap = {
          ArrowRight: parentIsHorizontal
            ? () => {
                parent.unstable_next();
                hide();
              }
            : dir === "left" && hide,
          ArrowLeft: parentIsHorizontal
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

  htmlProps = unstable_useRadio(
    { ...options, currentValue, setValue },
    htmlProps
  );
  htmlProps = useHook("useMenuItemRadio", options, htmlProps);
  return htmlProps;
}

const keys: Keys<unstable_MenuItemRadioOptions> = [
  ...unstable_useRadio.__keys,
  "unstable_parent",
  "hide",
  "placement",
  "unstable_values",
  "unstable_update",
  "name"
];

const allKeys = [
  ...unstable_useRadio.__allKeys,
  ...useMenuState.__allKeys,
  ...keys
];

unstable_useMenuItemRadio.__keys = keys;
unstable_useMenuItemRadio.__allKeys = allKeys;

export const unstable_MenuItemRadio = unstable_createComponent({
  as: "input",
  useHook: unstable_useMenuItemRadio
});
