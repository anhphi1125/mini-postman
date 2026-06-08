import { useEffect, useRef, useState } from "react";
import type { Collection, HistoryItem, tabItem } from "../types";

type Props = {
  collections: Collection[];
  expand: Record<number, boolean>;
  setExpand: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  addCollection: () => void;
  loadHistory: (item: tabItem) => void;
  updateCollection: (field: string, value: any, collectionId: number) => void;
  updateRequest: (
    collectID: number,
    value: tabItem,
    isDelete?: boolean,
  ) => void;
  addTab: (item?: HistoryItem | tabItem) => void;
  deleteCollection: (id: number) => void;
  updateTabs: (field: string, value: string, tabId: number) => void;
  exportCollection: (collection: Collection) => void;
  importCollection: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  deleteCollection,
  updateTabs,
  exportCollection,
  importCollection,
}: Props) {
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [showReqMenu, setShowReqMenu] = useState<number | null>(null);
  const [updateName, setUpdateName] = useState<Record<number, boolean>>({});
  const [updateReqName, setUpdateReqName] = useState<number | null>(null);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const inputReqRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const updateReqItemName = (
    collectID: number,
    value: string,
    request: tabItem,
  ) => {
    const newReq = {
      ...request,
      name: value,
    };

    updateRequest(collectID, newReq);
  };

  useEffect(() => {
    Object.entries(updateName).forEach(([id, editing]) => {
      if (editing) {
        inputRefs.current[Number(id)]?.focus();
      }
    });
  }, [updateName]);

  useEffect(() => {
    if (updateReqName) {
      inputReqRefs.current[updateReqName]?.focus();
    }
  }, [updateReqName]);

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
                        timeResponse: null,
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
                  <button
                    className="menuItem"
                    onClick={() => {
                      exportCollection(item);
                      setShowMenu(null);
                    }}
                  >
                    Export
                  </button>
                  <button
                    className="menuItem"
                    onClick={() => {
                      deleteCollection(item.id);
                      setShowMenu(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}

              {expand[item.id] &&
                item.request.length > 0 &&
                item.request.map((req) => (
                  <div key={req.id}>
                    <div
                      className="requestContainer"
                      onClick={() => loadHistory(req)}
                    >
                      <span className={`method-${req.method}`}>
                        {req.method}
                      </span>

                      <input
                        ref={(el) => {
                          inputReqRefs.current[req.id] = el;
                        }}
                        className="collectionName reqName"
                        value={req.name}
                        disabled={updateReqName !== req.id}
                        onChange={(e) =>
                          updateReqItemName(item.id, e.target.value, req)
                        }
                        onBlur={(e) => {
                          updateTabs("name", e.target.value, req.id);
                          setUpdateReqName(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateTabs("name", e.currentTarget.value, req.id);
                            setUpdateReqName(null);
                          }
                        }}
                      />

                      <button
                        className="requestManagement"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowReqMenu(
                            showReqMenu === req.id ? null : req.id,
                          );
                        }}
                      >
                        :
                      </button>
                    </div>
                    {showReqMenu === req.id && (
                      <div className="menuCollections">
                        <button
                          className="menuItem"
                          onClick={() => {
                            setUpdateReqName(req.id);
                            setShowReqMenu(null);
                          }}
                        >
                          Rename
                        </button>
                        <button
                          className="menuItem"
                          onClick={() => {
                            updateRequest(item.id, req, true);
                            setShowReqMenu(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))
        ) : (
          <p>don't have collection yet</p>
        )}
      </div>
      <input
        id="import-file"
        type="file"
        accept=".json"
        onChange={importCollection}
        style={{ display: "none" }}
      />

      <div className="importContainer">
        <label htmlFor="import-file" className="btn-SaveRequest btnImport">
          Import Collection
        </label>
      </div>
    </>
  );
}

export default CollectionList;
