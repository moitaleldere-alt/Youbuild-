"use client";

import { useMemo, useState } from "react";

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

type BOQItem = {
  id: number;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  estimatedCost: number;
  actualCost: number;
};

type ChangeOrder = {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
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

const stageDefinitions = [
  {
    name: "Foundation",
    percentage: 15,
    duration: 3,
    icon: "🧱",
  },
  {
    name: "Walls",
    percentage: 20,
    duration: 5,
    icon: "🏗️",
  },
  {
    name: "Roofing",
    percentage: 15,
    duration: 4,
    icon: "🏠",
  },
  {
    name: "Doors & Windows",
    percentage: 10,
    duration: 2,
    icon: "🚪",
  },
  {
    name: "Flooring",
    percentage: 10,
    duration: 3,
    icon: "▦",
  },
  {
    name: "Electrical",
    percentage: 10,
    duration: 3,
    icon: "⚡",
  },
  {
    name: "Plumbing",
    percentage: 8,
    duration: 3,
    icon: "🚿",
  },
  {
    name: "Finishing",
    percentage: 12,
    duration: 5,
    icon: "🎨",
  },
];

const boqCategories = [
  "Foundation",
  "Walls",
  "Roofing",
  "Doors & Windows",
  "Flooring",
  "Electrical",
  "Plumbing",
  "Finishing",
  "Other",
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

  const [prices, setPrices] =
    useState<MaterialPrice>(defaultPrices);

  const [wastePercent, setWastePercent] =
    useState(5);

  const [transportPercent, setTransportPercent] =
    useState(7);

  const [labourPercent, setLabourPercent] =
    useState(30);

  /* =========================
     MILESTONE 6 SETTINGS
  ========================= */

  const [budget, setBudget] =
    useState(5000000);

  const [contingencyPercent, setContingencyPercent] =
    useState(10);

  const [selectedScenario, setSelectedScenario] =
    useState<"current" | "economy" | "premium">(
      "current"
    );

  /* =========================
     MILESTONE 7
     BOQ & COST CONTROL
  ========================= */

  const [boqItems, setBoqItems] =
    useState<BOQItem[]>([]);

  const [changeOrders, setChangeOrders] =
    useState<ChangeOrder[]>([]);

  const [newBOQCategory, setNewBOQCategory] =
    useState("Other");

  const [newBOQDescription, setNewBOQDescription] =
    useState("");

  const [newBOQQuantity, setNewBOQQuantity] =
    useState(1);

  const [newBOQUnit, setNewBOQUnit] =
    useState("item");

  const [newBOQUnitPrice, setNewBOQUnitPrice] =
    useState(0);

  const [newActualCost, setNewActualCost] =
    useState(0);

  const [newChangeTitle, setNewChangeTitle] =
    useState("");

  const [newChangeDescription, setNewChangeDescription] =
    useState("");

  const [newChangeAmount, setNewChangeAmount] =
    useState(0);

  const [boqView, setBoqView] =
    useState<"summary" | "items" | "changes">(
      "summary"
    );

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
      current.filter(
        (room) => room.id !== id
      )
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
      (item) => item.id === wallId
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
      (item) => item.id === wallId
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

  /* =========================
     CORE MEASUREMENTS
  ========================= */

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
        total + wall.length,
      0
    );

  /* =========================
     MILESTONE 4
  ========================= */

  const wallArea =
    totalWallLength * 3;

  const floorArea = totalArea;

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
      Math.ceil(roofArea)
    );

  const flooringQuantity =
    Math.max(
      1,
      Math.ceil(floorArea)
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

  /* =========================
     MILESTONE 5
  ========================= */

  const costPerSquareMeter =
    totalArea > 0
      ? grandTotal /
        totalArea
      : 0;

  const materialShare =
    grandTotal > 0
      ? (rawMaterialCost /
          grandTotal) *
        100
      : 0;

  const labourShare =
    grandTotal > 0
      ? (labourCost /
          grandTotal) *
        100
      : 0;

  const transportShare =
    grandTotal > 0
      ? (transportCost /
          grandTotal) *
        100
      : 0;

  const wasteShare =
    grandTotal > 0
      ? (wasteCost /
          grandTotal) *
        100
      : 0;

  /* =========================
     MILESTONE 6
  ========================= */

  const contingencyCost =
    grandTotal *
    (contingencyPercent / 100);

  const recommendedProjectBudget =
    grandTotal +
    contingencyCost;

  const budgetDifference =
    budget -
    recommendedProjectBudget;

  const budgetUsedPercent =
    budget > 0
      ? (recommendedProjectBudget /
          budget) *
        100
      : 100;

  const budgetHealth =
    budgetDifference >= 0
      ? budgetUsedPercent <= 85
        ? "Healthy"
        : "Close"
      : "Over Budget";

  const budgetHealthClass =
    budgetDifference >= 0
      ? budgetUsedPercent <= 85
        ? "bg-green-100 text-green-700"
        : "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  const totalDuration =
    stageDefinitions.reduce(
      (total, stage) =>
        total + stage.duration,
      0
    );

  const readinessScore =
    useMemo(() => {
      let score = 45;

      if (rooms.length >= 2)
        score += 8;

      if (walls.length >= 4)
        score += 8;

      if (doors.length > 0)
        score += 5;

      if (windows.length > 0)
        score += 5;

      if (totalArea >= 50)
        score += 5;

      if (budget > 0)
        score += 8;

      if (budgetDifference >= 0)
        score += 10;

      if (budgetDifference < 0)
        score -= 15;

      return Math.max(
        0,
        Math.min(100, score)
      );
    }, [
      rooms.length,
      walls.length,
      doors.length,
      windows.length,
      totalArea,
      budget,
      budgetDifference,
    ]);

  const readinessLabel =
    readinessScore >= 80
      ? "Excellent"
      : readinessScore >= 65
      ? "Good"
      : readinessScore >= 50
      ? "Needs Work"
      : "Not Ready";

  const scenarioCosts = {
    economy:
      grandTotal * 0.85,
    current:
      grandTotal,
    premium:
      grandTotal * 1.25,
  };

  const selectedScenarioCost =
    scenarioCosts[
      selectedScenario
    ];

  const optimizationItems = [
    {
      title: "Flooring",
      value: flooringCost,
      suggestion:
        "Compare local tile, vinyl and polished concrete options before choosing a finish.",
    },
    {
      title: "Roofing",
      value: roofingCost,
      suggestion:
        "Compare roofing systems and suppliers. Roof geometry can strongly affect cost.",
    },
    {
      title: "Blocks",
      value: blockCost,
      suggestion:
        "Compare block sizes, supplier prices and delivery distance.",
    },
    {
      title: "Labour",
      value: labourCost,
      suggestion:
        "Obtain several contractor quotations before locking in labour assumptions.",
    },
  ].sort(
    (a, b) =>
      b.value - a.value
  );

  /* =========================
     MILESTONE 7
     BOQ ENGINE
  ========================= */

  const autoBOQItems: BOQItem[] = [
    {
      id: -1,
      category: "Foundation",
      description: "Cement",
      quantity: cementQuantity,
      unit: "bags",
      unitPrice: prices.cement,
      estimatedCost: cementCost,
      actualCost: 0,
    },
    {
      id: -2,
      category: "Walls",
      description: "Concrete blocks",
      quantity: blockQuantity,
      unit: "blocks",
      unitPrice: prices.blocks,
      estimatedCost: blockCost,
      actualCost: 0,
    },
    {
      id: -3,
      category: "Foundation",
      description: "Sand",
      quantity: sandQuantity,
      unit: "m³",
      unitPrice: prices.sand,
      estimatedCost: sandCost,
      actualCost: 0,
    },
    {
      id: -4,
      category: "Foundation",
      description: "Ballast",
      quantity: ballastQuantity,
      unit: "m³",
      unitPrice: prices.ballast,
      estimatedCost: ballastCost,
      actualCost: 0,
    },
    {
      id: -5,
      category: "Foundation",
      description: "Steel",
      quantity: steelQuantity,
      unit: "kg",
      unitPrice: prices.steel,
      estimatedCost: steelCost,
      actualCost: 0,
    },
    {
      id: -6,
      category: "Roofing",
      description: "Roofing materials",
      quantity: roofingQuantity,
      unit: "m²",
      unitPrice: prices.roofing,
      estimatedCost: roofingCost,
      actualCost: 0,
    },
    {
      id: -7,
      category: "Flooring",
      description: "Flooring",
      quantity: flooringQuantity,
      unit: "m²",
      unitPrice: prices.flooring,
      estimatedCost: flooringCost,
      actualCost: 0,
    },
    {
      id: -8,
      category: "Finishing",
      description: "Paint",
      quantity: paintQuantity,
      unit: "units",
      unitPrice: prices.paint,
      estimatedCost: paintCost,
      actualCost: 0,
    },
    {
      id: -9,
      category: "Doors & Windows",
      description: "Doors",
      quantity: doors.length,
      unit: "doors",
      unitPrice: prices.door,
      estimatedCost: doorCost,
      actualCost: 0,
    },
    {
      id: -10,
      category: "Doors & Windows",
      description: "Windows",
      quantity: windows.length,
      unit: "windows",
      unitPrice: prices.window,
      estimatedCost: windowCost,
      actualCost: 0,
    },
  ];

  const allBOQItems = [
    ...autoBOQItems,
    ...boqItems,
  ];

  const boqEstimatedTotal =
    allBOQItems.reduce(
      (sum, item) =>
        sum + item.estimatedCost,
      0
    );

  const boqActualTotal =
    allBOQItems.reduce(
      (sum, item) =>
        sum + item.actualCost,
      0
    );

  const boqVariance =
    boqActualTotal -
    boqEstimatedTotal;

  const approvedChangeOrders =
    changeOrders
      .filter(
        (item) =>
          item.status ===
          "Approved"
      )
      .reduce(
        (sum, item) =>
          sum + item.amount,
        0
      );

  const pendingChangeOrders =
    changeOrders
      .filter(
        (item) =>
          item.status ===
          "Pending"
      )
      .reduce(
        (sum, item) =>
          sum + item.amount,
        0
      );

  const adjustedProjectCost =
    recommendedProjectBudget +
    approvedChangeOrders;

  const projectedBudgetDifference =
    budget -
    adjustedProjectCost;

  const costControlStatus =
    projectedBudgetDifference >= 0
      ? "Within Budget"
      : "Budget Risk";

  const costControlClass =
    projectedBudgetDifference >= 0
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  function addBOQItem() {
    if (
      !newBOQDescription.trim()
    ) {
      return;
    }

    const quantity =
      Math.max(
        0,
        newBOQQuantity
      );

    const unitPrice =
      Math.max(
        0,
        newBOQUnitPrice
      );

    const item: BOQItem = {
      id: Date.now(),
      category:
        newBOQCategory,
      description:
        newBOQDescription.trim(),
      quantity,
      unit:
        newBOQUnit,
      unitPrice,
      estimatedCost:
        quantity *
        unitPrice,
      actualCost:
        Math.max(
          0,
          newActualCost
        ),
    };

    setBoqItems((current) => [
      ...current,
      item,
    ]);

    setNewBOQDescription("");
    setNewBOQQuantity(1);
    setNewBOQUnit("item");
    setNewBOQUnitPrice(0);
    setNewActualCost(0);
  }

  function removeBOQItem(id: number) {
    setBoqItems((current) =>
      current.filter(
        (item) =>
          item.id !== id
      )
    );
  }

  function updateBOQItem(
    id: number,
    property:
      | "quantity"
      | "unitPrice"
      | "actualCost",
    value: number
  ) {
    setBoqItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const updated = {
          ...item,
          [property]: Math.max(
            0,
            value
          ),
        };

        return {
          ...updated,
          estimatedCost:
            updated.quantity *
            updated.unitPrice,
        };
      })
    );
  }

  function addChangeOrder() {
    if (
      !newChangeTitle.trim()
    ) {
      return;
    }

    const change: ChangeOrder = {
      id: Date.now(),
      title:
        newChangeTitle.trim(),
      description:
        newChangeDescription.trim(),
      amount:
        Math.max(
          0,
          newChangeAmount
        ),
      status: "Pending",
    };

    setChangeOrders(
      (current) => [
        ...current,
        change,
      ]
    );

    setNewChangeTitle("");
    setNewChangeDescription("");
    setNewChangeAmount(0);
  }

  function updateChangeOrderStatus(
    id: number,
    status:
      | "Pending"
      | "Approved"
      | "Rejected"
  ) {
    setChangeOrders(
      (current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
              }
            : item
        )
    );
  }

  function removeChangeOrder(
    id: number
  ) {
    setChangeOrders(
      (current) =>
        current.filter(
          (item) =>
            item.id !== id
        )
    );
  }

  function money(value: number) {
    return `KSh ${Math.round(
      value
    ).toLocaleString(
      "en-KE"
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

          <div className="text-right">
            <p className="text-sm font-semibold">
              Floor Plan Designer
            </p>

            <p className="text-xs text-gray-500">
              Smart Construction Planning
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            YouBuild
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Build your floor plan
          </h1>

          <p className="mt-2 text-gray-600">
            Design, estimate, analyze,
            control costs and plan
            your construction project.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr_330px]">
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
                      addRoom(room)
                    }
                    className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition hover:border-green-600 hover:bg-green-50"
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
                  onClick={() =>
                    walls[0] &&
                    addDoor(
                      "Interior",
                      walls[0].id
                    )
                  }
                  className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50 disabled:opacity-40"
                >
                  + Interior door
                </button>

                <button
                  disabled={
                    walls.length ===
                    0
                  }
                  onClick={() =>
                    walls[0] &&
                    addDoor(
                      "Exterior",
                      walls[0].id
                    )
                  }
                  className="w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50 disabled:opacity-40"
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
                  walls.length === 0
                }
                onClick={() =>
                  walls[0] &&
                  addWindow(
                    walls[0].id
                  )
                }
                className="mt-4 w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium hover:border-green-600 hover:bg-green-50 disabled:opacity-40"
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
                  Select an element to
                  edit it.
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
                        key={room.id}
                        className="absolute"
                        style={{
                          left: room.x,
                          top: room.y,
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
                            {room.name}
                          </span>

                          <span className="mt-1 text-xs text-gray-500">
                            {room.width}m ×{" "}
                            {room.height}m
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

                          <span className="absolute bg-white px-1 text-[10px] font-medium">
                            {room.width.toFixed(
                              1
                            )}m
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
                            className="absolute whitespace-nowrap bg-white px-1 text-[10px] font-medium"
                            style={{
                              transform:
                                "rotate(-90deg)",
                            }}
                          >
                            {room.height.toFixed(
                              1
                            )}m
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}

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
                        key={wall.id}
                        className="absolute"
                        style={{
                          left: wall.x,
                          top: wall.y,
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
                          className={`absolute inset-0 z-10 rounded-sm ${
                            isSelected
                              ? "bg-green-600 shadow-lg"
                              : "bg-gray-800"
                          }`}
                        />

                        <span
                          className="absolute z-20 whitespace-nowrap bg-white px-1 text-[10px] font-medium text-gray-600"
                          style={
                            horizontal
                              ? {
                                  left:
                                    "50%",
                                  top: 12,
                                  transform:
                                    "translateX(-50%)",
                                }
                              : {
                                  left: 12,
                                  top: "50%",
                                  transform:
                                    "translateY(-50%) rotate(-90deg)",
                                }
                          }
                        >
                          {wall.length.toFixed(
                            1
                          )}m
                        </span>
                      </div>
                    );
                  }
                )}

                {doors.map(
                  (door) => {
                    const wall =
                      walls.find(
                        (item) =>
                          item.id ===
                          door.wallId
                      );

                    if (!wall)
                      return null;

                    const horizontal =
                      wall.direction ===
                      "horizontal";

                    const position =
                      door.position *
                      35;

                    const isSelected =
                      door.id ===
                      selectedDoorId;

                    return (
                      <div
                        key={door.id}
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
                          className="absolute whitespace-nowrap rounded bg-white px-1 text-[10px] font-medium shadow"
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
                          )}m
                        </span>
                      </div>
                    );
                  }
                )}

                {windows.map(
                  (window) => {
                    const wall =
                      walls.find(
                        (item) =>
                          item.id ===
                          window.wallId
                      );

                    if (!wall)
                      return null;

                    const horizontal =
                      wall.direction ===
                      "horizontal";

                    const position =
                      window.position *
                      35;

                    const isSelected =
                      window.id ===
                      selectedWindowId;

                    return (
                      <div
                        key={window.id}
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
                        />

                        <span
                          className="absolute whitespace-nowrap rounded bg-white px-1 text-[10px] font-medium shadow"
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
                          )}m
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
                  <p className="mt-5 text-xs font-semibold text-gray-500">
                    ROOM
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedRoom.name}
                  </p>

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

                  <p className="mt-5 text-sm font-medium">
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
                  <p className="mt-5 text-xs font-semibold text-gray-500">
                    WALL
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedWall.name}
                  </p>

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
                  <p className="mt-5 text-xs font-semibold text-gray-500">
                    DOOR
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedDoor.name}
                  </p>

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
                  <p className="mt-5 text-xs font-semibold text-gray-500">
                    WINDOW
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedWindow.name}
                  </p>

                  <label className="mt-5 block">
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
                    )}
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

            {/* MILESTONE 4 */}

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                Milestone 4
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Building cost estimate
              </h2>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>
                    Cement
                  </span>
                  <span>
                    {cementQuantity}{" "}
                    bags
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Blocks
                  </span>
                  <span>
                    {blockQuantity.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Sand
                  </span>
                  <span>
                    {sandQuantity}{" "}
                    m³
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Ballast
                  </span>
                  <span>
                    {ballastQuantity}{" "}
                    m³
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Steel
                  </span>
                  <span>
                    {steelQuantity}{" "}
                    kg
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Roofing
                  </span>
                  <span>
                    {roofingQuantity}{" "}
                    m²
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Flooring
                  </span>
                  <span>
                    {flooringQuantity}{" "}
                    m²
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Paint
                  </span>
                  <span>
                    {paintQuantity}{" "}
                    units
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-green-600 p-4 text-white">
                <p className="text-xs text-green-100">
                  Estimated construction
                  cost
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {money(
                    grandTotal
                  )}
                </p>

                <p className="mt-1 text-xs text-green-100">
                  {money(
                    costPerSquareMeter
                  )}{" "}
                  per m²
                </p>
              </div>

              <div className="mt-6 border-t pt-5">
                <h3 className="font-semibold">
                  Material prices
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Update these to match
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
                    ([label, key]) => (
                      <label
                        key={key}
                        className="block"
                      >
                        <span className="text-xs font-medium text-gray-600">
                          {label}
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
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        />
                      </label>
                    )
                  )}
                </div>
              </div>

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
            </div>

            {/* MILESTONE 5 */}

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Milestone 5
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Project data analysis
              </h2>

              <div className="mt-5 space-y-4">
                {[
                  [
                    "Materials",
                    materialShare,
                    "bg-blue-500",
                  ],
                  [
                    "Labour",
                    labourShare,
                    "bg-purple-500",
                  ],
                  [
                    "Transport",
                    transportShare,
                    "bg-amber-500",
                  ],
                  [
                    "Waste",
                    wasteShare,
                    "bg-red-400",
                  ],
                ].map(
                  ([label, value, color]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span>
                          {label}
                        </span>

                        <span>
                          {Number(
                            value
                          ).toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full ${color}`}
                          style={{
                            width: `${Math.min(
                              Number(
                                value
                              ),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-5 rounded-xl bg-blue-50 p-4">
                <p className="text-xs text-blue-700">
                  Cost efficiency
                </p>

                <p className="mt-1 text-xl font-bold text-blue-800">
                  {money(
                    costPerSquareMeter
                  )}
                  /m²
                </p>
              </div>
            </div>

            {/* MILESTONE 6 */}

            <div className="rounded-2xl border-2 border-green-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                    Milestone 6
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Smart Project Planner
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Turn the estimate into a
                    construction decision.
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${budgetHealthClass}`}
                >
                  {budgetHealth}
                </span>
              </div>

              <div className="mt-6">
                <label className="block">
                  <span className="text-sm font-semibold">
                    Available project budget
                  </span>

                  <div className="mt-2 flex">
                    <span className="flex items-center rounded-l-lg border border-r-0 bg-gray-100 px-3 text-xs">
                      KSh
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={budget}
                      onChange={(e) =>
                        setBudget(
                          Math.max(
                            0,
                            Number(
                              e.target
                                .value
                            )
                          )
                        )
                      }
                      className="w-full rounded-r-lg border px-3 py-2"
                    />
                  </div>
                </label>
              </div>

              <div className="mt-4">
                <label className="block">
                  <span className="text-sm font-semibold">
                    Contingency %
                  </span>

                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={
                      contingencyPercent
                    }
                    onChange={(e) =>
                      setContingencyPercent(
                        Math.max(
                          0,
                          Math.min(
                            50,
                            Number(
                              e.target
                                .value
                            )
                          )
                        )
                      )
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-2xl bg-gray-900 p-5 text-white">
                <div className="flex justify-between text-sm">
                  <span>
                    Construction estimate
                  </span>

                  <span>
                    {money(
                      grandTotal
                    )}
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span>
                    Contingency
                  </span>

                  <span>
                    {money(
                      contingencyCost
                    )}
                  </span>
                </div>

                <div className="mt-4 border-t border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      Recommended budget
                    </span>

                    <span className="font-bold">
                      {money(
                        recommendedProjectBudget
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span>
                    Budget difference
                  </span>

                  <span
                    className={
                      budgetDifference >=
                      0
                        ? "font-bold text-green-400"
                        : "font-bold text-red-400"
                    }
                  >
                    {money(
                      Math.abs(
                        budgetDifference
                      )
                    )}{" "}
                    {budgetDifference >=
                    0
                      ? "remaining"
                      : "shortfall"}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-green-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-green-700">
                      Build readiness
                    </p>

                    <p className="mt-1 text-2xl font-bold text-green-800">
                      {readinessScore}/100
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-green-700">
                      {readinessLabel}
                    </p>

                    <p className="text-xs text-green-600">
                      Project planning score
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-green-200">
                  <div
                    className="h-full rounded-full bg-green-600 transition-all"
                    style={{
                      width: `${readinessScore}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold">
                  Build scenarios
                </h3>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(
                    [
                      [
                        "economy",
                        "Economy",
                        "-15%",
                      ],
                      [
                        "current",
                        "Current",
                        "Base",
                      ],
                      [
                        "premium",
                        "Premium",
                        "+25%",
                      ],
                    ] as const
                  ).map(
                    ([
                      id,
                      label,
                      change,
                    ]) => (
                      <button
                        key={id}
                        onClick={() =>
                          setSelectedScenario(
                            id
                          )
                        }
                        className={`rounded-xl border p-3 text-left ${
                          selectedScenario ===
                          id
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <p className="text-xs font-semibold">
                          {label}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-500">
                          {change}
                        </p>

                        <p className="mt-2 text-xs font-bold">
                          {money(
                            scenarioCosts[
                              id
                            ]
                          )}
                        </p>
                      </button>
                    )
                  )}
                </div>

                <div className="mt-3 rounded-xl bg-gray-100 p-4">
                  <p className="text-xs text-gray-500">
                    Selected scenario
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {money(
                      selectedScenarioCost
                    )}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    This is a planning
                    scenario, not a
                    supplier quotation.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Construction timeline
                  </h3>

                  <span className="text-xs font-semibold text-green-600">
                    {totalDuration}{" "}
                    working days
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {stageDefinitions.map(
                    (stage) => {
                      const stageCost =
                        grandTotal *
                        (stage.percentage /
                          100);

                      return (
                        <div
                          key={
                            stage.name
                          }
                          className="rounded-xl border p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>
                                {
                                  stage.icon
                                }
                              </span>

                              <span className="text-sm font-semibold">
                                {
                                  stage.name
                                }
                              </span>
                            </div>

                            <span className="text-xs font-bold">
                              {money(
                                stageCost
                              )}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                            <span>
                              {
                                stage.duration
                              }{" "}
                              days
                            </span>

                            <span>
                              {
                                stage.percentage
                              }
                              %
                            </span>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full bg-green-500"
                              style={{
                                width: `${stage.percentage * 5}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold">
                  Biggest optimization opportunities
                </h3>

                <div className="mt-3 space-y-3">
                  {optimizationItems
                    .slice(0, 3)
                    .map(
                      (item) => (
                        <div
                          key={
                            item.title
                          }
                          className="rounded-xl bg-amber-50 p-4"
                        >
                          <div className="flex justify-between">
                            <p className="text-sm font-semibold text-amber-900">
                              {
                                item.title
                              }
                            </p>

                            <p className="text-xs font-bold text-amber-700">
                              {money(
                                item.value
                              )}
                            </p>
                          </div>

                          <p className="mt-1 text-xs leading-5 text-amber-800">
                            {
                              item.suggestion
                            }
                          </p>
                        </div>
                      )
                    )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold">
                  Financial summary
                </h3>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>
                      Materials
                    </span>

                    <span className="font-semibold">
                      {money(
                        rawMaterialCost
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Waste
                    </span>

                    <span>
                      {money(
                        wasteCost
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Transport
                    </span>

                    <span>
                      {money(
                        transportCost
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Labour
                    </span>

                    <span>
                      {money(
                        labourCost
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-3 font-bold">
                    <span>
                      Total
                    </span>

                    <span>
                      {money(
                        grandTotal
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                MILESTONE 7
                PROFESSIONAL BOQ & COST CONTROL
            ================================================= */}

            <div className="rounded-2xl border-2 border-blue-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Milestone 7
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    BOQ & Cost Control
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Track estimated costs,
                    actual costs and project
                    changes in one place.
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${costControlClass}`}
                >
                  {costControlStatus}
                </span>
              </div>

              {/* BOQ SUMMARY CARDS */}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs text-blue-600">
                    BOQ estimate
                  </p>

                  <p className="mt-1 text-lg font-bold text-blue-800">
                    {money(
                      boqEstimatedTotal
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-100 p-4">
                  <p className="text-xs text-gray-500">
                    Actual costs
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {money(
                      boqActualTotal
                    )}
                  </p>
                </div>

                <div
                  className={`rounded-xl p-4 ${
                    boqVariance <= 0
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <p className="text-xs text-gray-500">
                    Cost variance
                  </p>

                  <p
                    className={`mt-1 text-lg font-bold ${
                      boqVariance <= 0
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {money(
                      Math.abs(
                        boqVariance
                      )
                    )}
                  </p>

                  <p className="mt-1 text-[10px]">
                    {boqVariance <= 0
                      ? "Under estimate"
                      : "Over estimate"}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-xs text-amber-700">
                    Approved changes
                  </p>

                  <p className="mt-1 text-lg font-bold text-amber-900">
                    {money(
                      approvedChangeOrders
                    )}
                  </p>
                </div>
              </div>

              {/* NAVIGATION */}

              <div className="mt-6 grid grid-cols-3 gap-2">
                <button
                  onClick={() =>
                    setBoqView(
                      "summary"
                    )
                  }
                  className={`rounded-xl border px-2 py-2 text-xs font-semibold ${
                    boqView ===
                    "summary"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "bg-white"
                  }`}
                >
                  Overview
                </button>

                <button
                  onClick={() =>
                    setBoqView(
                      "items"
                    )
                  }
                  className={`rounded-xl border px-2 py-2 text-xs font-semibold ${
                    boqView ===
                    "items"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "bg-white"
                  }`}
                >
                  BOQ Items
                </button>

                <button
                  onClick={() =>
                    setBoqView(
                      "changes"
                    )
                  }
                  className={`rounded-xl border px-2 py-2 text-xs font-semibold ${
                    boqView ===
                    "changes"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "bg-white"
                  }`}
                >
                  Change Orders
                </button>
              </div>

              {/* OVERVIEW */}

              {boqView ===
                "summary" && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border p-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">
                        Original recommended budget
                      </span>

                      <span className="text-sm font-bold">
                        {money(
                          recommendedProjectBudget
                        )}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between text-sm">
                      <span>
                        Approved change orders
                      </span>

                      <span>
                        +{" "}
                        {money(
                          approvedChangeOrders
                        )}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between text-sm">
                      <span>
                        Adjusted project cost
                      </span>

                      <span className="font-bold">
                        {money(
                          adjustedProjectCost
                        )}
                      </span>
                    </div>

                    <div className="mt-4 border-t pt-4">
                      <div className="flex justify-between">
                        <span className="font-semibold">
                          Budget remaining
                        </span>

                        <span
                          className={
                            projectedBudgetDifference >=
                            0
                              ? "font-bold text-green-700"
                              : "font-bold text-red-700"
                          }
                        >
                          {money(
                            Math.abs(
                              projectedBudgetDifference
                            )
                          )}{" "}
                          {projectedBudgetDifference >=
                          0
                            ? "remaining"
                            : "over budget"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-900 p-4 text-white">
                    <p className="text-xs text-gray-400">
                      Cost-control position
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {money(
                        adjustedProjectCost
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Current projected project
                      commitment including
                      approved changes.
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-4">
                    <p className="text-sm font-semibold text-blue-900">
                      How Milestone 7 works
                    </p>

                    <ul className="mt-2 space-y-1 text-xs leading-5 text-blue-800">
                      <li>
                        • The floor-plan estimate
                        automatically feeds the
                        BOQ.
                      </li>

                      <li>
                        • You can add custom work
                        items.
                      </li>

                      <li>
                        • Actual costs can be
                        entered as purchases happen.
                      </li>

                      <li>
                        • Variances show where
                        spending is moving away from
                        the estimate.
                      </li>

                      <li>
                        • Change orders show the
                        financial effect of project
                        changes.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* BOQ ITEMS */}

              {boqView ===
                "items" && (
                <div className="mt-5">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h3 className="font-semibold">
                      Add custom BOQ item
                    </h3>

                    <div className="mt-4 space-y-3">
                      <label className="block">
                        <span className="text-xs font-medium">
                          Category
                        </span>

                        <select
                          value={
                            newBOQCategory
                          }
                          onChange={(e) =>
                            setNewBOQCategory(
                              e.target
                                .value
                            )
                          }
                          className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
                        >
                          {boqCategories.map(
                            (category) => (
                              <option
                                key={
                                  category
                                }
                              >
                                {
                                  category
                                }
                              </option>
                            )
                          )}
                        </select>
                      </label>

                      <label className="block">
                        <span className="text-xs font-medium">
                          Description
                        </span>

                        <input
                          value={
                            newBOQDescription
                          }
                          onChange={(e) =>
                            setNewBOQDescription(
                              e.target
                                .value
                            )
                          }
                          placeholder="e.g. Electrical wiring"
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-2">
                        <label>
                          <span className="text-xs font-medium">
                            Quantity
                          </span>

                          <input
                            type="number"
                            min="0"
                            value={
                              newBOQQuantity
                            }
                            onChange={(e) =>
                              setNewBOQQuantity(
                                Math.max(
                                  0,
                                  Number(
                                    e
                                      .target
                                      .value
                                  )
                                )
                              )
                            }
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                          />
                        </label>

                        <label>
                          <span className="text-xs font-medium">
                            Unit
                          </span>

                          <input
                            value={
                              newBOQUnit
                            }
                            onChange={(e) =>
                              setNewBOQUnit(
                                e.target
                                  .value
                              )
                            }
                            placeholder="item"
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <label>
                          <span className="text-xs font-medium">
                            Unit price
                          </span>

                          <input
                            type="number"
                            min="0"
                            value={
                              newBOQUnitPrice
                            }
                            onChange={(e) =>
                              setNewBOQUnitPrice(
                                Math.max(
                                  0,
                                  Number(
                                    e
                                      .target
                                      .value
                                  )
                                )
                              )
                            }
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                          />
                        </label>

                        <label>
                          <span className="text-xs font-medium">
                            Actual cost
                          </span>

                          <input
                            type="number"
                            min="0"
                            value={
                              newActualCost
                            }
                            onChange={(e) =>
                              setNewActualCost(
                                Math.max(
                                  0,
                                  Number(
                                    e
                                      .target
                                      .value
                                  )
                                )
                              )
                            }
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                          />
                        </label>
                      </div>

                      <button
                        onClick={
                          addBOQItem
                        }
                        className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        + Add BOQ item
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {allBOQItems.map(
                      (item) => {
                        const variance =
                          item.actualCost -
                          item.estimatedCost;

                        const isCustom =
                          item.id > 0;

                        return (
                          <div
                            key={
                              item.id
                            }
                            className="rounded-xl border p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[10px] font-semibold uppercase text-blue-600">
                                  {
                                    item.category
                                  }
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                  {
                                    item.description
                                  }
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {
                                    item.quantity
                                  }{" "}
                                  {
                                    item.unit
                                  }{" "}
                                  ×{" "}
                                  {money(
                                    item.unitPrice
                                  )}
                                </p>
                              </div>

                              {isCustom && (
                                <button
                                  onClick={() =>
                                    removeBOQItem(
                                      item.id
                                    )
                                  }
                                  className="text-xs font-semibold text-red-600"
                                >
                                  Delete
                                </button>
                              )}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                              <div className="rounded-lg bg-gray-50 p-2">
                                <p className="text-gray-500">
                                  Estimated
                                </p>

                                <p className="font-bold">
                                  {money(
                                    item.estimatedCost
                                  )}
                                </p>
                              </div>

                              <div className="rounded-lg bg-gray-50 p-2">
                                <p className="text-gray-500">
                                  Actual
                                </p>

                                {isCustom ? (
                                  <input
                                    type="number"
                                    min="0"
                                    value={
                                      item.actualCost
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updateBOQItem(
                                        item.id,
                                        "actualCost",
                                        Number(
                                          e
                                            .target
                                            .value
                                        )
                                      )
                                    }
                                    className="mt-1 w-full rounded border px-2 py-1 text-xs"
                                  />
                                ) : (
                                  <p className="font-bold">
                                    {money(
                                      item.actualCost
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>

                            {isCustom && (
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <label>
                                  <span className="text-[10px] text-gray-500">
                                    Quantity
                                  </span>

                                  <input
                                    type="number"
                                    min="0"
                                    value={
                                      item.quantity
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updateBOQItem(
                                        item.id,
                                        "quantity",
                                        Number(
                                          e
                                            .target
                                            .value
                                        )
                                      )
                                    }
                                    className="mt-1 w-full rounded border px-2 py-1 text-xs"
                                  />
                                </label>

                                <label>
                                  <span className="text-[10px] text-gray-500">
                                    Unit price
                                  </span>

                                  <input
                                    type="number"
                                    min="0"
                                    value={
                                      item.unitPrice
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updateBOQItem(
                                        item.id,
                                        "unitPrice",
                                        Number(
                                          e
                                            .target
                                            .value
                                        )
                                      )
                                    }
                                    className="mt-1 w-full rounded border px-2 py-1 text-xs"
                                  />
                                </label>
                              </div>
                            )}

                            <div className="mt-3 flex justify-between border-t pt-2 text-xs">
                              <span>
                                Variance
                              </span>

                              <span
                                className={
                                  variance <=
                                  0
                                    ? "font-bold text-green-700"
                                    : "font-bold text-red-700"
                                }
                              >
                                {money(
                                  Math.abs(
                                    variance
                                  )
                                )}{" "}
                                {variance <=
                                0
                                  ? "under"
                                  : "over"}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* CHANGE ORDERS */}

              {boqView ===
                "changes" && (
                <div className="mt-5">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h3 className="font-semibold">
                      Add change order
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Record a requested change
                      before approving its effect
                      on the budget.
                    </p>

                    <div className="mt-4 space-y-3">
                      <label className="block">
                        <span className="text-xs font-medium">
                          Title
                        </span>

                        <input
                          value={
                            newChangeTitle
                          }
                          onChange={(e) =>
                            setNewChangeTitle(
                              e.target
                                .value
                            )
                          }
                          placeholder="e.g. Upgrade kitchen tiles"
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        />
                      </label>

                      <label className="block">
                        <span className="text-xs font-medium">
                          Description
                        </span>

                        <textarea
                          value={
                            newChangeDescription
                          }
                          onChange={(e) =>
                            setNewChangeDescription(
                              e.target
                                .value
                            )
                          }
                          placeholder="Describe the requested change"
                          rows={3}
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        />
                      </label>

                      <label className="block">
                        <span className="text-xs font-medium">
                          Additional cost
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={
                            newChangeAmount
                          }
                          onChange={(e) =>
                            setNewChangeAmount(
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

                      <button
                        onClick={
                          addChangeOrder
                        }
                        className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        + Add change order
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-amber-50 p-4">
                    <div className="flex justify-between text-sm">
                      <span>
                        Pending changes
                      </span>

                      <span className="font-bold">
                        {money(
                          pendingChangeOrders
                        )}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-amber-800">
                      Pending changes do not
                      affect the official
                      adjusted project cost until
                      approved.
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {changeOrders.length ===
                    0 ? (
                      <div className="rounded-xl border border-dashed p-5 text-center text-xs text-gray-500">
                        No change orders yet.
                      </div>
                    ) : (
                      changeOrders.map(
                        (change) => (
                          <div
                            key={
                              change.id
                            }
                            className="rounded-xl border p-4"
                          >
                            <div className="flex justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">
                                  {
                                    change.title
                                  }
                                </p>

                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                  {
                                    change.description
                                  }
                                </p>
                              </div>

                              <p className="whitespace-nowrap text-sm font-bold">
                                +{" "}
                                {money(
                                  change.amount
                                )}
                              </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-2">
                              <select
                                value={
                                  change.status
                                }
                                onChange={(e) =>
                                  updateChangeOrderStatus(
                                    change.id,
                                    e
                                      .target
                                      .value as
                                      | "Pending"
                                      | "Approved"
                                      | "Rejected"
                                  )
                                }
                                className="rounded-lg border px-2 py-1.5 text-xs"
                              >
                                <option>
                                  Pending
                                </option>

                                <option>
                                  Approved
                                </option>

                                <option>
                                  Rejected
                                </option>
                              </select>

                              <button
                                onClick={() =>
                                  removeChangeOrder(
                                    change.id
                                  )
                                }
                                className="text-xs font-semibold text-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <p className="text-xs leading-5 text-blue-800">
                  <strong>
                    Milestone 7 note:
                  </strong>{" "}
                  The BOQ quantities generated from
                  the floor plan are planning
                  quantities. They should eventually
                  be verified against professional
                  measurements, structural drawings,
                  site conditions, supplier
                  quotations and contractor rates.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}