"use client";

import { useState } from "react";

type Room = {
  id: number;
  name: string;
  width: number;
  height: number;
};

const roomTypes = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Garage"];

export default function FloorPlanPage() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      name: "Living Room",
      width: 6,
      height: 5,
    },
  ]);

  function addRoom(name: string) {
    const newRoom: Room = {
      id: Date.now(),
      name,
      width: 4,
      height: 4,
    };

    setRooms([...rooms, newRoom]);
  }

  function removeRoom(id: number) {
    setRooms(rooms.filter((room) => room.id !== id));
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold">
            You<span className="text-green-600">Build</span>
          </a>

          <span className="text-sm text-gray-500">Floor Plan Designer</span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold">Design your floor plan</h1>

        <p className="mt-2 text-gray-600">
          Add rooms to create the basic layout of your home.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Room controls */}
          <aside className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Add a room</h2>

            <div className="mt-4 space-y-2">
              {roomTypes.map((room) => (
                <button
                  key={room}
                  onClick={() => addRoom(room)}
                  className="w-full rounded-xl border px-4 py-3 text-left font-medium hover:border-green-600 hover:bg-green-50"
                >
                  + {room}
                </button>
              ))}
            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="font-semibold">Your rooms</h2>

              <div className="mt-3 space-y-2">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                  >
                    <span>{room.name}</span>

                    <button
                      onClick={() => removeRoom(room.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Floor plan */}
          <section className="min-h-[600px] rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Floor plan</h2>
                <p className="text-sm text-gray-500">
                  Basic concept layout
                </p>
              </div>

              <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm">
                {rooms.length} room{rooms.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex min-h-[500px] flex-wrap items-start gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex h-32 w-40 flex-col justify-between rounded-lg border-2 border-green-600 bg-green-50 p-3 shadow-sm"
                >
                  <div>
                    <p className="font-semibold">{room.name}</p>

                    <p className="mt-1 text-xs text-gray-500">
                      {room.width}m × {room.height}m
                    </p>
                  </div>

                  <span className="text-xs text-green-700">
                    Room #{room.id}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}