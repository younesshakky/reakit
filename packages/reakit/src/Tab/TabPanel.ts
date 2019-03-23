import { mergeProps } from "../utils/mergeProps";
import { unstable_createComponent } from "../utils/createComponent";
import { useHook } from "../system/useHook";
import {
  unstable_HiddenOptions,
  unstable_HiddenProps,
  useHidden
} from "../Hidden/Hidden";
import { Keys } from "../__utils/types";
import { getTabPanelId, getTabId } from "./__utils";
import { useTabState, unstable_TabStateReturn } from "./TabState";

export type unstable_TabPanelOptions = unstable_HiddenOptions &
  Pick<unstable_TabStateReturn, "unstable_baseId" | "unstable_selectedId"> & {
    /** TODO: Description */
    stopId: string;
  };

export type unstable_TabPanelProps = unstable_HiddenProps;

export function useTabPanel(
  options: unstable_TabPanelOptions,
  htmlProps: unstable_TabPanelProps = {}
) {
  const visible = options.unstable_selectedId === options.stopId;
  const allOptions: unstable_TabPanelOptions = { visible, ...options };

  htmlProps = mergeProps(
    {
      role: "tabpanel",
      tabIndex: 0,
      id: getTabPanelId(options.stopId, options.unstable_baseId),
      "aria-labelledby": getTabId(options.stopId, options.unstable_baseId)
    } as typeof htmlProps,
    htmlProps
  );
  htmlProps = useHidden(allOptions, htmlProps);
  htmlProps = useHook("useTabPanel", allOptions, htmlProps);
  return htmlProps;
}

const keys: Keys<unstable_TabPanelOptions> = [
  ...useHidden.__keys,
  "unstable_baseId",
  "unstable_selectedId",
  "stopId"
];

const allKeys = [...useHidden.__allKeys, ...useTabState.__allKeys, ...keys];

useTabPanel.__keys = keys;
useTabPanel.__allKeys = allKeys;

export const TabPanel = unstable_createComponent({
  as: "div",
  useHook: useTabPanel
});
