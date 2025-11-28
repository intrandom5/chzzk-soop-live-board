# CHZZK + SOOP Live Board

<img width="1328" height="823" alt="image" src="https://github.com/user-attachments/assets/4dc0b18e-4fd5-4a35-9a60-93605aae84f9" />


A unified dashboard that monitors streamers across CHZZK and SOOP, allowing you to track live statuses, viewer counts, and manage your own custom streamer list. Built as a personal project to simplify checking multiple platforms without switching pages.

> This project was primarily developed using Vibe Coding (AI-assisted) with Cursor.

## 🤖 Why This Project Was Built with Vibe Coding (AI-Assisted Development)

This project began as an exercise in solving a small inconvenience I experienced in everyday life.
I wanted to experiment with using AI to quickly prototype ideas, iterate on UI/UX, and validate features in short cycles. Rapidly testing multiple layouts and implementations was especially helpful at the early stage.

<br>

## Key Strategies for AI-Assisted Development

### 1. Defining Clear Requirements

- Specified exactly which information to display (live status, viewer count, thumbnails, etc.)

- Defined development flows explicitly (UI structure → API integration)

---

### 2. Iterative and Step-by-Step Approach

- Broke tasks into small steps

- Repeated: implement → review → refine → feedback → apply

---

### 3. Providing a Basic Design Framework

- Prepared base layout (list, card, badge placement)
- Let the AI implement detailed components based on this foundation


---

### 4. Human-Centric Development Decisions

- Rather than applying AI-generated code as-is,  
I reviewed and selected the appropriate parts at each stage, maintaining control over the project’s direction.

- The AI served as a tool for rapid implementation,  
while feature design, decisions, and quality checks remained human-driven.



<br>

## ✨ Features

### 🔴 Live Status Tracking
- Displays whether each streamer is **live** or **offline**
- Live streamers show:
  - Thumbnail
  - Broadcast title
  - Viewer count
  - Category
- Offline streamers show:
  - Profile image
  - Streamer name

### 🔄 Auto Refresh
- Automatically updates all streamer data **every 30 seconds**
- Shows the **last updated time**
- Manual refresh button included

### 📁 Streamer Management
- Add streamers by choosing a platform (CHZZK / SOOP) and entering their channel ID
- Remove streamers (delete button appears on hover)
- Prevents duplicate entries
- All data is saved in **LocalStorage**

### 📌 Sorting & Display Rules
- Live streamers are sorted by **viewer count (DESC)**
- Display order: **Live → Offline**

### 🎨 Platform Badges
- CHZZK streamers appear with **emerald** badge
- SOOP streamers appear with **blue** badge

<br>

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** useState, useEffect + LocalStorage
- **API:** CHZZK Open API + SOOP API (or temporary alternatives)

<br>

## 📂 Project Structure (Simplified)

```
live-stream-app/
├── app/                  # Next.js App Router (pages, layouts, API routes)
│   ├── api/              # Platform API proxies
│   │   ├── chzzk/[channelId]/route.ts
│   │   └── soop/[channelId]/route.ts
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   └── page.tsx          # Main page
├── components/           # UI Components
│   ├── LiveCard.tsx
│   ├── FollowCard.tsx
│   ├── LiveCarousel.tsx
│   ├── FollowsCarousel.tsx
│   ├── AddStreamerModal.tsx
│   └── Header.tsx
├── hooks/                # Custom React hooks
│   ├── useStreamers.ts
│   └── useInterval.ts
└── lib/                  # Utilities & types
    ├── api.ts
    ├── storage.ts
    └── types.ts

```

### 📌 Folder Highlights

- **app/**
  - App Router + global layout  
  - API proxy routes for Chzzk & Soop  
  - Main page composition

- **components/**
  - UI blocks for live cards, follow list, header, and modal

- **hooks/**
  - `useStreamers`: manages streamer list, API calls, auto-refresh, and LocalStorage  
  - `useInterval`: generic interval hook

- **lib/**
  - `api.ts`: fetch helpers  
  - `storage.ts`: LocalStorage helpers  
  - `types.ts`: TypeScript types
