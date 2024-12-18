"use client";
import React, { useState } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";

export const Kanban = () => {
  return (
    <div className="h-screen w-full text-neutral-50">
      <Board />
    </div>
  );
};

const Board = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS);

  return (
    <div className="flex w-full gap-3 overflow-x-scroll py-12 px-3">
      <Column
        title="Backlog"
        column="backlog"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress"
        column="doing"
        headingColor="text-blue-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-emerald-500"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

const Column = ({ title, headingColor, cards, column, setCards }: any) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: any, card: any) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: any) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: any) => {
    const indicators = els || getIndicators();

    indicators.forEach((i: any) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: any) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: any, indicators: any) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest: any, child: any) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      },
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c: any) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-semibold text-sm ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-fit w-full transition-colors ${
          active ? "bg-neutral-800/10" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c: any) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

const Card = ({
  title,
  id,
  column,
  handleDragStart,
  desc,
  attachments,
  status,
}: any) => {
  const statusColor =
    status === "high"
      ? "bg-red-600"
      : status === "medium"
        ? "bg-yellow-600"
        : "bg-green-600";

  const statusTextColor =
    status === "high"
      ? "text-red-600"
      : status === "medium"
        ? "text-yellow-600"
        : "text-green-600";
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="cursor-grab rounded border border-neutral-50 bg-white shadow-sm p-3 active:cursor-grabbing"
      >
        <div className="flex items-center gap-1 mb-2">
          <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
          <p className={`text-xs ${statusTextColor} capitalize`}>{status}</p>
        </div>
        <p className="text-xs text-neutral-800 font-semibold">{title}</p>
        {desc && <p className="text-xs mt-2 text-neutral-800">{desc}</p>}

        <div className="flex items-center justify-between mt-5">
          <img
            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            className="h-8 w-8 rounded-full object-cover"
          />

          <div className="flex items-center text-neutral-500 font-semibold text-sm">
            <i className="ri-attachment-line"></i>
            <p>4</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }: any) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards }: any) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: any) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((pv: any) => pv.filter((c: any) => c.id !== cardId));

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

const AddCard = ({ column, setCards }: any) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };

    setCards((pv: any) => [...pv, newCard]);

    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:text-neutral-500"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

const DEFAULT_CARDS = [
  // BACKLOG
  {
    title: "Look into render bug in dashboard",
    desc: "Research DB options for new microservice description",
    attachments: [
      "https://www.google.com/imgres?q=website&imgurl=https%3A%2F%2Fimages.ctfassets.net%2Flzny33ho1g45%2F5VGvMMdX169JCk60IJCRDA%2F358a2d3f62c6028d978efc382cb83ad5%2Fimage10.png%3Fw%3D1400&imgrefurl=https%3A%2F%2Fzapier.com%2Fblog%2Fbest-website-builders%2F&docid=NJVo5xEf60enKM&tbnid=htyV_cWwnrdJJM&vet=12ahUKEwj7oJ3cr4yKAxV7V0EAHYhTLI0QM3oECEsQAA..i&w=864&h=451&hcb=2&itg=1&ved=2ahUKEwj7oJ3cr4yKAxV7V0EAHYhTLI0QM3oECEsQAA",
      "https://www.google.com/imgres?q=website&imgurl=https%3A%2F%2Fimages.ctfassets.net%2Flzny33ho1g45%2F5VGvMMdX169JCk60IJCRDA%2F358a2d3f62c6028d978efc382cb83ad5%2Fimage10.png%3Fw%3D1400&imgrefurl=https%3A%2F%2Fzapier.com%2Fblog%2Fbest-website-builders%2F&docid=NJVo5xEf60enKM&tbnid=htyV_cWwnrdJJM&vet=12ahUKEwj7oJ3cr4yKAxV7V0EAHYhTLI0QM3oECEsQAA..i&w=864&h=451&hcb=2&itg=1&ved=2ahUKEwj7oJ3cr4yKAxV7V0EAHYhTLI0QM3oECEsQAA",
      "https://www.google.com/imgres?q=website&imgurl=https%3A%2F%2Fimages.ctfassets.net%2Flzny33ho1g45%2F5VGvMMdX169JCk60IJCRDA%2F358a2d3f62c6028d978efc382cb83ad5%2Fimage10.png%3Fw%3D1400&imgrefurl=https%3A%2F%2Fzapier.com%2Fblog%2Fbest-website-builders%2F&docid=NJVo5xEf60enKM&tbnid=htyV_cWwnrdJJM&vet=12ahUKEwj7oJ3cr4yKAxV7V0EAHYhTLI0QM3oECEsQAA..i&w=864&h=451&hcb=2&itg=1&ved=2ahUKEwj7oJ3cr4yKAxV7V0EAHYhTLI0QM3oECEsQAA",
      "https://www.google.com/imgres?q=website&imgurl=https%3A%2F%2Fimages.ctfassets.net%2Flzny33ho1g45%2F5VGvMMdX169JCk60IJCRDA%2F358a2d3f62c6028d978efc382cb83ad5%2Fimage10.png%3Fw%3D1400&imgrefurl=https%3A%2F%2Fzapier.com%2Fblog%2Fbest-website-builders%2F&docid=NJVo5xEf60enKM&tbnid=htyV_cWwnrdJJM&vet=12ahUKEwj7oJ3cr4yKAxV7V0EAHYhTLI0QM3oECEsQAA..i&w=864&h=451&hcb=2&itg=1&ved=2ahUKEwj7oJ3cr4yKAxV7V0EAHYhTLI0QM3oECEsQAA",
    ],
    id: "1",
    column: "backlog",
    status: "high",
  },
  {
    title: "SOX compliance checklist",
    status: "medium",
    id: "2",
    column: "backlog",
  },
  {
    title: "[SPIKE] Migrate to Azure",
    status: "low",
    id: "3",
    column: "backlog",
  },
  {
    title: "Document Notifications service",
    status: "high",
    id: "4",
    column: "backlog",
  },
  // TODO
  {
    title: "Research DB options for new microservice",
    id: "5",
    status: "low",
    column: "todo",
  },
  { title: "Postmortem for outage", id: "6", column: "todo" },
  { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },

  // DOING
  {
    title: "Refactor context providers to use Zustand",
    id: "8",
    column: "doing",
  },
  { title: "Add logging to daily CRON", id: "9", column: "doing" },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    column: "done",
  },
];
