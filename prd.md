d# PRD: Minimalist Flashcard Application

## 1. Executive Summary
A streamlined, high-performance web application designed for focused learning. This tool is engineered to remove cognitive friction, allowing users to efficiently manage, organize, and review knowledge through flashcards. By prioritizing a "Quiet Luxury" aesthetic and an intuitive bulk-import workflow, the application targets high-efficiency learners who value clean design and technical performance.

## 2. Product Objectives
- **Operational Efficiency:** Minimize the time lapse between opening the application and beginning a study session.
- **Cognitive Clarity:** Eliminate interface noise and unnecessary interactive elements to ensure full user concentration.
- **Data Portability:** Enable rapid ingestion of study material via structured bulk CSV importing to prevent data entry bottlenecks.

## 3. Core Features (MVP)
### 3.1 Deck Management (CRUD)
- **Create:** Initialize new decks with unique titles and optional descriptions.
- **Update/Edit:** Modify deck metadata or rename existing collections.
- **Delete:** Remove decks with confirmation to prevent accidental data loss.
- **Hierarchy:** Implicit organization of flashcards nested within parent decks.

### 3.2 Card Management & Data Ingestion
- **Manual Entry:** Form-based addition for individual cards.
- **Bulk Import (Core):** A dedicated interface for uploading `.csv` files. The system will sanitize, validate, and parse these files before batch-committing them to the database.
- **Input Validation:** Enforced checks to ensure every card contains valid non-empty fields for both "soal" (question) and "jawaban" (answer).

### 3.3 Study Mode (The Review Engine)
- **Interactive Carousel:** Sequential navigation through card decks.
- **Flip Interaction:** Triggered 3D CSS animation to reveal the "jawaban" side of the card.
- **Progress Tracking:** Real-time indicator showing current progress (e.g., Card 5 of 20).

## 4. Technical Architecture
- **Framework:** Next.js (App Router) to leverage Server-Side Rendering (SSR) for fast initial load times and optimized routing.
- **Database:** Supabase (PostgreSQL) for scalable, reliable relational data storage.
- **ORM:** Prisma, ensuring type-safe interactions between the backend and the database.
- **CSV Processing:** `papaparse` for robust, high-performance CSV parsing directly on the client side before submission.
- **Styling:** Tailwind CSS, utilizing a utility-first approach to maintain a consistent design system.

## 5. CSV Specification (Developer Contract)
To maintain data integrity, all imports must adhere to the following strict format:
- **Delimiter:** Comma (`,`)
- **Encoding:** UTF-8
- **Required Header:** `soal,jawaban`
- **Example Data:**
  ```csv
  soal,jawaban
  "What is React?","A JS library for UI."
  "Define State","Data that changes over time."