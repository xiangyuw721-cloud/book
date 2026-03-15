# Product Requirements Document (PRD) - Book Share Generator

## 1. Project Overview
The "Book Share Generator" is a web application designed to help users create natural, deep, and personalized book sharing content. It aims to eliminate the "AI flavor" often found in generated text, making the output sound more like a genuine reader's reflection.

## 2. Core Features

### 2.1 User Input
- **Book Name (Required):**
  - Input field pre-filled with book title marks `《 》`.
  - User enters the name of the book.
- **Author (Optional):**
  - Input field for the author's name to help identify the book.
- **Personal Experience (Optional):**
  - Text area for users to input their own stories or feelings related to the book.
  - This input is critical for the "Partial Share" mode to generate specific citations.

### 2.2 Generation Modes
- **Full Book Share:**
  - Generates a comprehensive review or summary of the entire book.
  - Focuses on overall themes, impact, and general recommendations.
- **Partial Share:**
  - Focuses on specific aspects or chapters.
  - **Requirement:** If "Personal Experience" is provided, the AI must intelligently associate it with specific content in the book and cite it (e.g., "quoting the view from Chapter X/Page Y").

### 2.3 Output Quality ("De-AI")
- **Tone:** Colloquial, natural, emotional, and authentic.
- **Style:** Avoids stiff, academic, or obviously machine-generated phrasing.
- **Content:** Must be grounded in the actual content of the book (no hallucinations).

### 2.4 Book Verification (Phase 2 - Postponed)
- *Note: This feature is currently postponed. In Phase 1, we will trust the user's input, but the AI should still attempt to verify the book exists within its knowledge base to avoid hallucinating content for non-existent books.*

## 3. User Interface (UI)
- **Design Style:** Clean, modern, and focused on reading/writing.
- **Layout:**
  - Header: Title and simple description.
  - Form:
    - Book Name input (prominent).
    - Author input.
    - Personal Experience textarea.
  - Action Area: Two distinct buttons for "Full Share" and "Partial Share".
  - Result Area: Display the generated text with a "Copy" button.

## 4. Technical Constraints
- **AI Model:** Google Gemini API.
- **Deployment Platform:** Zeabur.
