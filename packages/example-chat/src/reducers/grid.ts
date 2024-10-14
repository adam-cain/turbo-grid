import { EdgeAction } from "@turbo-ing/edge-v0";

export interface Cell {
    x: number;
    y: number;
    value: any;
    updatedBy: string | null; // peerId of the updater
}

export interface GridState {
    grid: Cell[][];
    names: { [peerId: string]: string };
}

interface UpdateCellAction extends EdgeAction<GridState> {
    type: 'UPDATE_CELL';
    payload: {
        x: number;
        y: number;
        value: any;
    };
}

interface SetUserNameAction extends EdgeAction<GridState> {
    type: 'SET_USER_NAME';
    payload: {
        name: string;
    };
}

export type GridAction = UpdateCellAction | SetUserNameAction;

export const initialState: GridState = {
    grid: Array.from({ length: 10 }, (_, x) =>
        Array.from({ length: 10 }, (_, y) => ({
            x,
            y,
            value: null,
            updatedBy: null,
        }))
    ),
    names: {},
};

export function gridReducer(
    state: GridState = initialState,
    action: GridAction
): GridState {
    if (!action.peerId) return state;

    const peerId = action.peerId as string;

    switch (action.type) {
        case 'SET_USER_NAME': {
            const { name } = action.payload;
            return {
                ...state,
                names: {
                    ...state.names,
                    [peerId]: name,
                },
            };
        }
        case 'UPDATE_CELL': {
            const { x, y, value } = action.payload;

            // Ensure x and y are within bounds
            if (x < 0 || x >= 10 || y < 0 || y >= 10) {
                return state;
            }

            return {
                ...state,
                grid: state.grid.map((row, rowIndex) =>
                    rowIndex === x
                        ? row.map((cell, colIndex) =>
                            colIndex === y
                                ? { ...cell, value, updatedBy: peerId }
                                : cell
                        )
                        : row
                ),
            };
        }
        default:
            return state;
    }
}
