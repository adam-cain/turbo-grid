import { useEdgeReducerV0, useTurboEdgeV0 } from "@turbo-ing/edge-v0";
import { useEffect, useState } from "react";
import { gridReducer, initialState } from "./reducers/grid";
import TurboLogo from "./assets/turbo-logo.svg";
import ColorPicker from "./assets/color-picker.svg"
import PingPeers from "./PingPeers";

function App() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomIdCommitted, setRoomIdCommitted] = useState("");
  const [color, setColor] = useState("#000");

  const [state, dispatch, connected] = useEdgeReducerV0(
    gridReducer,
    initialState,
    {
      topic: roomIdCommitted,
      onDispatch: (action) => console.log('onDispatch:', action),
      onPayload: (state) => console.log('onPayload:', state),
      onReset: (state) => console.log('onReset:', state),
    }
  );

  const turboEdge = useTurboEdgeV0();

  useEffect(() => {
    if (connected) {
      dispatch({
        type: "SET_USER_NAME",
        payload: {
          name,
        },
      });
    }
  }, [name, connected, roomIdCommitted]);

  const handleColourPickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value)
  }

  const handleCellClick = (x: number, y: number) => {
    if (color !== null) {
      dispatch({
        type: "UPDATE_CELL",
        payload: {
          x,
          y,
          value: color,
        },
      });
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex flex-col justify-center">
          <div className="mb-5">
            <div className="flex items-center justify-center mb-2">
              <div>
                <img src={TurboLogo} width={190} alt="Turbo Logo"></img>
              </div>
              <div className="text-white text-4xl font-bold">GRID</div>
            </div>

            <div className="text-center text-white text-lg">
              100% P2P collaborative grid, zero servers
            </div>
            <div className="text-center text-white text-lg font-bold">
              Powered by Turbo Edge
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <input
              className="p-2 px-3 rounded w-full"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!turboEdge}
            ></input>
          </div>

          <div className="flex gap-3">
            <input
              className="p-2 px-3 rounded w-full border-none border-0"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={!turboEdge}
            ></input>
            <button
              className="bg-white rounded px-6 text-xl font-bold hover:bg-gray-200 transition"
              onClick={() => setRoomIdCommitted(roomId)}
              disabled={!turboEdge}
            >
              Join
            </button>
          </div>

          <div className="text-sm text-white mt-1">
            <i>
              Hint: Enter any Room ID; they're all public. Just share the correct one with your friend.
            </i>
          </div>

          {roomIdCommitted &&
            (connected ? (
              <div className="bg-white rounded w-full mt-4">
                <div className="border-b border-gray-400 font-bold py-3 px-4 justify-between flex align-middle">
                  <div>Room ID: {roomIdCommitted}</div>
                  <div className="flex h-6">
                    <input type="color" value={color} onChange={handleColourPickerChange} autoFocus
                      className=" cursor-pointer rounded-l-lg border border-gray-400 h-6" />
                    <div className=" border rounded-r-lg border-gray-400">
                      <img src={ColorPicker} width={18} alt="Color Picker" className=" m-0.5 "></img>
                    </div>
                  </div>
                </div>

                <div className=" p-4 overflow-auto xl:px-24 2xl:px-48">
                  <div className="grid grid-cols-10 gap-0 aspect-square">
                    {state.grid.map((row, x) =>
                      row.map((cell, y) => (
                        <div
                          key={`${x}-${y}`}
                          className=" flex items-center justify-center cursor-pointer border"
                          style={{ backgroundColor: cell.value || "#FFF" }}
                          onClick={() => handleCellClick(x, y)}
                          title={`Updated by: ${cell.updatedBy || "N/A"}`}
                        ></div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-800 px-4">
                  <div className="truncate">
                    Peer ID: {turboEdge?.node.peerId.toString()}
                  </div>
                  <div className="mt-0.5">
                    Status: {turboEdge?.node.status}
                  </div>
                  <div className="mt-0.5 flex flex-col gap-0.5">
                    <PingPeers
                      roomId={roomIdCommitted}
                      names={{}} // Adjusted as needed
                    ></PingPeers>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-lg text-white mt-4">Connecting...</div>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
