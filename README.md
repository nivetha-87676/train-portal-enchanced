# RailYatra — Smart Indian Railway Portal 🚂

RailYatra is a modern, feature-rich web portal designed for Indian Railway travelers. It features real-time train tracking powered by OpenStreetMap & Leaflet.js, instant e-ticket booking, interactive PNR status checking, multiple dynamic color themes, and live API integrations.

---

## 🌟 Key Features

- 📋 **Ticket Booking**: Fast booking interface with instant e-ticket generation, passenger details validation, and multiple payment methods (UPI, GPay, PhonePe, Cards, Net Banking).
- 📍 **Live Train Tracking**: Real-time GPS map tracking along active Indian railway routes with animated train position indicators using Leaflet.js.
- 🎨 **Dynamic Theme Switcher**: 6 custom theme presets (Classic Red, Ocean Blue, Forest Green, Royal Purple, Sunset Orange, Dark Mode).
- 🎫 **PNR Status Checker**: Instant PNR lookup with simulated status responses and booking history.
- 🔌 **API Demos & Case Studies**: Demonstrations of `fetch()` async requests, HTTP status codes, and architecture breakdowns (REST vs SOAP, JWT Auth).
- 🕒 **Live Station Clock & Ticker**: Real-time time display and continuous scrolling train delay updates.

---

## 📁 File Structure

```
train-portal-enchanced/
├── index.html        # Clean HTML5 markup & semantic structure
├── css/
│   └── style.css     # Modular design system, themes, and animations
├── js/
│   └── script.js    # Application logic, state management & map rendering
├── .gitignore        # Git ignore rules for static web projects
└── README.md         # Project documentation
```

---

## 🚀 How to Run Locally

### Option 1: Direct File Opening (Quickest)
Simply double-click `index.html` or open it directly in any modern web browser (Chrome, Firefox, Edge, Safari).

### Option 2: Local Web Server (Recommended)

Using **VS Code Live Server**:
1. Open the project folder in VS Code.
2. Click **Go Live** at the bottom right status bar.

Using **Python**:
```bash
# Python 3
python -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000`.

Using **Node.js (`npx serve`)**:
```bash
npx serve .
```

---

## 🛠️ Built With

- **HTML5** & **CSS3** (Custom properties & responsive layout)
- **JavaScript (ES6+)**
- **Leaflet.js & OpenStreetMap** (Interactive live mapping)
- **Google Fonts** (Playfair Display, Rajdhani, Noto Sans)

---

## 👤 Author
Created by **Nivetha** ([`nivetha-87676`](https://github.com/nivetha-87676))