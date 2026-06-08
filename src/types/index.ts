export type HeaderItem = {
  key: string;
  value: string;
};

export type tabItem = {
  id: number;
  name: string;
  url: string;
  method: string;
  response: any;
  status: number | null;
  headers: HeaderItem[];
  body: string;
  timeResponse: number | null;
};

export type HistoryItem = {
  id: number;
  name: string;
  url: string;
  method: string;
  response: any;
  status: number | null;
  headers: HeaderItem[];
  body: string;
  timeResponse: number | null;
};

export type Collection = {
  id: number;
  name: string;
  request: tabItem[];
};
