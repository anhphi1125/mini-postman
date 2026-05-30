import { useEffect, useRef, useState } from "react";
import axiosInstance from "./services/axiosInstance";
import "./App.css";

type HeaderItem = {
  key: string;
  value: string;
};

type tabItem = {
  id: number;
  url: string;
  method: string;
  response: any;
  status: number | null;

  headers: HeaderItem[];
  body: string;
};

type HistoryItem = {
  id: number;
  url: string;
  method: string;
  response: any;
  status: number | null;

  headers: HeaderItem[];
  body: string;
};

function App() {
  const api = axiosInstance();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const activeRef = useRef<HTMLDivElement | null>(null);
  //tabs
  const [tabs, setTabs] = useState<tabItem[]>([
    {
      id: 1,
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
    },
  ]);

  const [activeTabID, setActiveTabID] = useState(1);
  const activeTab = tabs.find((tab) => tab.id === activeTabID);

  //update tab
  const updateTab = (field: string, value: any) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabID ? { ...tab, [field]: value } : tab,
      ),
    );
  };

  //thêm tab
  const addTab = (item?: HistoryItem | tabItem) => {
    const newTab = {
      id: item?.id || Date.now(),
      url: item?.url || "",
      method: item?.method || "GET",
      response: item?.response || null,
      status: item?.status || null,
      headers: item?.headers || [
        {
          key: "",
          value: "",
        },
      ],
      body: item?.body || "",
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabID(newTab.id);
  };

  // cập nhật headers request
  const updateHeaders = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newHeader = [...(activeTab?.headers || [])];

    newHeader[index] = {
      ...newHeader[index],
      [field]: value,
    };

    updateTab("headers", newHeader);
  };

  //thêm headers
  const addHeader = () => {
    const newHeaders = [
      ...(activeTab?.headers || []),
      {
        key: "",
        value: "",
      },
    ];

    updateTab("headers", newHeaders);
  };

  //xóa headers
  const deletedHeader = (indexH: number) => {
    if ((activeTab?.headers || []).length > 1) {
      const newH = activeTab?.headers.filter((_, index) => index !== indexH);
      updateTab("headers", newH);
    }
  };

  //close tab
  const closeTab = (id: number) => {
    if (tabs.length < 2) return;
    setTabs((prev) => {
      const newTabs = prev.filter((tab) => tab.id !== id);

      if (id === activeTabID) {
        setActiveTabID(newTabs[0].id);
      }

      return newTabs;
    });
  };

  //lấy danh sách history
  useEffect(() => {
    const saved = localStorage.getItem("history");

    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  //cập nhật history vào asyncStorage
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  //hàm gửi request check
  const sendRequest = async () => {
    const tab = activeTab;
    setLoading(true);

    try {
      if (!tab?.url) {
        updateTab("response", "Please enter URL!!!");
        return;
      }

      if (tab.method !== "GET" && tab.body.trim()) {
        try {
          JSON.parse(tab.body);
        } catch (error: any) {
          updateTab("status", 400);
          updateTab("response", "Invalid JSON");
          return;
        }
      }

      const res = await api.post("/send-request", {
        url: tab.url,
        method: tab.method,
        headers: tab.headers,
        body: tab.body,
      });
      updateTab("response", res.data);
      updateTab("status", res.status);

      const newH = {
        id: tab.id,
        url: tab.url,
        method: tab.method,
        headers: tab.headers,
        body: tab.body,
        response: res.data,
        status: res.status,
      };
      setHistory((prev) => {
        const existed = prev.find((item) => item.id === tab.id);

        if (existed) {
          return prev.map((item) => (item.id === tab.id ? newH : item));
        }

        return [newH, ...prev];
      });
    } catch (err: any) {
      updateTab("status", err.response?.status || 500);
      updateTab("response", err.response?.data?.err || err.message);
    } finally {
      setLoading(false);
    }
  };

  //hàm xóa lịch sử
  const handleDelete = (id: number) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  //auto scroll tab
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "end",
    });
  }, [activeTabID]);

  //load item history
  const loadHistory = (item: HistoryItem) => {
    const findItem = tabs.filter((it) => it.id === item.id);
    if (findItem.length === 1) {
      setActiveTabID(findItem[0].id);
    } else {
      addTab(item);
    }
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <h2>History</h2>
        <div>
          {history.map((item) => (
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
          <button
            className="float-btn"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Clear All
          </button>
        </div>
      </aside>
      <main className="main">
        <div className="tabs">
          {tabs.map((tab) => (
            <div
              ref={tab.id === activeTabID ? activeRef : null}
              className={`tab-item method-${tab.method}`}
              key={tab.id}
              onClick={() => setActiveTabID(tab.id)}
            >
              {tab.id === activeTabID && <span className="active" />}
              {tab.method}
              <p className="url">{tab.url}</p>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                <p>x</p>
              </span>
            </div>
          ))}

          <button className="btn-addTab" onClick={() => addTab()}>
            +
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
        {activeTab?.status && (
          <p
            className={`status-${activeTab.status > 300 ? (activeTab.status < 400 ? "warning" : "error") : "ok"}`}
          >
            {activeTab.status}
          </p>
        )}
        <div className="response-container">
          {activeTab && (
            <pre className="success-text">
              {JSON.stringify(activeTab?.response, null, 2)}
            </pre>
          )}
        </div>
      </main>
      {/* thông báo yes no */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Clear All History ?</p>

            <div className="modal-action">
              <button
                className="status-ok"
                onClick={() => {
                  setHistory([]);
                  setShowModal(false);
                }}
              >
                Yes
              </button>
              <button
                className="status-error"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
