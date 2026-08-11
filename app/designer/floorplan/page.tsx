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

type MaterialPrice = {
  cement: number;
  blocks: number;
  sand: number;
  ballast: number;
  steel: number;
  roofing: number;
  flooring: number;
  paint: number;
  door: number;
  window: number;
};

const roomTypes = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining Room",
  "Garage",
];

const defaultPrices: MaterialPrice = {
  cement: 750,
  blocks: 65,
  sand: 3500,
  ballast: 4500,
  steel: 180,
  roofing: 850,
  flooring: 1500,
  paint: 6500,
  door: 12000,
  window: 8500,
};

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

  const [prices, setPrices] =
    useState<MaterialPrice>(defaultPrices);

  const [wastePercent, setWastePercent] =
    useState(5);

  const [transportPercent, setTransportPercent] =
    useState(7);

  const [labourPercent, setLabourPercent] =
    useState(30);

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

    setRooms((current) => [
      ...current,
      newRoom,
    ]);

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

  function moveSelected(
    dx: number,
    dy: number
  ) {
    if (!selectedId) return;

    setRooms((current) =>
      current.map((room) =>
        room.id === selectedId
          ? {
              ...room,
              x: Math.max(
                0,
                Math.min(
                  600,
                  room.x + dx
                )
              ),
              y: Math.max(
                0,
                Math.min(
                  420,
                  room.y + dy
                )
              ),
            }
          : room
      )
    );
  }

  function addWall(
    direction:
      | "horizontal"
      | "vertical"
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

    setWalls((current) => [
      ...current,
      newWall,
    ]);

    selectWall(newWall.id);
  }

  function removeWall(id: number) {
    setWalls((current) =>
      current.filter(
        (wall) => wall.id !== id
      )
    );

    setDoors((current) =>
      current.filter(
        (door) => door.wallId !== id
      )
    );

    setWindows((current) =>
      current.filter(
        (window) =>
          window.wallId !== id
      )
    );

    if (selectedWallId === id) {
      clearSelection();
    }
  }

  function updateSelectedWall(
    property:
      | "length"
      | "thickness",
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
                  ? Math.max(
                      1,
                      value
                    )
                  : Math.max(
                      0.1,
                      value
                    ),
            }
          : wall
      )
    );
  }

  function addDoor(
    type:
      | "Interior"
      | "Exterior",
    wallId: number
  ) {
    const wall = walls.find(
      (item) =>
        item.id === wallId
    );

    if (!wall) return;

    const newDoor: Door = {
      id: Date.now(),
      name: `${type} Door`,
      width: 0.9,
      wallId,
      position: Math.min(
        Math.max(
          wall.length / 2,
          0.5
        ),
        Math.max(
          wall.length - 0.5,
          0.5
        )
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
      current.filter(
        (door) => door.id !== id
      )
    );

    if (selectedDoorId === id) {
      clearSelection();
    }
  }

  function updateSelectedDoor(
    property:
      | "width"
      | "swing"
      | "type",
    value: number | string
  ) {
    if (!selectedDoorId) return;

    setDoors((current) =>
      current.map((door) => {
        if (
          door.id !== selectedDoorId
        ) {
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
            swing:
              value as
                | "Left"
                | "Right",
          };
        }

        return {
          ...door,
          type:
            value as
              | "Interior"
              | "Exterior",
          name: `${value} Door`,
        };
      })
    );
  }

  function addWindow(
    wallId: number
  ) {
    const wall = walls.find(
      (item) =>
        item.id === wallId
    );

    if (!wall) return;

    const newWindow: Window = {
      id: Date.now(),
      name: "Window",
      width: 1.2,
      wallId,
      position: Math.min(
        Math.max(
          wall.length / 2,
          0.6
        ),
        Math.max(
          wall.length - 0.6,
          0.6
        )
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
        (window) =>
          window.id !== id
      )
    );

    if (
      selectedWindowId === id
    ) {
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
        window.id ===
        selectedWindowId
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

  function updatePrice(
    property: keyof MaterialPrice,
    value: number
  ) {
    setPrices((current) => ({
      ...current,
      [property]: Math.max(
        0,
        value
      ),
    }));
  }

  const totalArea = rooms.reduce(
    (total, room) =>
      total +
      room.width *
        room.height,
    0
  );

  const totalWallLength =
    walls.reduce(
      (total, wall) =>
        total +
        wall.length,
      0
    );

  /*
   * ============================
   * MILESTONE 4
   * BUILDING COST CALCULATOR
   * ============================
   */

  const wallArea =
    totalWallLength * 3;

  const floorArea =
    totalArea;

  const roofArea =
    floorArea * 1.15;

  const plasterArea =
    wallArea * 2;

  const cementQuantity =
    Math.max(
      1,
      Math.ceil(
        plasterArea * 0.18
      )
    );

  const blockQuantity =
    Math.max(
      1,
      Math.ceil(
        wallArea * 12.5
      )
    );

  const sandQuantity =
    Math.max(
      1,
      Math.ceil(
        plasterArea * 0.018
      )
    );

  const ballastQuantity =
    Math.max(
      1,
      Math.ceil(
        floorArea * 0.08
      )
    );

  const steelQuantity =
    Math.max(
      1,
      Math.ceil(
        floorArea * 4.5
      )
    );

  const roofingQuantity =
    Math.max(
      1,
      Math.ceil(
        roofArea
      )
    );

  const flooringQuantity =
    Math.max(
      1,
      Math.ceil(
        floorArea
      )
    );

  const paintQuantity =
    Math.max(
      1,
      Math.ceil(
        plasterArea / 35
      )
    );

  const cementCost =
    cementQuantity *
    prices.cement;

  const blockCost =
    blockQuantity *
    prices.blocks;

  const sandCost =
    sandQuantity *
    prices.sand;

  const ballastCost =
    ballastQuantity *
    prices.ballast;

  const steelCost =
    steelQuantity *
    prices.steel;

  const roofingCost =
    roofingQuantity *
    prices.roofing;

  const flooringCost =
    flooringQuantity *
    prices.flooring;

  const paintCost =
    paintQuantity *
    prices.paint;

  const doorCost =
    doors.length *
    prices.door;

  const windowCost =
    windows.length *
    prices.window;

  const rawMaterialCost =
    cementCost +
    blockCost +
    sandCost +
    ballastCost +
    steelCost +
    roofingCost +
    flooringCost +
    paintCost +
    doorCost +
    windowCost;

  const wasteCost =
    rawMaterialCost *
    (wastePercent / 100);

  const transportCost =
    rawMaterialCost *
    (transportPercent / 100);

  const labourCost =
    rawMaterialCost *
    (labourPercent / 100);

  const materialsSubtotal =
    rawMaterialCost +
    wasteCost;

  const grandTotal =
    materialsSubtotal +
    transportCost +
    labourCost;

  const costPerSquareMeter =
    totalArea > 0
      ? grandTotal /
        totalArea
      : 0;

  function money(value: number) {
    return `KSh ${value.toLocaleString(
      "en-KE",
      {
        maximumFractionDigits: 0,
      }
    )}`;
  }

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
            Design rooms, walls,
            doors and windows
            for your future home.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr_300px]">

          {/* LEFT PANEL */}

          <aside className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">
              Rooms
            </h2>

            <div className="mt-4 space-y-2">
              {roomTypes.map(
                (room) => (
                  <button
                    key={room}
                    onClick={() =>
                      addRoom(
                        room
                      )
                    }
                    className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50"
                  >
                    + {room}
                  </button>
                )
              )}
            </div>

            <div className="mt-7 border-t pt-5">
              <h2 className="font-semibold">
                Walls
              </h2>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() =>
                    addWall(
                      "horizontal"
                    )
                  }
                  className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50"
                >
                  + Horizontal wall
                </button>

                <button
                  onClick={() =>
                    addWall(
                      "vertical"
                    )
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
                  disabled={
                    walls.length ===
                    0
                  }
                  onClick={() => {
                    if (
                      walls[0]
                    ) {
                      addDoor(
                        "Interior",
                        walls[0]
                          .id
                      );
                    }
                  }}
                  className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  + Interior door
                </button>

                <button
                  disabled={
                    walls.length ===
                    0
                  }
                  onClick={() => {
                    if (
                      walls[0]
                    ) {
                      addDoor(
                        "Exterior",
                        walls[0]
                          .id
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
                disabled={
                  walls.length ===
                  0
                }
                onClick={() => {
                  if (
                    walls[0]
                  ) {
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
                  Select an element
                  to edit it.
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
                className="relative min-h-[500px] min-w-[700px] overflow-visible rounded-xl border-2 border-dashed border-gray-300"
                style={{
                  backgroundImage:
                    "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
                  backgroundSize:
                    "20px 20px",
                }}
              >

                {/* ROOMS */}

                {rooms.map(
                  (room) => {
                    const isSelected =
                      room.id ===
                      selectedId;

                    const roomWidth =
                      room.width *
                      35;

                    const roomHeight =
                      room.height *
                      30;

                    return (
                      <div
                        key={
                          room.id
                        }
                        className="absolute"
                        style={{
                          left:
                            room.x,
                          top:
                            room.y,
                          width:
                            roomWidth,
                          height:
                            roomHeight,
                        }}
                      >
                        <button
                          onClick={() =>
                            selectRoom(
                              room.id
                            )
                          }
                          className={`absolute inset-0 flex flex-col items-center justify-center rounded-lg border-2 text-center ${
                            isSelected
                              ? "border-green-600 bg-green-100 shadow-lg"
                              : "border-gray-500 bg-white"
                          }`}
                        >
                          <span className="text-sm font-semibold">
                            {
                              room.name
                            }
                          </span>

                          <span className="mt-1 text-xs text-gray-500">
                            {
                              room.width
                            }
                            m ×{" "}
                            {
                              room.height
                            }
                            m
                          </span>
                        </button>

                        <div
                          className="absolute left-0 flex items-center justify-center"
                          style={{
                            top:
                              roomHeight +
                              7,
                            width:
                              roomWidth,
                          }}
                        >
                          <div className="h-px w-full bg-gray-500" />

                          <span className="absolute bg-white px-1 text-[10px] font-medium text-gray-600">
                            {room.width.toFixed(
                              1
                            )}{" "}
                            m
                          </span>
                        </div>

                        <div
                          className="absolute top-0 flex items-center justify-center"
                          style={{
                            left:
                              roomWidth +
                              7,
                            height:
                              roomHeight,
                          }}
                        >
                          <div className="h-full w-px bg-gray-500" />

                          <span
                            className="absolute whitespace-nowrap bg-white px-1 text-[10px] font-medium text-gray-600"
                            style={{
                              transform:
                                "rotate(-90deg)",
                            }}
                          >
                            {room.height.toFixed(
                              1
                            )}{" "}
                            m
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}

                {/* WALLS */}

                {walls.map(
                  (wall) => {
                    const isSelected =
                      wall.id ===
                      selectedWallId;

                    const horizontal =
                      wall.direction ===
                      "horizontal";

                    return (
                      <div
                        key={
                          wall.id
                        }
                        className="absolute"
                        style={{
                          left:
                            wall.x,
                          top:
                            wall.y,
                          width:
                            horizontal
                              ? wall.length *
                                35
                              : 8,
                          height:
                            horizontal
                              ? 8
                              : wall.length *
                                35,
                        }}
                      >
                        <button
                          onClick={() =>
                            selectWall(
                              wall.id
                            )
                          }
                          className={`absolute z-10 rounded-sm ${
                            isSelected
                              ? "bg-green-600 shadow-lg"
                              : "bg-gray-800"
                          }`}
                          style={{
                            inset: 0,
                          }}
                        />

                        <div
                          className="absolute z-20 flex items-center justify-center"
                          style={
                            horizontal
                              ? {
                                  top: 14,
                                  left: 0,
                                  width:
                                    wall.length *
                                    35,
                                }
                              : {
                                  left: 14,
                                  top: 0,
                                  height:
                                    wall.length *
                                    35,
                                }
                          }
                        >
                          <div
                            className={
                              horizontal
                                ? "h-px w-full bg-gray-500"
                                : "h-full w-px bg-gray-500"
                            }
                          />

                          <span
                            className="absolute whitespace-nowrap bg-white px-1 text-[10px] font-medium text-gray-600"
                            style={
                              horizontal
                                ? undefined
                                : {
                                    transform:
                                      "rotate(-90deg)",
                                  }
                            }
                          >
                            {wall.length.toFixed(
                              1
                            )}{" "}
                            m
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}

                {/* DOORS */}

                {doors.map(
                  (door) => {
                    const wall =
                      walls.find(
                        (
                          item
                        ) =>
                          item.id ===
                          door.wallId
                      );

                    if (!wall)
                      return null;

                    const horizontal =
                      wall.direction ===
                      "horizontal";

                    const isSelected =
                      door.id ===
                      selectedDoorId;

                    const position =
                      door.position *
                      35;

                    return (
                      <div
                        key={
                          door.id
                        }
                        className="absolute z-30"
                        style={{
                          left:
                            horizontal
                              ? wall.x +
                                position
                              : wall.x,
                          top:
                            horizontal
                              ? wall.y
                              : wall.y +
                                position,
                        }}
                      >
                        <button
                          onClick={() =>
                            selectDoor(
                              door.id
                            )
                          }
                          className={
                            isSelected
                              ? "bg-green-600"
                              : "bg-amber-500"
                          }
                          style={{
                            width:
                              horizontal
                                ? door.width *
                                  35
                                : 10,
                            height:
                              horizontal
                                ? 10
                                : door.width *
                                  35,
                          }}
                        />

                        <span
                          className="absolute whitespace-nowrap rounded bg-white px-1 text-[10px] font-medium text-gray-700 shadow-sm"
                          style={
                            horizontal
                              ? {
                                  left:
                                    (door.width *
                                      35) /
                                    2,
                                  top: 13,
                                  transform:
                                    "translateX(-50%)",
                                }
                              : {
                                  left: 13,
                                  top:
                                    (door.width *
                                      35) /
                                    2,
                                  transform:
                                    "translateY(-50%) rotate(-90deg)",
                                }
                          }
                        >
                          {door.width.toFixed(
                            1
                          )}{" "}
                          m
                        </span>
                      </div>
                    );
                  }
                )}

                {/* WINDOWS */}

                {windows.map(
                  (window) => {
                    const wall =
                      walls.find(
                        (
                          item
                        ) =>
                          item.id ===
                          window.wallId
                      );

                    if (!wall)
                      return null;

                    const horizontal =
                      wall.direction ===
                      "horizontal";

                    const isSelected =
                      window.id ===
                      selectedWindowId;

                    const position =
                      window.position *
                      35;

                    return (
                      <div
                        key={
                          window.id
                        }
                        className="absolute z-20"
                        style={{
                          left:
                            horizontal
                              ? wall.x +
                                position
                              : wall.x,
                          top:
                            horizontal
                              ? wall.y
                              : wall.y +
                                position,
                        }}
                      >
                        <button
                          onClick={() =>
                            selectWindow(
                              window.id
                            )
                          }
                          aria-label={
                            window.name
                          }
                          className={
                            isSelected
                              ? "bg-green-600"
                              : "bg-blue-500"
                          }
                          style={{
                            width:
                              horizontal
                                ? window.width *
                                  35
                                : 8,
                            height:
                              horizontal
                                ? 8
                                : window.width *
                                  35,
                          }}
                        >
                          <span className="sr-only">
                            {
                              window.name
                            }
                          </span>
                        </button>

                        <span
                          className="absolute whitespace-nowrap rounded bg-white px-1 text-[10px] font-medium text-gray-700 shadow-sm"
                          style={
                            horizontal
                              ? {
                                  left:
                                    (window.width *
                                      35) /
                                    2,
                                  top: 11,
                                  transform:
                                    "translateX(-50%)",
                                }
                              : {
                                  left: 11,
                                  top:
                                    (window.width *
                                      35) /
                                    2,
                                  transform:
                                    "translateY(-50%) rotate(-90deg)",
                                }
                          }
                        >
                          {window.width.toFixed(
                            1
                          )}{" "}
                          m
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </section>

          {/* RIGHT PANEL */}

          <aside className="space-y-6">

            {/* PROPERTIES */}

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
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
                      {
                        selectedRoom.name
                      }
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
                      {
                        selectedWall.name
                      }
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
                      {
                        selectedDoor.name
                      }
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
                      {
                        selectedWindow.name
                      }
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
                    Select an element
                    on the floor plan
                    to edit it.
                  </p>
                )}
            </div>

            {/* MEASUREMENTS */}

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="font-semibold">
                Measurements
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-xs text-gray-500">
                    Floor area
                  </p>

                  <p className="mt-1 text-xl font-bold text-green-700">
                    {totalArea.toFixed(
                      1
                    )}{" "}
                    m²
                  </p>
                </div>

                <div className="rounded-xl bg-gray-100 p-4">
                  <p className="text-xs text-gray-500">
                    Wall length
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {totalWallLength.toFixed(
                      1
                    )}{" "}
                    m
                  </p>
                </div>

                <div className="rounded-xl bg-gray-100 p-4 text-center">
                  <p className="text-xl font-bold">
                    {doors.length}
                  </p>

                  <p className="text-xs text-gray-500">
                    Doors
                  </p>
                </div>

                <div className="rounded-xl bg-gray-100 p-4 text-center">
                  <p className="text-xl font-bold">
                    {windows.length}
                  </p>

                  <p className="text-xs text-gray-500">
                    Windows
                  </p>
                </div>
              </div>
            </div>

            {/* COST ESTIMATE */}

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                    Milestone 4
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Building cost
                    estimate
                  </h2>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  KSh
                </span>
              </div>

              {/* MATERIALS */}

              <div className="mt-6">
                <h3 className="font-semibold">
                  Materials
                </h3>

                <div className="mt-3 space-y-2 text-sm">

                  <div className="flex items-center justify-between">
                    <span>
                      Cement
                    </span>

                    <span className="font-medium">
                      {cementQuantity}{" "}
                      bags
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>
                      Blocks
                    </span>

                    <span className="font-medium">
                      {blockQuantity.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>
                      Sand
                    </span>

                    <span className="font-medium">
                      {sandQuantity}{" "}
                      m³
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>
                      Ballast
                    </span>

                    <span className="font-medium">
                      {ballastQuantity}{" "}
                      m³
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>
                      Steel
                    </span>

                    <span className="font-medium">
                      {steelQuantity}{" "}
                      kg
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>
                      Roofing
                    </span>

                    <span className="font-medium">
                      {roofingQuantity}{" "}
                      m²
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>
                      Flooring
                    </span>

                    <span className="font-medium">
                      {flooringQuantity}{" "}
                      m²
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>
                      Paint
                    </span>

                    <span className="font-medium">
                      {paintQuantity}{" "}
                      units
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>
                      Doors
                    </span>

                    <span className="font-medium">
                      {doors.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>
                      Windows
                    </span>

                    <span className="font-medium">
                      {windows.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* PRICES */}

              <div className="mt-6 border-t pt-5">
                <h3 className="font-semibold">
                  Material prices
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Edit these prices
                  to match current
                  supplier prices.
                </p>

                <div className="mt-4 space-y-3">

                  {(
                    [
                      [
                        "Cement",
                        "cement",
                      ],
                      [
                        "Block",
                        "blocks",
                      ],
                      [
                        "Sand / m³",
                        "sand",
                      ],
                      [
                        "Ballast / m³",
                        "ballast",
                      ],
                      [
                        "Steel / kg",
                        "steel",
                      ],
                      [
                        "Roofing / m²",
                        "roofing",
                      ],
                      [
                        "Flooring / m²",
                        "flooring",
                      ],
                      [
                        "Paint",
                        "paint",
                      ],
                      [
                        "Door",
                        "door",
                      ],
                      [
                        "Window",
                        "window",
                      ],
                    ] as [
                      string,
                      keyof MaterialPrice
                    ][]
                  ).map(
                    ([
                      label,
                      key,
                    ]) => (
                      <label
                        key={key}
                        className="block"
                      >
                        <span className="text-xs font-medium text-gray-600">
                          {label}
                        </span>

                        <div className="mt-1 flex">
                          <span className="flex items-center rounded-l-lg border border-r-0 bg-gray-100 px-2 text-xs">
                            KSh
                          </span>

                          <input
                            type="number"
                            min="0"
                            value={
                              prices[key]
                            }
                            onChange={(
                              e
                            ) =>
                              updatePrice(
                                key,
                                Number(
                                  e.target
                                    .value
                                )
                              )
                            }
                            className="w-full rounded-r-lg border px-3 py-2 text-sm"
                          />
                        </div>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* ALLOWANCES */}

              <div className="mt-6 border-t pt-5">
                <h3 className="font-semibold">
                  Allowances
                </h3>

                <div className="mt-4 space-y-3">

                  <label className="block">
                    <span className="text-xs font-medium text-gray-600">
                      Waste %
                    </span>

                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={
                        wastePercent
                      }
                      onChange={(e) =>
                        setWastePercent(
                          Math.max(
                            0,
                            Number(
                              e.target
                                .value
                            )
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-gray-600">
                      Transport %
                    </span>

                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={
                        transportPercent
                      }
                      onChange={(e) =>
                        setTransportPercent(
                          Math.max(
                            0,
                            Number(
                              e.target
                                .value
                            )
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-gray-600">
                      Labour %
                    </span>

                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={
                        labourPercent
                      }
                      onChange={(e) =>
                        setLabourPercent(
                          Math.max(
                            0,
                            Number(
                              e.target
                                .value
                            )
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </label>
                </div>
              </div>

              {/* BREAKDOWN */}

              <div className="mt-6 border-t pt-5">
                <h3 className="font-semibold">
                  Cost breakdown
                </h3>

                <div className="mt-4 space-y-3 text-sm">

                  <div className="flex justify-between">
                    <span>
                      Raw materials
                    </span>

                    <span className="font-medium">
                      {
                        money(
                          rawMaterialCost
                        )
                      }
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Waste
                    </span>

                    <span className="font-medium">
                      {
                        money(
                          wasteCost
                        )
                      }
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Transport
                    </span>

                    <span className="font-medium">
                      {
                        money(
                          transportCost
                        )
                      }
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Labour
                    </span>

                    <span className="font-medium">
                      {
                        money(
                          labourCost
                        )
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* TOTAL */}

              <div className="mt-6 rounded-2xl bg-green-600 p-5 text-white">
                <p className="text-sm text-green-100">
                  Estimated construction
                  cost
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {
                    money(
                      grandTotal
                    )
                  }
                </p>

                <div className="mt-4 border-t border-green-400 pt-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      Cost per m²
                    </span>

                    <span className="font-bold">
                      {
                        money(
                          costPerSquareMeter
                        )
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-amber-50 p-3">
                <p className="text-xs leading-5 text-amber-800">
                  This is a planning
                  estimate. Actual
                  construction costs
                  depend on location,
                  supplier prices,
                  design specifications,
                  transport distance,
                  labour rates and
                  site conditions.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}