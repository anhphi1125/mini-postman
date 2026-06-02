import type { Collection, tabItem } from "../types";

type Props = {
  collections: Collection[];
  expand: Record<number, boolean>;
  setExpand: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  addCollection: () => void;
  loadHistory: (item: tabItem) => void;
};

function CollectionList({
  collections,
  expand,
  setExpand,
  addCollection,
  loadHistory,
}: Props) {
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

                <input value={item.name} className="collectionName" readOnly />

                <button className="menuCollect">:</button>
              </div>

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
