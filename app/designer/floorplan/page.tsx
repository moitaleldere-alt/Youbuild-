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

const roomTypes = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining Room",
  "Garage",
];

export default function FloorPlanPage() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      name: "Living Room",
      width: 6,
      height: 5,
      x: 40,
      y: 40,
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

  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [selectedWallId, setSelectedWallId] = useState<number | null>(null);

  const selectedRoom = rooms.find((room) => room.id === selectedId);
  const selectedWall = walls.find((wall) => wall.id === selectedWallId);

  function addRoom(name: string) {
    const newRoom: Room = {
      id: Date.now(),
      name,
      width: 4,
      height: 4,
      x: 80 + rooms.length * 20,
      y: 80 + rooms.length * 20,
    };

    setRooms((current) => [...current, newRoom]);
    setSelectedId(newRoom.id);
    setSelectedWallId(null);
  }

  function removeRoom(id: number) {
    setRooms((current) => current.filter((room) => room.id !== id));

    if (selectedId === id) {
      setSelectedId(null);
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
              x: Math.max(0, Math.min(600, room.x + dx)),
              y: Math.max(0, Math.min(420, room.y + dy)),
            }
          : room
      )
    );
  }

  function addWall(direction: "horizontal" | "vertical") {
    const newWall: Wall = {
      id: Date.now(),
      name: "Interior Wall",
      length: 6,
      thickness: 0.2,
      x: 100 + walls.length * 15,
      y: 180 + walls.length * 15,
      direction,
    };

    setWalls((current) => [...current, newWall]);
    setSelectedWallId(newWall.id);
    setSelectedId(null);
  }

  function removeWall(id: number) {
    setWalls((current) => current.filter((wall) => wall.id !== id));

    if (selectedWallId === id) {
      setSelectedWallId(null);
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

  const totalArea = rooms.reduce(
    (total, room) => total + room.width * room.height,
    0
  );

  const totalWallLength = walls.reduce(
    (total, wall) => total + wall.length,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold">
            You<span className="text-green-600">Build</span>
          </a>

          <div className="text-sm text-gray-500">
            Floor Plan Designer
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Heading */}
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            Home Designer
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Build your floor plan
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Create rooms and walls now. Doors, windows and detailed
            measurements will connect to this system next.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr_260px]">
          {/* LEFT PANEL */}
          <aside className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Add rooms</h2>

            <div className="mt-4 space-y-2">
              {roomTypes.map((room) => (
                <button
                  key={room}
                  onClick={() => addRoom(room)}
                  className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition hover:border-green-600 hover:bg-green-50"
                >
                  + {room}
                </button>
              ))}
            </div>

            <div className="mt-7 border-t pt-5">
              <h2 className="font-semibold">Add walls</h2>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => addWall("horizontal")}
                  className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50"
                >
                  + Horizontal wall
                </button>

                <button
                  onClick={() => addWall("vertical")}
                  className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50"
                >
                  + Vertical wall
                </button>
              </div>
            </div>

            <div className="mt-7 border-t pt-5">
              <h2 className="font-semibold">Rooms</h2>

              <div className="mt-3 space-y-2">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedId(room.id);
                      setSelectedWallId(null);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                      selectedId === room.id
                        ? "bg-green-100 font-semibold text-green-800"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t pt-5">
              <h2 className="font-semibold">Walls</h2>

              <div className="mt-3 space-y-2">
                {walls.map((wall) => (
                  <button
                    key={wall.id}
                    onClick={() => {
                      setSelectedWallId(wall.id);
                      setSelectedId(null);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                      selectedWallId === wall.id
                        ? "bg-green-100 font-semibold text-green-800"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {wall.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* CANVAS */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="font-semibold">Floor plan canvas</h2>

                <p className="text-xs text-gray-500">
                  Select a room or wall to edit it
                </p>
              </div>

              <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium">
                {rooms.length} rooms · {walls.length} walls
              </div>
            </div>

            <div className="overflow-auto p-4">
              <div
                className="relative min-h-[500px] min-w-[700px] overflow-hidden rounded-xl border-2 border-dashed border-gray-300"
                style={{
                  backgroundImage:
                    "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >
                {/* Walls */}
                {walls.map((wall) => {
                  const isSelected = wall.id === selectedWallId;

                  const horizontal = wall.direction === "horizontal";

                  return (
                    <button
                      key={wall.id}
                      onClick={() => {
                        setSelectedWallId(wall.id);
                        setSelectedId(null);
                      }}
                      aria-label={wall.name}
                      className={`absolute rounded-sm transition ${
                        isSelected
                          ? "bg-green-600 shadow-lg"
                          : "bg-gray-800 hover:bg-green-600"
                      }`}
                      style={{
                        left: wall.x,
                        top: wall.y,
                        width: horizontal
                          ? wall.length * 35
                          : Math.max(8, wall.thickness * 25),
                        height: horizontal
                          ? Math.max(8, wall.thickness * 25)
                          : wall.length * 35,
                      }}
                    />
                  );
                })}

                {/* Rooms */}
                {rooms.map((room) => {
                  const isSelected = room.id === selectedId;

                  return (
                    <button
                      key={room.id}
                      onClick={() => {
                        setSelectedId(room.id);
                        setSelectedWallId(null);
                      }}
                      className={`absolute flex flex-col items-center justify-center rounded-lg border-2 text-center transition ${
                        isSelected
                          ? "border-green-600 bg-green-100 shadow-lg"
                          : "border-gray-500 bg-white hover:border-green-500"
                      }`}
                      style={{
                        left: room.x,
                        top: room.y,
                        width: room.width * 35,
                        height: room.height * 30,
                      }}
                    >
                      <span className="text-sm font-semibold">
                        {room.name}
                      </span>

                      <span className="mt-1 text-xs text-gray-500">
                        {room.width}m × {room.height}m
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* RIGHT PANEL */}
          <aside className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Properties</h2>

            {selectedRoom && (
              <>
                <div className="mt-5">
                  <p className="text-sm text-gray-500">
                    Selected room
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedRoom.name}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium">
                      Width (m)
                    </span>

                    <input
                      type="number"
                      min="2"
                      value={selectedRoom.width}
                      onChange={(e) =>
                        updateSelectedRoom(
                          "width",
                          Number(e.target.value)
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
                      value={selectedRoom.height}
                      onChange={(e) =>
                        updateSelectedRoom(
                          "height",
                          Number(e.target.value)
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </label>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium">Move room</p>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div />

                    <button
                      onClick={() => moveSelected(0, -20)}
                      className="rounded-lg border py-2 hover:bg-gray-50"
                    >
                      ↑
                    </button>

                    <div />

                    <button
                      onClick={() => moveSelected(-20, 0)}
                      className="rounded-lg border py-2 hover:bg-gray-50"
                    >
                      ←
                    </button>

                    <button
                      onClick={() => moveSelected(0, 20)}
                      className="rounded-lg border py-2 hover:bg-gray-50"
                    >
                      ↓
                    </button>

                    <button
                      onClick={() => moveSelected(20, 0)}
                      className="rounded-lg border py-2 hover:bg-gray-50"
                    >
                      →
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeRoom(selectedRoom.id)}
                  className="mt-6 w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  Delete room
                </button>
              </>
            )}

            {selectedWall && (
              <>
                <div className="mt-5">
                  <p className="text-sm text-gray-500">
                    Selected wall
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedWall.name}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium">
                      Length (m)
                    </span>

                    <input
                      type="number"
                      min="1"
                      value={selectedWall.length}
                      onChange={(e) =>
                        updateSelectedWall(
                          "length",
                          Number(e.target.value)
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
                      value={selectedWall.thickness}
                      onChange={(e) =>
                        updateSelectedWall(
                          "thickness",
                          Number(e.target.value)
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </label>
                </div>

                <button
                  onClick={() => removeWall(selectedWall.id)}
                  className="mt-6 w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  Delete wall
                </button>
              </>
            )}

            {!selectedRoom && !selectedWall && (
              <p className="mt-5 text-sm leading-6 text-gray-500">
                Select a room or wall to edit its properties.
              </p>
            )}

            {/* Statistics */}
            <div className="mt-8 border-t pt-6">
              <p className="text-sm text-gray-500">
                Total floor area
              </p>

              <p className="mt-1 text-3xl font-bold">
                {totalArea.toFixed(1)} m²
              </p>

              <p className="mt-5 text-sm text-gray-500">
                Total wall length
              </p>

              <p className="mt-1 text-2xl font-bold">
                {totalWallLength.toFixed(1)} m
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}