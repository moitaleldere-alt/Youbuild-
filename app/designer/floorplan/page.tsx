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

  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [selectedWallId, setSelectedWallId] =
    useState<number | null>(null);
  const [selectedDoorId, setSelectedDoorId] =
    useState<number | null>(null);
  const [selectedWindowId, setSelectedWindowId] =
    useState<number | null>(null);

  const [prices, setPrices] =
    useState<MaterialPrice>(defaultPrices);

  const [wastePercent, setWastePercent] = useState(5);
  const [transportPercent, setTransportPercent] = useState(7);
  const [labourPercent, setLabourPercent] = useState(30);

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
      current.filter((window) => window.wallId !== id)
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

    setDoors((current) => [...current, newDoor]);
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
            width: Math.max(0.6, Number(value)),
          };
        }

        if (property === "swing") {
          return {
            ...door,
            swing: value as "Left" | "Right",
          };
        }

        return {
          ...door,
          type: value as "Interior" | "Exterior",
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
    value: number
  ) {
    if (!selectedWindowId) return;

    setWindows((current) =>
      current.map((window) =>
        window.id === selectedWindowId
          ? {
              ...window,
              width: Math.max(0.4, value),
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
      [property]: Math.max(0, value),
    }));
  }

  /*
   * ==========================
   * MEASUREMENTS
   * ==========================
   */

  const totalArea = rooms.reduce(
    (total, room) =>
      total + room.width * room.height,
    0
  );

  const totalWallLength = walls.reduce(
    (total, wall) => total + wall.length,
    0
  );

  /*
   * ==========================
   * MILESTONE 4
   * BUILDING COST ESTIMATE
   * ==========================
   */

  const wallArea = totalWallLength * 3;
  const floorArea = totalArea;
  const roofArea = floorArea * 1.15;
  const plasterArea = wallArea * 2;

  const cementQuantity = Math.max(
    1,
    Math.ceil(plasterArea * 0.18)
  );

  const blockQuantity = Math.max(
    1,
    Math.ceil(wallArea * 12.5)
  );

  const sandQuantity = Math.max(
    1,
    Math.ceil(plasterArea * 0.018)
  );

  const ballastQuantity = Math.max(
    1,
    Math.ceil(floorArea * 0.08)
  );

  const steelQuantity = Math.max(
    1,
    Math.ceil(floorArea * 4.5)
  );

  const roofingQuantity = Math.max(
    1,
    Math.ceil(roofArea)
  );

  const flooringQuantity = Math.max(
    1,
    Math.ceil(floorArea)
  );

  const paintQuantity = Math.max(
    1,
    Math.ceil(plasterArea / 35)
  );

  const cementCost =
    cementQuantity * prices.cement;

  const blockCost =
    blockQuantity * prices.blocks;

  const sandCost =
    sandQuantity * prices.sand;

  const ballastCost =
    ballastQuantity * prices.ballast;

  const steelCost =
    steelQuantity * prices.steel;

  const roofingCost =
    roofingQuantity * prices.roofing;

  const flooringCost =
    flooringQuantity * prices.flooring;

  const paintCost =
    paintQuantity * prices.paint;

  const doorCost =
    doors.length * prices.door;

  const windowCost =
    windows.length * prices.window;

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
    rawMaterialCost + wasteCost;

  const grandTotal =
    materialsSubtotal +
    transportCost +
    labourCost;

  const costPerSquareMeter =
    totalArea > 0
      ? grandTotal / totalArea
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 text-slate-900">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-green-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

          <a
            href="/"
            className="flex items-center gap-1 text-2xl font-black tracking-tight"
          >
            You
            <span className="text-green-600">
              Build
            </span>
          </a>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              MILESTONE 4
            </span>

            <span className="text-sm font-medium text-slate-500">
              Floor Plan Designer
            </span>
          </div>

        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">

        {/* HERO */}

        <div className="mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 p-6 text-white shadow-xl sm:p-8">

          <div className="max-w-3xl">

            <div className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
              YouBuild Home Designer
            </div>

            <h1 className="text-3xl font-black sm:text-4xl">
              Design your home.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-green-50 sm:text-base">
              Build your floor plan, add rooms,
              walls, doors and windows, then get
              a planning estimate for the construction.
            </p>

          </div>

        </div>

        <div className="grid gap-6 lg:grid-cols-[250px_1fr_330px]">

          {/* LEFT TOOLBOX */}

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">

            <div className="mb-5">
              <div className="mb-1 flex items-center gap-2">
                <div className="rounded-lg bg-green-100 p-2 text-green-700">
                  🏠
                </div>

                <h2 className="font-black">
                  Build tools
                </h2>
              </div>

              <p className="text-xs text-slate-500">
                Add components to your floor plan.
              </p>
            </div>

            {/* ROOMS */}

            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wider text-green-700">
                Rooms
              </p>

              <div className="space-y-2">
                {roomTypes.map((room) => (
                  <button
                    key={room}
                    onClick={() =>
                      addRoom(room)
                    }
                    className="group w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm font-semibold transition hover:border-green-400 hover:bg-green-50"
                  >
                    <span className="mr-2 text-green-600">
                      +
                    </span>

                    {room}
                  </button>
                ))}
              </div>
            </div>

            {/* WALLS */}

            <div className="mt-7 border-t border-slate-100 pt-6">

              <p className="mb-2 text-xs font-black uppercase tracking-wider text-blue-700">
                Walls
              </p>

              <div className="space-y-2">

                <button
                  onClick={() =>
                    addWall("horizontal")
                  }
                  className="w-full rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-left text-sm font-semibold text-blue-800 transition hover:bg-blue-100"
                >
                  <span className="mr-2">
                    ↔
                  </span>
                  Horizontal wall
                </button>

                <button
                  onClick={() =>
                    addWall("vertical")
                  }
                  className="w-full rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-left text-sm font-semibold text-blue-800 transition hover:bg-blue-100"
                >
                  <span className="mr-2">
                    ↕
                  </span>
                  Vertical wall
                </button>

              </div>
            </div>

            {/* DOORS */}

            <div className="mt-7 border-t border-slate-100 pt-6">

              <p className="mb-2 text-xs font-black uppercase tracking-wider text-amber-700">
                Doors
              </p>

              <div className="space-y-2">

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
                  className="w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-left text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-40"
                >
                  🚪 Interior door
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
                  className="w-full rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-left text-sm font-semibold text-orange-800 hover:bg-orange-100 disabled:opacity-40"
                >
                  🚪 Exterior door
                </button>

              </div>
            </div>

            {/* WINDOWS */}

            <div className="mt-7 border-t border-slate-100 pt-6">

              <p className="mb-2 text-xs font-black uppercase tracking-wider text-sky-700">
                Windows
              </p>

              <button
                disabled={walls.length === 0}
                onClick={() => {
                  if (walls[0]) {
                    addWindow(walls[0].id);
                  }
                }}
                className="w-full rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-left text-sm font-semibold text-sky-800 hover:bg-sky-100 disabled:opacity-40"
              >
                🪟 Add window
              </button>

            </div>

          </aside>

          {/* CANVAS */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-green-50 px-5 py-4">

              <div>
                <h2 className="font-black text-slate-900">
                  Floor plan canvas
                </h2>

                <p className="text-xs text-slate-500">
                  Select an element to edit it.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-bold">

                <span className="rounded-full bg-green-100 px-3 py-1.5 text-green-700">
                  {rooms.length} rooms
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1.5 text-blue-700">
                  {walls.length} walls
                </span>

                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-700">
                  {doors.length} doors
                </span>

                <span className="rounded-full bg-sky-100 px-3 py-1.5 text-sky-700">
                  {windows.length} windows
                </span>

              </div>

            </div>

            <div className="overflow-auto p-4">

              <div
                className="relative min-h-[520px] min-w-[700px] overflow-visible rounded-2xl border-2 border-dashed border-green-200 bg-green-50/30"
                style={{
                  backgroundImage:
                    "linear-gradient(#d1fae5 1px, transparent 1px), linear-gradient(90deg, #d1fae5 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >

                {/* ROOMS */}

                {rooms.map((room) => {
                  const isSelected =
                    room.id === selectedId;

                  const roomWidth =
                    room.width * 35;

                  const roomHeight =
                    room.height * 30;

                  return (
                    <div
                      key={room.id}
                      className="absolute"
                      style={{
                        left: room.x,
                        top: room.y,
                        width: roomWidth,
                        height: roomHeight,
                      }}
                    >

                      <button
                        onClick={() =>
                          selectRoom(room.id)
                        }
                        className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 text-center transition ${
                          isSelected
                            ? "border-green-600 bg-green-200 shadow-xl"
                            : "border-green-500 bg-green-50 shadow-md"
                        }`}
                      >

                        <span className="text-sm font-black text-green-900">
                          {room.name}
                        </span>

                        <span className="mt-1 rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold text-green-700">
                          {room.width}m ×{" "}
                          {room.height}m
                        </span>

                      </button>

                      <div
                        className="absolute left-0 flex items-center justify-center"
                        style={{
                          top:
                            roomHeight + 7,
                          width: roomWidth,
                        }}
                      >
                        <div className="h-px w-full bg-green-600" />

                        <span className="absolute rounded bg-white px-1 text-[10px] font-bold text-green-700 shadow">
                          {room.width.toFixed(1)}m
                        </span>
                      </div>

                      <div
                        className="absolute top-0 flex items-center justify-center"
                        style={{
                          left:
                            roomWidth + 7,
                          height: roomHeight,
                        }}
                      >
                        <div className="h-full w-px bg-green-600" />

                        <span
                          className="absolute whitespace-nowrap rounded bg-white px-1 text-[10px] font-bold text-green-700 shadow"
                          style={{
                            transform:
                              "rotate(-90deg)",
                          }}
                        >
                          {room.height.toFixed(1)}m
                        </span>
                      </div>

                    </div>
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
                    <div
                      key={wall.id}
                      className="absolute"
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
                    >

                      <button
                        onClick={() =>
                          selectWall(wall.id)
                        }
                        className={`absolute inset-0 z-10 rounded-sm ${
                          isSelected
                            ? "bg-blue-500 shadow-lg"
                            : "bg-slate-800"
                        }`}
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
                              ? "h-px w-full bg-blue-500"
                              : "h-full w-px bg-blue-500"
                          }
                        />

                        <span
                          className="absolute whitespace-nowrap rounded bg-white px-1 text-[10px] font-bold text-blue-700 shadow"
                          style={
                            horizontal
                              ? undefined
                              : {
                                  transform:
                                    "rotate(-90deg)",
                                }
                          }
                        >
                          {wall.length.toFixed(1)}m
                        </span>
                      </div>

                    </div>
                  );
                })}

                {/* DOORS */}

                {doors.map((door) => {
                  const wall =
                    walls.find(
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
                    <div
                      key={door.id}
                      className="absolute z-30"
                      style={{
                        left: horizontal
                          ? wall.x +
                            position
                          : wall.x,
                        top: horizontal
                          ? wall.y
                          : wall.y +
                            position,
                      }}
                    >

                      <button
                        onClick={() =>
                          selectDoor(door.id)
                        }
                        className={`rounded-sm border-2 border-white shadow ${
                          isSelected
                            ? "bg-red-500"
                            : "bg-amber-500"
                        }`}
                        style={{
                          width: horizontal
                            ? door.width *
                              35
                            : 12,
                          height: horizontal
                            ? 12
                            : door.width *
                              35,
                        }}
                      />

                      <span
                        className="absolute whitespace-nowrap rounded bg-white px-1 text-[10px] font-bold text-amber-700 shadow"
                        style={
                          horizontal
                            ? {
                                left:
                                  (door.width *
                                    35) /
                                  2,
                                top: 15,
                                transform:
                                  "translateX(-50%)",
                              }
                            : {
                                left: 15,
                                top:
                                  (door.width *
                                    35) /
                                  2,
                                transform:
                                  "translateY(-50%) rotate(-90deg)",
                              }
                        }
                      >
                        {door.width.toFixed(1)}m
                      </span>

                    </div>
                  );
                })}

                {/* WINDOWS */}

                {windows.map((window) => {
                  const wall =
                    walls.find(
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
                    <div
                      key={window.id}
                      className="absolute z-20"
                      style={{
                        left: horizontal
                          ? wall.x +
                            position
                          : wall.x,
                        top: horizontal
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
                        className={`rounded-sm border-2 border-white shadow ${
                          isSelected
                            ? "bg-green-500"
                            : "bg-sky-500"
                        }`}
                        style={{
                          width: horizontal
                            ? window.width *
                              35
                            : 10,
                          height: horizontal
                            ? 10
                            : window.width *
                              35,
                        }}
                      />

                      <span
                        className="absolute whitespace-nowrap rounded bg-white px-1 text-[10px] font-bold text-sky-700 shadow"
                        style={
                          horizontal
                            ? {
                                left:
                                  (window.width *
                                    35) /
                                  2,
                                top: 13,
                                transform:
                                  "translateX(-50%)",
                              }
                            : {
                                left: 13,
                                top:
                                  (window.width *
                                    35) /
                                  2,
                                transform:
                                  "translateY(-50%) rotate(-90deg)",
                              }
                        }
                      >
                        {window.width.toFixed(1)}m
                      </span>

                    </div>
                  );
                })}

              </div>
            </div>
          </section>

          {/* RIGHT PANEL */}

          <aside className="space-y-6">

            {/* PROPERTIES */}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-purple-100 p-2 text-purple-700">
                  ⚙️
                </div>

                <div>
                  <h2 className="font-black">
                    Properties
                  </h2>

                  <p className="text-xs text-slate-500">
                    Edit the selected item.
                  </p>
                </div>

              </div>

              {selectedRoom && (
                <>
                  <div className="mt-5 rounded-xl bg-green-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-green-600">
                      ROOM
                    </p>

                    <p className="mt-1 font-black text-green-900">
                      {selectedRoom.name}
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">

                    <label className="block">
                      <span className="text-sm font-bold">
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
                        className="mt-1 w-full rounded-xl border border-green-200 bg-green-50/50 px-3 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-bold">
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
                        className="mt-1 w-full rounded-xl border border-green-200 bg-green-50/50 px-3 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      />
                    </label>

                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-bold">
                      Move room
                    </p>

                    <div className="grid grid-cols-3 gap-2">

                      <span />

                      <button
                        onClick={() =>
                          moveSelected(
                            0,
                            -20
                          )
                        }
                        className="rounded-xl bg-slate-100 py-2 font-bold hover:bg-green-100"
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
                        className="rounded-xl bg-slate-100 py-2 font-bold hover:bg-green-100"
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
                        className="rounded-xl bg-slate-100 py-2 font-bold hover:bg-green-100"
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
                        className="rounded-xl bg-slate-100 py-2 font-bold hover:bg-green-100"
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
                    className="mt-5 w-full rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100"
                  >
                    Delete room
                  </button>
                </>
              )}

              {selectedWall && (
                <>
                  <div className="mt-5 rounded-xl bg-blue-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                      WALL
                    </p>

                    <p className="mt-1 font-black text-blue-900">
                      {selectedWall.name}
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">

                    <label className="block">
                      <span className="text-sm font-bold">
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
                        className="mt-1 w-full rounded-xl border border-blue-200 bg-blue-50/50 px-3 py-2.5"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-bold">
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
                        className="mt-1 w-full rounded-xl border border-blue-200 bg-blue-50/50 px-3 py-2.5"
                      />
                    </label>

                  </div>

                  <button
                    onClick={() =>
                      removeWall(
                        selectedWall.id
                      )
                    }
                    className="mt-5 w-full rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600"
                  >
                    Delete wall
                  </button>
                </>
              )}

              {selectedDoor && (
                <>
                  <div className="mt-5 rounded-xl bg-amber-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                      DOOR
                    </p>

                    <p className="mt-1 font-black text-amber-900">
                      {selectedDoor.name}
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">

                    <label className="block">
                      <span className="text-sm font-bold">
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
                        className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50/50 px-3 py-2.5"
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
                      <span className="text-sm font-bold">
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
                        className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50/50 px-3 py-2.5"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-bold">
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
                        className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50/50 px-3 py-2.5"
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
                    className="mt-5 w-full rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600"
                  >
                    Delete door
                  </button>
                </>
              )}

              {selectedWindow && (
                <>
                  <div className="mt-5 rounded-xl bg-sky-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-sky-600">
                      WINDOW
                    </p>

                    <p className="mt-1 font-black text-sky-900">
                      {selectedWindow.name}
                    </p>
                  </div>

                  <label className="mt-5 block">
                    <span className="text-sm font-bold">
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
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-3 py-2.5"
                    />
                  </label>

                  <button
                    onClick={() =>
                      removeWindow(
                        selectedWindow.id
                      )
                    }
                    className="mt-5 w-full rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600"
                  >
                    Delete window
                  </button>
                </>
              )}

              {!selectedRoom &&
                !selectedWall &&
                !selectedDoor &&
                !selectedWindow && (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-center">
                    <div className="text-3xl">
                      👆
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-600">
                      Select something on the
                      floor plan to edit it.
                    </p>
                  </div>
                )}

            </div>

            {/* MEASUREMENTS */}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-green-100 p-2">
                  📐
                </div>

                <h2 className="font-black">
                  Measurements
                </h2>

              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 p-4">
                  <p className="text-xs font-semibold text-green-700">
                    Floor area
                  </p>

                  <p className="mt-1 text-xl font-black text-green-800">
                    {totalArea.toFixed(1)} m²
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                  <p className="text-xs font-semibold text-blue-700">
                    Wall length
                  </p>

                  <p className="mt-1 text-xl font-black text-blue-800">
                    {totalWallLength.toFixed(1)} m
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4 text-center">
                  <p className="text-xl font-black text-amber-700">
                    {doors.length}
                  </p>

                  <p className="text-xs font-semibold text-amber-700">
                    Doors
                  </p>
                </div>

                <div className="rounded-2xl bg-sky-50 p-4 text-center">
                  <p className="text-xl font-black text-sky-700">
                    {windows.length}
                  </p>

                  <p className="text-xs font-semibold text-sky-700">
                    Windows
                  </p>
                </div>

              </div>
            </div>

            {/* COST CALCULATOR */}

            <div className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-xl">

              <div className="bg-gradient-to-r from-green-700 to-emerald-600 p-5 text-white">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-green-100">
                      Milestone 4
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      Building Cost
                    </h2>

                    <p className="text-sm text-green-100">
                      Planning estimate
                    </p>
                  </div>

                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">
                    KSh
                  </span>

                </div>

              </div>

              <div className="p-5">

                {/* MATERIALS */}

                <div>
                  <h3 className="font-black">
                    Material quantities
                  </h3>

                  <div className="mt-3 space-y-2">

                    {[
                      [
                        "Cement",
                        `${cementQuantity} bags`,
                        "bg-gray-50",
                      ],
                      [
                        "Blocks",
                        blockQuantity.toLocaleString(),
                        "bg-green-50",
                      ],
                      [
                        "Sand",
                        `${sandQuantity} m³`,
                        "bg-amber-50",
                      ],
                      [
                        "Ballast",
                        `${ballastQuantity} m³`,
                        "bg-orange-50",
                      ],
                      [
                        "Steel",
                        `${steelQuantity} kg`,
                        "bg-blue-50",
                      ],
                      [
                        "Roofing",
                        `${roofingQuantity} m²`,
                        "bg-purple-50",
                      ],
                      [
                        "Flooring",
                        `${flooringQuantity} m²`,
                        "bg-pink-50",
                      ],
                      [
                        "Paint",
                        `${paintQuantity} units`,
                        "bg-sky-50",
                      ],
                      [
                        "Doors",
                        `${doors.length}`,
                        "bg-yellow-50",
                      ],
                      [
                        "Windows",
                        `${windows.length}`,
                        "bg-cyan-50",
                      ],
                    ].map(
                      ([name, quantity, bg]) => (
                        <div
                          key={name}
                          className={`flex items-center justify-between rounded-xl ${bg} px-3 py-2.5 text-sm`}
                        >
                          <span className="font-semibold">
                            {name}
                          </span>

                          <span className="font-black">
                            {quantity}
                          </span>
                        </div>
                      )
                    )}

                  </div>
                </div>

                {/* PRICES */}

                <div className="mt-7 border-t border-slate-100 pt-6">

                  <h3 className="font-black">
                    Material prices
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Adjust these to current supplier
                    prices.
                  </p>

                  <div className="mt-4 space-y-3">

                    {(
                      [
                        ["Cement", "cement"],
                        ["Block", "blocks"],
                        ["Sand / m³", "sand"],
                        ["Ballast / m³", "ballast"],
                        ["Steel / kg", "steel"],
                        ["Roofing / m²", "roofing"],
                        ["Flooring / m²", "flooring"],
                        ["Paint", "paint"],
                        ["Door", "door"],
                        ["Window", "window"],
                      ] as [
                        string,
                        keyof MaterialPrice
                      ][]
                    ).map(
                      ([label, key]) => (
                        <label
                          key={key}
                          className="block"
                        >
                          <span className="text-xs font-bold text-slate-600">
                            {label}
                          </span>

                          <div className="mt-1 flex">

                            <span className="flex items-center rounded-l-xl border border-r-0 border-green-200 bg-green-50 px-3 text-xs font-black text-green-700">
                              KSh
                            </span>

                            <input
                              type="number"
                              min="0"
                              value={
                                prices[key]
                              }
                              onChange={(e) =>
                                updatePrice(
                                  key,
                                  Number(
                                    e.target
                                      .value
                                  )
                                )
                              }
                              className="w-full rounded-r-xl border border-green-200 px-3 py-2 text-sm outline-none focus:border-green-500"
                            />

                          </div>
                        </label>
                      )
                    )}

                  </div>
                </div>

                {/* ALLOWANCES */}

                <div className="mt-7 border-t border-slate-100 pt-6">

                  <h3 className="font-black">
                    Project allowances
                  </h3>

                  <div className="mt-4 space-y-3">

                    <label className="block">
                      <span className="text-xs font-bold text-slate-600">
                        Waste %
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={wastePercent}
                        onChange={(e) =>
                          setWastePercent(
                            Math.max(
                              0,
                              Number(
                                e.target.value
                              )
                            )
                          )
                        }
                        className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-slate-600">
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
                                e.target.value
                              )
                            )
                          )
                        }
                        className="mt-1 w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-slate-600">
                        Labour %
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={labourPercent}
                        onChange={(e) =>
                          setLabourPercent(
                            Math.max(
                              0,
                              Number(
                                e.target.value
                              )
                            )
                          )
                        }
                        className="mt-1 w-full rounded-xl border border-purple-200 bg-purple-50 px-3 py-2.5"
                      />
                    </label>

                  </div>
                </div>

                {/* BREAKDOWN */}

                <div className="mt-7 border-t border-slate-100 pt-6">

                  <h3 className="font-black">
                    Cost breakdown
                  </h3>

                  <div className="mt-4 space-y-2">

                    <div className="flex justify-between rounded-xl bg-slate-50 px-3 py-3 text-sm">
                      <span>
                        Raw materials
                      </span>

                      <span className="font-black">
                        {money(
                          rawMaterialCost
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between rounded-xl bg-amber-50 px-3 py-3 text-sm">
                      <span>
                        Waste
                      </span>

                      <span className="font-black text-amber-700">
                        {money(wasteCost)}
                      </span>
                    </div>

                    <div className="flex justify-between rounded-xl bg-blue-50 px-3 py-3 text-sm">
                      <span>
                        Transport
                      </span>

                      <span className="font-black text-blue-700">
                        {money(
                          transportCost
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between rounded-xl bg-purple-50 px-3 py-3 text-sm">
                      <span>
                        Labour
                      </span>

                      <span className="font-black text-purple-700">
                        {money(
                          labourCost
                        )}
                      </span>
                    </div>

                  </div>
                </div>

                {/* TOTAL */}

                <div className="mt-7 overflow-hidden rounded-2xl bg-gradient-to-br from-green-700 via-emerald-600 to-teal-600 p-5 text-white shadow-lg">

                  <p className="text-sm font-semibold text-green-100">
                    Estimated construction cost
                  </p>

                  <p className="mt-1 text-3xl font-black sm:text-4xl">
                    {money(grandTotal)}
                  </p>

                  <div className="mt-5 border-t border-white/20 pt-4">

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-green-100">
                        Cost per m²
                      </span>

                      <span className="font-black">
                        {money(
                          costPerSquareMeter
                        )}
                      </span>

                    </div>

                  </div>

                </div>

                {/* DISCLAIMER */}

                <div className="mt-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4">

                  <div className="flex gap-3">

                    <span className="text-xl">
                      ⚠️
                    </span>

                    <p className="text-xs leading-5 text-amber-900">
                      This is a planning estimate,
                      not a professional bill of
                      quantities. Actual costs vary
                      according to location, supplier
                      prices, design specifications,
                      transport distance, labour rates
                      and site conditions.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-green-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">

          <p className="text-lg font-black">
            You
            <span className="text-green-600">
              Build
            </span>
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Design smarter. Build better.
          </p>

        </div>
      </footer>

    </main>
  );
}