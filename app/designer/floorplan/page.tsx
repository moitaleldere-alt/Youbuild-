"use client";

import { useState } from "react";

type Room = {
  id: number;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
};

type Wall = {
  id: number;
  name: string;
  length: number;
  thickness: number;
  x: number;
  y: number;
  direction: "horizontal" | "vertical";
};

type Door = {
  id: number;
  name: string;
  width: number;
  wallId: number;
  position: number;
  type: "Interior" | "Exterior";
  swing: "Left" | "Right";
};

type Window = {
  id: number;
  name: string;
  width: number;
  wallId: number;
  position: number;
};

const roomTypes = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining Room",
  "Garage",
];

export default function FloorplanDesigner() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      name: "Living Room",
      width: 6,
      height: 5,
      x: 40,
      y: 60,
    },
  ]);

  const [walls, setWalls] = useState<Wall[]>([
    {
      id: 1,
      name: "Exterior Wall",
      length: 12,
      thickness: 0.2,
      x: 20,
      y: 20,
      direction: "horizontal",
    },
  ]);

  const [doors, setDoors] = useState<Door[]>([]);
  const [windows, setWindows] = useState<Window[]>([]);

  const [selectedId, setSelectedId] =
    useState<number | null>(1);

  const [selectedWallId, setSelectedWallId] =
    useState<number | null>(null);

  const [selectedDoorId, setSelectedDoorId] =
    useState<number | null>(null);

  const [selectedWindowId, setSelectedWindowId] =
    useState<number | null>(null);

  const selectedRoom = rooms.find(
    (room) => room.id === selectedId
  );

  const selectedWall = walls.find(
    (wall) => wall.id === selectedWallId
  );

  const selectedDoor = doors.find(
    (door) => door.id === selectedDoorId
  );

  const selectedWindow = windows.find(
    (window) => window.id === selectedWindowId
  );

  function clearSelection() {
    setSelectedId(null);
    setSelectedWallId(null);
    setSelectedDoorId(null);
    setSelectedWindowId(null);
  }

  function selectRoom(id: number) {
    setSelectedId(id);
    setSelectedWallId(null);
    setSelectedDoorId(null);
    setSelectedWindowId(null);
  }

  function selectWall(id: number) {
    setSelectedId(null);
    setSelectedWallId(id);
    setSelectedDoorId(null);
    setSelectedWindowId(null);
  }

  function selectDoor(id: number) {
    setSelectedId(null);
    setSelectedWallId(null);
    setSelectedDoorId(id);
    setSelectedWindowId(null);
  }

  function selectWindow(id: number) {
    setSelectedId(null);
    setSelectedWallId(null);
    setSelectedDoorId(null);
    setSelectedWindowId(id);
  }

  function addRoom(name: string) {
    const newRoom: Room = {
      id: Date.now(),
      name,
      width: 4,
      height: 4,
      x: 80 + rooms.length * 25,
      y: 100 + rooms.length * 25,
    };

    setRooms((current) => [...current, newRoom]);
    selectRoom(newRoom.id);
  }

  function removeRoom(id: number) {
    setRooms((current) =>
      current.filter((room) => room.id !== id)
    );

    if (selectedId === id) {
      clearSelection();
    }
  }

  function updateSelectedRoom(
    property: "width" | "height",
    value: number
  ) {
    if (!selectedId) return;

    setRooms((current) =>
      current.map((room) =>
        room.id === selectedId
          ? {
              ...room,
              [property]: Math.max(2, value),
            }
          : room
      )
    );
  }

  function moveSelected(dx: number, dy: number) {
    if (!selectedId) return;

    setRooms((current) =>
      current.map((room) =>
        room.id === selectedId
          ? {
              ...room,
              x: Math.max(
                0,
                Math.min(600, room.x + dx)
              ),
              y: Math.max(
                0,
                Math.min(420, room.y + dy)
              ),
            }
          : room
      )
    );
  }

  function addWall(
    direction: "horizontal" | "vertical"
  ) {
    const newWall: Wall = {
      id: Date.now(),
      name: "Interior Wall",
      length: 6,
      thickness: 0.2,
      x: 100 + walls.length * 20,
      y: 100 + walls.length * 20,
      direction,
    };

    setWalls((current) => [...current, newWall]);
    selectWall(newWall.id);
  }

  function removeWall(id: number) {
    setWalls((current) =>
      current.filter((wall) => wall.id !== id)
    );

    setDoors((current) =>
      current.filter((door) => door.wallId !== id)
    );

    setWindows((current) =>
      current.filter(
        (window) => window.wallId !== id
      )
    );

    if (selectedWallId === id) {
      clearSelection();
    }
  }

  function updateSelectedWall(
    property: "length" | "thickness",
    value: number
  ) {
    if (!selectedWallId) return;

    setWalls((current) =>
      current.map((wall) =>
        wall.id === selectedWallId
          ? {
              ...wall,
              [property]:
                property === "length"
                  ? Math.max(1, value)
                  : Math.max(0.1, value),
            }
          : wall
      )
    );
  }

  function addDoor(
    type: "Interior" | "Exterior",
    wallId: number
  ) {
    const wall = walls.find(
      (item) => item.id === wallId
    );

    if (!wall) return;

    const newDoor: Door = {
      id: Date.now(),
      name: `${type} Door`,
      width: 0.9,
      wallId,
      position: Math.min(
        Math.max(wall.length / 2, 0.5),
        Math.max(wall.length - 0.5, 0.5)
      ),
      type,
      swing: "Right",
    };

    setDoors((current) => [
      ...current,
      newDoor,
    ]);

    selectDoor(newDoor.id);
  }

  function removeDoor(id: number) {
    setDoors((current) =>
      current.filter((door) => door.id !== id)
    );

    if (selectedDoorId === id) {
      clearSelection();
    }
  }

  function updateSelectedDoor(
    property: "width" | "swing" | "type",
    value: number | string
  ) {
    if (!selectedDoorId) return;

    setDoors((current) =>
      current.map((door) => {
        if (door.id !== selectedDoorId) {
          return door;
        }

        if (property === "width") {
          return {
            ...door,
            width: Math.max(
              0.6,
              Number(value)
            ),
          };
        }

        if (property === "swing") {
          return {
            ...door,
            swing: value as
              | "Left"
              | "Right",
          };
        }

        return {
          ...door,
          type: value as
            | "Interior"
            | "Exterior",
          name: `${value} Door`,
        };
      })
    );
  }

  function addWindow(wallId: number) {
    const wall = walls.find(
      (item) => item.id === wallId
    );

    if (!wall) return;

    const newWindow: Window = {
      id: Date.now(),
      name: "Window",
      width: 1.2,
      wallId,
      position: Math.min(
        Math.max(wall.length / 2, 0.6),
        Math.max(wall.length - 0.6, 0.6)
      ),
    };

    setWindows((current) => [
      ...current,
      newWindow,
    ]);

    selectWindow(newWindow.id);
  }

  function removeWindow(id: number) {
    setWindows((current) =>
      current.filter(
        (window) => window.id !== id
      )
    );

    if (selectedWindowId === id) {
      clearSelection();
    }
  }

  function updateSelectedWindow(
    property: "width",
    value: number
  ) {
    if (!selectedWindowId) return;

    setWindows((current) =>
      current.map((window) =>
        window.id === selectedWindowId
          ? {
              ...window,
              width: Math.max(
                0.4,
                value
              ),
            }
          : window
      )
    );
  }

  const totalArea = rooms.reduce(
    (total, room) =>
      total + room.width * room.height,
    0
  );

  const totalWallLength = walls.reduce(
    (total, wall) =>
      total + wall.length,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-bold"
          >
            You
            <span className="text-green-600">
              Build
            </span>
          </a>

          <span className="text-sm text-gray-500">
            Floor Plan Designer
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            Home Designer
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Build your floor plan
          </h1>

          <p className="mt-2 text-gray-600">
            Design rooms, walls, doors and
            windows for your future home.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr_270px]">
          {/* LEFT PANEL */}
          <aside className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">
              Rooms
            </h2>

            <div className="mt-4 space-y-2">
              {roomTypes.map((room) => (
                <button
                  key={room}
                  onClick={() =>
                    addRoom(room)
                  }
                  className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50"
                >
                  + {room}
                </button>
              ))}
            </div>

            <div className="mt-7 border-t pt-5">
              <h2 className="font-semibold">
                Walls
              </h2>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() =>
                    addWall("horizontal")
                  }
                  className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50"
                >
                  + Horizontal wall
                </button>

                <button
                  onClick={() =>
                    addWall("vertical")
                  }
                  className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50"
                >
                  + Vertical wall
                </button>
              </div>
            </div>

            <div className="mt-7 border-t pt-5">
              <h2 className="font-semibold">
                Doors
              </h2>

              <div className="mt-4 space-y-2">
                <button
                  disabled={walls.length === 0}
                  onClick={() => {
                    if (walls[0]) {
                      addDoor(
                        "Interior",
                        walls[0].id
                      );
                    }
                  }}
                  className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  + Interior door
                </button>

                <button
                  disabled={walls.length === 0}
                  onClick={() => {
                    if (walls[0]) {
                      addDoor(
                        "Exterior",
                        walls[0].id
                      );
                    }
                  }}
                  className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  + Exterior door
                </button>
              </div>
            </div>

            <div className="mt-7 border-t pt-5">
              <h2 className="font-semibold">
                Windows
              </h2>

              <button
                disabled={walls.length === 0}
                onClick={() => {
                  if (walls[0]) {
                    addWindow(
                      walls[0].id
                    );
                  }
                }}
                className="mt-4 w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                + Window
              </button>
            </div>
          </aside>

          {/* CANVAS */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="font-semibold">
                  Floor plan canvas
                </h2>

                <p className="text-xs text-gray-500">
                  Select an element to edit it.
                </p>
              </div>

              <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium">
                {rooms.length} rooms ·{" "}
                {walls.length} walls ·{" "}
                {doors.length} doors ·{" "}
                {windows.length} windows
              </div>
            </div>

            <div className="overflow-auto p-4">
              <div
                className="relative min-h-[500px] min-w-[700px] overflow-hidden rounded-xl border-2 border-dashed border-gray-300"
                style={{
                  backgroundImage:
                    "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
                  backgroundSize:
                    "20px 20px",
                }}
              >
                {/* ROOMS */}
                {rooms.map((room) => {
                  const isSelected =
                    room.id === selectedId;

                  return (
                    <button
                      key={room.id}
                      onClick={() =>
                        selectRoom(room.id)
                      }
                      className={`absolute flex flex-col items-center justify-center rounded-lg border-2 text-center ${
                        isSelected
                          ? "border-green-600 bg-green-100 shadow-lg"
                          : "border-gray-500 bg-white"
                      }`}
                      style={{
                        left: room.x,
                        top: room.y,
                        width:
                          room.width * 35,
                        height:
                          room.height * 30,
                      }}
                    >
                      <span className="text-sm font-semibold">
                        {room.name}
                      </span>

                      <span className="mt-1 text-xs text-gray-500">
                        {room.width}m ×{" "}
                        {room.height}m
                      </span>
                    </button>
                  );
                })}

                {/* WALLS */}
                {walls.map((wall) => {
                  const isSelected =
                    wall.id ===
                    selectedWallId;

                  const horizontal =
                    wall.direction ===
                    "horizontal";

                  return (
                    <button
                      key={wall.id}
                      onClick={() =>
                        selectWall(wall.id)
                      }
                      className={`absolute z-10 rounded-sm ${
                        isSelected
                          ? "bg-green-600 shadow-lg"
                          : "bg-gray-800"
                      }`}
                      style={{
                        left: wall.x,
                        top: wall.y,
                        width: horizontal
                          ? wall.length * 35
                          : 8,
                        height: horizontal
                          ? 8
                          : wall.length * 35,
                      }}
                    />
                  );
                })}

                {/* DOORS */}
                {doors.map((door) => {
                  const wall = walls.find(
                    (item) =>
                      item.id ===
                      door.wallId
                  );

                  if (!wall) return null;

                  const horizontal =
                    wall.direction ===
                    "horizontal";

                  const isSelected =
                    door.id ===
                    selectedDoorId;

                  const position =
                    door.position * 35;

                  return (
                    <button
                      key={door.id}
                      onClick={() =>
                        selectDoor(door.id)
                      }
                      className={`absolute z-30 ${
                        isSelected
                          ? "bg-green-600"
                          : "bg-amber-500"
                      }`}
                      style={{
                        left: horizontal
                          ? wall.x + position
                          : wall.x,
                        top: horizontal
                          ? wall.y
                          : wall.y + position,
                        width: horizontal
                          ? door.width * 35
                          : 10,
                        height: horizontal
                          ? 10
                          : door.width * 35,
                      }}
                    />
                  );
                })}

                {/* WINDOWS */}
                {windows.map((window) => {
                  const wall = walls.find(
                    (item) =>
                      item.id ===
                      window.wallId
                  );

                  if (!wall) return null;

                  const horizontal =
                    wall.direction ===
                    "horizontal";

                  const isSelected =
                    window.id ===
                    selectedWindowId;

                  const position =
                    window.position * 35;

                  return (
                    <button
                      key={window.id}
                      onClick={() =>
                        selectWindow(
                          window.id
                        )
                      }
                      aria-label={
                        window.name
                      }
                      className={`absolute z-20 ${
                        isSelected
                          ? "bg-green-600"
                          : "bg-blue-500"
                      }`}
                      style={{
                        left: horizontal
                          ? wall.x + position
                          : wall.x,
                        top: horizontal
                          ? wall.y
                          : wall.y + position,
                        width: horizontal
                          ? window.width * 35
                          : 8,
                        height: horizontal
                          ? 8
                          : window.width * 35,
                      }}
                    >
                      <span className="sr-only">
                        {window.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* PROPERTIES */}
          <aside className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">
              Properties
            </h2>

            {selectedRoom && (
              <>
                <div className="mt-5">
                  <p className="text-xs text-gray-500">
                    ROOM
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedRoom.name}
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium">
                      Width (m)
                    </span>

                    <input
                      type="number"
                      min="2"
                      value={
                        selectedRoom.width
                      }
                      onChange={(e) =>
                        updateSelectedRoom(
                          "width",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">
                      Height (m)
                    </span>

                    <input
                      type="number"
                      min="2"
                      value={
                        selectedRoom.height
                      }
                      onChange={(e) =>
                        updateSelectedRoom(
                          "height",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </label>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium">
                    Move
                  </p>

                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <span />

                    <button
                      onClick={() =>
                        moveSelected(
                          0,
                          -20
                        )
                      }
                      className="rounded-lg border py-2"
                    >
                      ↑
                    </button>

                    <span />

                    <button
                      onClick={() =>
                        moveSelected(
                          -20,
                          0
                        )
                      }
                      className="rounded-lg border py-2"
                    >
                      ←
                    </button>

                    <button
                      onClick={() =>
                        moveSelected(
                          0,
                          20
                        )
                      }
                      className="rounded-lg border py-2"
                    >
                      ↓
                    </button>

                    <button
                      onClick={() =>
                        moveSelected(
                          20,
                          0
                        )
                      }
                      className="rounded-lg border py-2"
                    >
                      →
                    </button>
                  </div>
                </div>

                <button
                  onClick={() =>
                    removeRoom(
                      selectedRoom.id
                    )
                  }
                  className="mt-5 w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"
                >
                  Delete room
                </button>
              </>
            )}

            {selectedWall && (
              <>
                <div className="mt-5">
                  <p className="text-xs text-gray-500">
                    WALL
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedWall.name}
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium">
                      Length (m)
                    </span>

                    <input
                      type="number"
                      min="1"
                      value={
                        selectedWall.length
                      }
                      onChange={(e) =>
                        updateSelectedWall(
                          "length",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">
                      Thickness (m)
                    </span>

                    <input
                      type="number"
                      min="0.1"
                      step="0.05"
                      value={
                        selectedWall.thickness
                      }
                      onChange={(e) =>
                        updateSelectedWall(
                          "thickness",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </label>
                </div>

                <button
                  onClick={() =>
                    removeWall(
                      selectedWall.id
                    )
                  }
                  className="mt-5 w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"
                >
                  Delete wall
                </button>
              </>
            )}

            {selectedDoor && (
              <>
                <div className="mt-5">
                  <p className="text-xs text-gray-500">
                    DOOR
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedDoor.name}
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium">
                      Type
                    </span>

                    <select
                      value={
                        selectedDoor.type
                      }
                      onChange={(e) =>
                        updateSelectedDoor(
                          "type",
                          e.target.value
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    >
                      <option value="Interior">
                        Interior
                      </option>
                      <option value="Exterior">
                        Exterior
                      </option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">
                      Width (m)
                    </span>

                    <input
                      type="number"
                      min="0.6"
                      step="0.1"
                      value={
                        selectedDoor.width
                      }
                      onChange={(e) =>
                        updateSelectedDoor(
                          "width",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">
                      Swing
                    </span>

                    <select
                      value={
                        selectedDoor.swing
                      }
                      onChange={(e) =>
                        updateSelectedDoor(
                          "swing",
                          e.target.value
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    >
                      <option value="Left">
                        Left
                      </option>
                      <option value="Right">
                        Right
                      </option>
                    </select>
                  </label>
                </div>

                <button
                  onClick={() =>
                    removeDoor(
                      selectedDoor.id
                    )
                  }
                  className="mt-5 w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"
                >
                  Delete door
                </button>
              </>
            )}

            {selectedWindow && (
              <>
                <div className="mt-5">
                  <p className="text-xs text-gray-500">
                    WINDOW
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedWindow.name}
                  </p>
                </div>

                <div className="mt-5">
                  <label className="block">
                    <span className="text-sm font-medium">
                      Width (m)
                    </span>

                    <input
                      type="number"
                      min="0.4"
                      step="0.1"
                      value={
                        selectedWindow.width
                      }
                      onChange={(e) =>
                        updateSelectedWindow(
                          "width",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </label>
                </div>

                <button
                  onClick={() =>
                    removeWindow(
                      selectedWindow.id
                    )
                  }
                  className="mt-5 w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"
                >
                  Delete window
                </button>
              </>
            )}

            {!selectedRoom &&
              !selectedWall &&
              !selectedDoor &&
              !selectedWindow && (
                <p className="mt-5 text-sm text-gray-500">
                  Select an element on the
                  floor plan to edit it.
                </p>
              )}

            <div className="mt-7 border-t pt-5">
              <p className="text-sm text-gray-500">
                Floor area
              </p>

              <p className="mt-1 text-2xl font-bold">
                {totalArea.toFixed(1)} m²
              </p>

              <p className="mt-4 text-sm text-gray-500">
                Wall length
              </p>

              <p className="mt-1 text-2xl font-bold">
                {totalWallLength.toFixed(1)} m
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-gray-100 p-3">
                  <p className="text-lg font-bold">
                    {doors.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    Doors
                  </p>
                </div>

                <div className="rounded-lg bg-gray-100 p-3">
                  <p className="text-lg font-bold">
                    {windows.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    Windows
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}