# Exercise 0.6 - New Note in Single Page App Diagram

```mermaid
sequenceDiagram
    participant user
    participant browser
    participant server

    user->>browser: Writes a new note
    user->>browser: Clicks Save button

    Note right of browser: JavaScript handles the form submission

    Note right of browser: JavaScript creates a new note object

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server

    Note right of browser: The note is sent as JSON data

    server-->>browser: HTTP 201 Created
    deactivate server

    Note right of browser: Browser updates the page without reloading
```