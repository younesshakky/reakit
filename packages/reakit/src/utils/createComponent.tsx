// TODO: Refactor
import * as React from "react";
import { forwardRef } from "../__utils/forwardRef";
import { As, PropsWithAs } from "../__utils/types";
import { useWhyDidYouUpdate } from "../__utils/useWhyDidYouUpdate";
import { unstable_splitProps } from "./splitProps";
import { unstable_useCreateElement as defaultUseCreateElement } from "./useCreateElement";

type Hook<O> = {
  (
    options: O,
    props: React.HTMLAttributes<any> & React.RefAttributes<any>
  ): typeof props;
  __keys?: any[];
};

type Options<T extends As, O> = {
  as: T;
  useHook?: Hook<O>;
  hookKeys?: Array<any>;
  useCreateElement?: typeof defaultUseCreateElement;
};

export function unstable_createComponent<T extends As, O>({
  as: type,
  useHook,
  hookKeys = (useHook && useHook.__keys) || [],
  useCreateElement = defaultUseCreateElement
}: Options<T, O>) {
  const displayName =
    process.env.NODE_ENV !== "production" && useHook
      ? useHook.name.replace(/^(unstable_)?use/, "")
      : undefined;

  const Comp = <TT extends As = T>(
    { as = (type as unknown) as TT, ...props }: PropsWithAs<O, TT>,
    ref: React.Ref<any>
  ) => {
    if (displayName && process.env.DEBUG) {
      useWhyDidYouUpdate(displayName, props);
    }
    if (useHook) {
      const [options, htmlProps] = unstable_splitProps(props, hookKeys);
      const elementProps = useHook(options, { ref, ...htmlProps });
      return useCreateElement(as, elementProps);
    }
    return useCreateElement(as, props);
  };

  if (displayName) {
    (Comp as any).displayName = displayName;
  }

  return forwardRef(Comp);
}
