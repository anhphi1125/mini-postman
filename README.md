# API Testing Tool
🎬 Demo Video: [https://www.youtube.com/watch?v=X6lQvsOaSfE](https://www.youtube.com/watch?v=X6lQvsOaSfE)

A simple API testing application inspired by Postman, built with React and TypeScript. The application allows users to send HTTP requests, manage request history, and organize requests into collections.

## Features

### Request Management

* Send GET, POST, PUT, PATCH, DELETE requests
* Add and remove custom headers
* Support request body for non-GET methods
* Validate JSON request body before sending
* Display response status and response data

### Multi Tabs

* Open multiple requests in separate tabs
* Switch between tabs without losing data
* Close individual tabs

### History

* Automatically save request history
* Search history by URL or HTTP method
* Delete individual history items
* Clear all history

### Collections

* Create collections
* Rename collections
* Delete collections
* Add requests to collections
* Rename requests inside collections
* Delete requests from collections
* Expand/Collapse collection items

### Import & Export

* Export collections to JSON files
* Import collections from JSON files

### Local Storage

* Persist request history
* Persist collections
* Restore data after page reload

## Technologies

* React
* TypeScript
* Axios
* CSS
* Local Storage

## Installation

Clone the repository:

```bash
git clone https://github.com/anhphi1125/mini-postman.git
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

## Project Structure

```text
src/
├── components/
├── services/
├── types/
├── App.tsx
└── main.tsx
```

## Demo Flow

1. Create and send API requests
2. Manage request headers and body
3. View request history
4. Create collections
5. Add requests to collections
6. Export and import collections

## Future Improvements

* Environment Variables
* Request Authentication
* Response Time Analytics
* Dark Mode
* Collection Sharing
* Request Duplication

## Author

Đào Thị Ánh Phi

GitHub: https://github.com/anhphi1125
