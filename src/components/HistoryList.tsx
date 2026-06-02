import type { HistoryItem } from "../types";

type Props = {
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  filteredHistory: HistoryItem[];
  loadHistory: (item: HistoryItem) => void;
  handleDelete: (id: number) => void;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function HistoryList({
  keyword,
  setKeyword,
  filteredHistory,
  loadHistory,
  handleDelete,
  setShowModal,
}: Props) {
  return (
    <>
      <h5>History</h5>

      <div>
        <input
          placeholder="Search history..."
          className="header-value"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="item-history"
            onClick={() => loadHistory(item)}
          >
            <span className={`method-${item.method}`}>{item.method}</span>

            <span className="url">{item.url}</span>

            <button
              className="btn-delete-item"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <div className="float-container">
        <button className="float-btn" onClick={() => setShowModal(true)}>
          Clear All
        </button>
      </div>
    </>
  );
}

export default HistoryList;
