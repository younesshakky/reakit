// Credits: https://github.com/stevejay/react-roving-tabindex
import * as React from "react";
import { warning } from "../__utils/warning";
import { SealedInitialState, useSealedState } from "../__utils/useSealedState";

type Stop = {
  id: string;
  ref: React.RefObject<HTMLElement>;
};

export type unstable_RoverState = {
  /** TODO: Description */
  orientation?: "horizontal" | "vertical";
  /** TODO: Description */
  unstable_stops: Stop[];
  /** TODO: Description */
  unstable_currentId: Stop["id"] | null;
  /** TODO: Description */
  unstable_pastId: Stop["id"] | null;
  /** TODO: Description */
  unstable_loop: boolean;
};

export type unstable_RoverActions = {
  /** TODO: Description */
  unstable_register: (id: Stop["id"], ref: Stop["ref"]) => void;
  /** TODO: Description */
  unstable_unregister: (id: Stop["id"]) => void;
  /** TODO: Description */
  unstable_move: (id: Stop["id"]) => void;
  /** TODO: Description */
  unstable_next: () => void;
  /** TODO: Description */
  unstable_previous: () => void;
  /** TODO: Description */
  unstable_first: () => void;
  /** TODO: Description */
  unstable_last: () => void;
  /** TODO: Description */
  unstable_reset: () => void;
  /** TODO: Description */
  unstable_orientate: (orientation: unstable_RoverState["orientation"]) => void;
};

export type unstable_RoverInitialState = Partial<
  Pick<
    unstable_RoverState,
    "orientation" | "unstable_currentId" | "unstable_loop"
  >
>;

export type unstable_RoverStateReturn = unstable_RoverState &
  unstable_RoverActions;

type RoverAction =
  | { type: "register"; id: Stop["id"]; ref: Stop["ref"] }
  | { type: "unregister"; id: Stop["id"] }
  | { type: "move"; id: Stop["id"] | null }
  | { type: "next" }
  | { type: "previous" }
  | { type: "first" }
  | { type: "last" }
  | { type: "reset" }
  | {
      type: "orientate";
      orientation?: unstable_RoverState["orientation"];
    };

function reducer(
  state: unstable_RoverState,
  action: RoverAction
): unstable_RoverState {
  const {
    unstable_stops: stops,
    unstable_currentId: currentId,
    unstable_pastId: pastId,
    unstable_loop: loop
  } = state;

  switch (action.type) {
    case "register": {
      const { id, ref } = action;
      if (stops.length === 0) {
        return {
          ...state,
          unstable_stops: [{ id, ref }]
        };
      }

      const index = stops.findIndex(stop => stop.id === id);

      if (index >= 0) {
        warning(false, `${id} stop is already registered`, "RoverState");
        return state;
      }

      const afterRefIndex = stops.findIndex(stop => {
        if (!stop.ref.current || !ref.current) return false;
        return Boolean(
          stop.ref.current.compareDocumentPosition(ref.current) &
            Node.DOCUMENT_POSITION_PRECEDING
        );
      });

      if (afterRefIndex === -1) {
        return {
          ...state,
          unstable_stops: [...stops, { id, ref }]
        };
      }
      return {
        ...state,
        unstable_stops: [
          ...stops.slice(0, afterRefIndex),
          { id, ref },
          ...stops.slice(afterRefIndex)
        ]
      };
    }
    case "unregister": {
      const { id } = action;
      const nextStops = stops.filter(stop => stop.id !== id);
      if (nextStops.length === stops.length) {
        warning(false, `${id} stop is not registered`, "RoverState");
        return state;
      }

      return {
        ...state,
        unstable_stops: nextStops,
        unstable_pastId: pastId && pastId === id ? null : pastId,
        unstable_currentId: currentId && currentId === id ? null : currentId
      };
    }
    case "move": {
      const { id } = action;
      const index = stops.findIndex(stop => stop.id === id);

      if (index === -1 || stops[index].id === currentId) {
        return state;
      }

      return {
        ...state,
        unstable_currentId: stops[index].id,
        unstable_pastId: currentId
      };
    }
    case "next": {
      if (currentId == null) {
        return reducer(state, { type: "move", id: stops[0] && stops[0].id });
      }
      const index = stops.findIndex(stop => stop.id === currentId);

      // If loop is truthy, turns [0, currentId, 2, 3] into [currentId, 2, 3, 0]
      // Otherwise turns into [currentId, 2, 3]
      const reorderedStops = [
        ...stops.slice(index + 1),
        ...(loop ? stops.slice(0, index) : [])
      ];

      const nextIndex =
        reorderedStops.findIndex(stop => stop.id === currentId) + 1;

      return reducer(state, {
        type: "move",
        id: reorderedStops[nextIndex] && reorderedStops[nextIndex].id
      });
    }
    case "previous": {
      const nextState = reducer(
        { ...state, unstable_stops: stops.slice().reverse() },
        { type: "next" }
      );
      return {
        ...state,
        unstable_currentId: nextState.unstable_currentId,
        unstable_pastId: nextState.unstable_pastId
      };
    }
    case "first": {
      const stop = stops[0];
      return reducer(state, { type: "move", id: stop && stop.id });
    }
    case "last": {
      const stop = stops[stops.length - 1];
      return reducer(state, { type: "move", id: stop && stop.id });
    }
    case "reset": {
      return {
        ...state,
        unstable_currentId: null,
        unstable_pastId: null
      };
    }
    case "orientate":
      return { ...state, orientation: action.orientation };
    default:
      throw new Error();
  }
}

export function useRoverState(
  initialState: SealedInitialState<unstable_RoverInitialState> = {}
): unstable_RoverStateReturn {
  const {
    unstable_currentId: currentId = null,
    unstable_loop: loop = false,
    ...sealed
  } = useSealedState(initialState);
  const [state, dispatch] = React.useReducer(reducer, {
    ...sealed,
    unstable_stops: [],
    unstable_currentId: currentId,
    unstable_pastId: null,
    unstable_loop: loop
  });

  return {
    ...state,
    unstable_register: React.useCallback(
      (id, ref) => dispatch({ type: "register", id, ref }),
      []
    ),
    unstable_unregister: React.useCallback(
      id => dispatch({ type: "unregister", id }),
      []
    ),
    unstable_move: React.useCallback(id => dispatch({ type: "move", id }), []),
    unstable_next: React.useCallback(() => dispatch({ type: "next" }), []),
    unstable_previous: React.useCallback(
      () => dispatch({ type: "previous" }),
      []
    ),
    unstable_first: React.useCallback(() => dispatch({ type: "first" }), []),
    unstable_last: React.useCallback(() => dispatch({ type: "last" }), []),
    unstable_reset: React.useCallback(() => dispatch({ type: "reset" }), []),
    unstable_orientate: React.useCallback(
      o => dispatch({ type: "orientate", orientation: o }),
      []
    )
  };
}

const keys: Array<keyof unstable_RoverStateReturn> = [
  "orientation",
  "unstable_stops",
  "unstable_currentId",
  "unstable_pastId",
  "unstable_loop",
  "unstable_register",
  "unstable_unregister",
  "unstable_move",
  "unstable_next",
  "unstable_previous",
  "unstable_first",
  "unstable_last",
  "unstable_reset",
  "unstable_orientate"
];

useRoverState.keys = keys;
