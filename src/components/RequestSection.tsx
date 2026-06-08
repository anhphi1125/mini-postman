import type { Collection, tabItem } from "../types";

type Props = {
  activeTab: tabItem | undefined;
  activeCollectId: number;
  collections: Collection[];
  setActiveCollectId: React.Dispatch<React.SetStateAction<number>>;
  updateRequest: (collectID: number, value: tabItem) => void;

  updateTab: (field: string, value: any) => void;

  sendRequest: () => void;
  loading: boolean;

  updateHeaders: (index: number, field: "key" | "value", value: string) => void;

  deletedHeader: (index: number) => void;
  addHeader: () => void;
};

function RequestSection({
  activeTab,
  activeCollectId,
  collections,
  setActiveCollectId,
  updateRequest,
  updateTab,
  sendRequest,
  loading,
  updateHeaders,
  deletedHeader,
  addHeader,
}: Props) {
  return (
    <>
      <div className="row-container">
        <div className="row-container url-collect">
          <select
            className="manyCollect"
            value={activeCollectId}
            onChange={(e) => setActiveCollectId(Number(e.target.value))}
          >
            {collections.length > 0 &&
              collections.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
          </select>

          <p>/{activeTab?.name}</p>
        </div>

        <button
          className="btn-SaveRequest"
          onClick={() => activeTab && updateRequest(activeCollectId, activeTab)}
        >
          Save
        </button>
      </div>

      <div className="row-container">
        <div className={`row-container box`}>
          <select
            value={activeTab?.method}
            onChange={(e) => updateTab("method", e.target.value)}
            className="selection"
          >
            <option value={"GET"}>GET</option>
            <option value={"POST"}>POST</option>
            <option value={"PUT"}>PUT</option>
            <option value={"DELETE"}>DELETE</option>
          </select>

          <input
            placeholder="Enter URL"
            type="text"
            value={activeTab?.url || ""}
            className="input"
            onChange={(e) => updateTab("url", e.target.value)}
          />
        </div>

        <button onClick={sendRequest} className="btnSend" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="section">
        <h4>Headers</h4>

        {activeTab?.headers.map((item, index) => (
          <div className="row-container" key={index}>
            <input
              placeholder="Key"
              value={item.key}
              className="header-key"
              onChange={(e) => updateHeaders(index, "key", e.target.value)}
            />

            <input
              placeholder="value"
              value={item.value}
              className="header-value"
              onChange={(e) => updateHeaders(index, "value", e.target.value)}
            />

            {activeTab.headers.length > 1 && (
              <button
                className="header-key btn-addHeader btn-delete"
                onClick={() => deletedHeader(index)}
              >
                delete
              </button>
            )}
          </div>
        ))}

        <button className="header-key btn-addHeader" onClick={addHeader}>
          + Add Header
        </button>
      </div>

      <div className="section">
        <h4>Body</h4>

        <textarea
          className="req-body"
          placeholder="{key: value...}"
          disabled={activeTab?.method === "GET"}
          value={activeTab?.body}
          onChange={(e) => updateTab("body", e.target.value)}
        />
      </div>

      <div className="row-container">
        <div>
          {activeTab?.status && (
          <p
            className={`status-${
              activeTab.status > 300
                ? activeTab.status < 400
                  ? "warning"
                  : "error"
                : "ok"
            }`}
          >
            {activeTab.status}
          </p>
        )}
        </div>
        <p className="header-key">{activeTab?.timeResponse ? activeTab.timeResponse.toFixed(2) : 0} m/s</p>
      </div>

      <div className="response-container">
        {activeTab && (
          <pre className="success-text">
            {JSON.stringify(activeTab?.response, null, 2)}
          </pre>
        )}
      </div>
    </>
  );
}

export default RequestSection;
