import { useEffect, useRef, useState } from "react";
import type { Collection, HistoryItem, tabItem } from "../types";

type Props = {
  collections: Collection[];
  expand: Record<number, boolean>;
  setExpand: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  addCollection: () => void;
  loadHistory: (item: tabItem) => void;
  updateCollection: (field: string, value: any, collectionId: number) => void;
  updateRequest: (collectID: number, value: tabItem) => void;
  addTab: (item?: HistoryItem | tabItem) => void;
  deleteCollection: (id: number) => void;
};

function CollectionList({
  collections,
  expand,
  setExpand,
  addCollection,
  loadHistory,
  updateCollection,
  updateRequest,
  addTab,
  deleteCollection
}: Props) {
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [updateName, setUpdateName] = useState<Record<number, boolean>>({});
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    Object.entries(updateName).forEach(([id, editing]) => {
      if (editing) {
        inputRefs.current[Number(id)]?.focus();
      }
    });
  }, [updateName]);

  return (
    <>
      <div className="row-container div-nopad">
        <h5>Collections</h5>

        <button className="btn-addHeader header-key" onClick={addCollection}>
          +
        </button>
      </div>

      <div className="collections">
        {collections.length > 0 ? (
          collections.map((item) => (
            <div key={item.id}>
              <div className="collectionContainer">
                <button
                  className="arrowBtn"
                  onClick={() =>
                    setExpand((prev) => ({
                      ...prev,
                      [item.id]: !prev[item.id],
                    }))
                  }
                >
                  {expand[item.id] ? "v" : ">"}
                </button>

                <input
                  ref={(el) => {
                    inputRefs.current[item.id] = el;
                  }}
                  value={item.name}
                  className="collectionName"
                  disabled={!updateName[item.id]}
                  onChange={(e) =>
                    updateCollection("name", e.target.value, item.id)
                  }
                  onBlur={() => {
                    setUpdateName((prev) => ({
                      ...prev,
                      [item.id]: false,
                    }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setUpdateName((prev) => ({
                        ...prev,
                        [item.id]: false,
                      }));
                    }
                  }}
                />

                <button
                  className="menuCollect"
                  onClick={() =>
                    setShowMenu(showMenu === item.id ? null : item.id)
                  }
                >
                  :
                </button>
              </div>

              {showMenu === item.id && (
                <div className="menuCollections">
                  <button
                    className="menuItem"
                    onClick={() => {
                      const newTab = {
                        id: Date.now(),
                        name: "New Request",
                        url: "",
                        method: "GET",
                        response: null,
                        status: null,
                        headers: [
                          {
                            key: "",
                            value: "",
                          },
                        ],
                        body: "",
                      };
                      addTab(newTab);
                      updateRequest(item.id, newTab);
                      setShowMenu(null);
                    }}
                  >
                    Add Request
                  </button>
                  <button
                    className="menuItem"
                    onClick={() => {
                      setUpdateName((prev) => ({
                        ...prev,
                        [item.id]: true,
                      }));
                      setShowMenu(null);
                    }}
                  >
                    Rename
                  </button>
                  <button className="menuItem" onClick={() => {
                    deleteCollection(item.id);
                    setShowMenu(null);
                  }}>Delete</button>
                </div>
              )}

              {expand[item.id] &&
                item.request.length > 0 &&
                item.request.map((req) => (
                  <div
                    className="requestContainer"
                    key={req.id}
                    onClick={() => loadHistory(req)}
                  >
                    <span className={`method-${req.method}`}>{req.method}</span>

                    <span className="url">{req.name}</span>
                  </div>
                ))}
            </div>
          ))
        ) : (
          <p>don't have collection yet</p>
        )}
      </div>
    </>
  );
}

export default CollectionList;
