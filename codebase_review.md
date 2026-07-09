# Saikote Digital Studio — Codebase Review

---

## 🐛 Bugs & Errors

### 1. Unused dependencies in backend
[package.json](file:///d:/Alif/Saikote-Digital-Studio/backend/package.json#L13-L20) lists `mongoose`, `cookie-parser`, `morgan`, `debug`, and `express-validator` — none of them are imported anywhere in the codebase. Dead weight that bloats `node_modules` and the packaged Electron app.

### 2. Unused dependency in frontend
[package.json](file:///d:/Alif/Saikote-Digital-Studio/frontend/package.json#L14) lists `axios` but the API client ([client.js](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/api/client.js)) uses `fetch` exclusively.

### 3. JSX nesting mismatch in App.jsx
[App.jsx L19-28](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/App.jsx#L19-L28): `<Routes>` is inside `<main>` visually, but the closing tags are misaligned — `</main>` closes **after** `</Routes>`, yet `<Routes>` is dedented outside `<main>`'s opening indentation. Works by accident but is misleading and fragile.

### 4. `useToast` timer leak on unmount
[useToast.js](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/hooks/useToast.js#L10): `setTimeout` is never cleaned up if the component unmounts before the 3 s timer fires — will call `setToast` on an unmounted component.

### 5. `shadow-inner-shadow` CSS class is defined but never used
[index.css L12-15](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/index.css#L12-L15) defines it; no component references it.

### 6. `summary.model.js` — SQL injection via table name interpolation
[summary.model.js L4](file:///d:/Alif/Saikote-Digital-Studio/backend/models/summary.model.js#L3-L6): `sumWhere` concatenates `table` and `whereClause` directly into SQL strings. Currently safe because all callers pass hardcoded strings, but the pattern is risky — any future caller passing user input would introduce SQL injection.

### 7. Edit/update controllers swallow DB errors
[order.controller.js L37-48](file:///d:/Alif/Saikote-Digital-Studio/backend/controllers/order.controller.js#L37-L48) `editOrder` and [expense.controller.js L37-48](file:///d:/Alif/Saikote-Digital-Studio/backend/controllers/expense.controller.js#L37-L48) `editExpense` have no `try/catch`, so a DB error crashes the process. The `add` handlers have it, `edit` handlers don't.

### 8. `DocumentsList` re-fetches everything when `filterKind` changes, unnecessarily
[DocumentsList.jsx L72-74](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/components/DocumentsList.jsx#L72-L74): `filterKind` is in the `useEffect` dependency array and triggers `load()`, but kind filtering is purely client-side (line 78-79). The API call is wasted.

---

## 🔁 Repetitive / Duplicated Code

### 9. `orderReducer` and `expenseReducer` are identical logic
[formContext.jsx L24-48](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/contexts/formContext.jsx#L24-L48): Both reducers handle `UPDATE_FIELD`, `LOAD`, `RESET` with the exact same switch body — only the reset target differs. Should be a single factory function.

### 10. `order.controller.js` and `expense.controller.js` are copy-paste twins
[order.controller.js](file:///d:/Alif/Saikote-Digital-Studio/backend/controllers/order.controller.js) vs [expense.controller.js](file:///d:/Alif/Saikote-Digital-Studio/backend/controllers/expense.controller.js): ID parsing, 404 checks, validation pattern, and response shapes are identical across all 5 handlers. A generic CRUD factory would eliminate ~60 lines.

### 11. `todayString()` / `today()` helper duplicated 3 times
Defined independently in [DocumentsList.jsx L12](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/components/DocumentsList.jsx#L12), [Reports.jsx L7](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/components/Reports.jsx#L7), and the backend's [summary.controller.js L4](file:///d:/Alif/Saikote-Digital-Studio/backend/controllers/summary.controller.js#L4). Should be one shared utility.

### 12. Tab button styling is duplicated
[DocumentsList.jsx L127-131](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/components/DocumentsList.jsx#L127-L131) and [Reports.jsx L93-95](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/components/Reports.jsx#L93-L95) use the same active/inactive tab class pattern. Could be a `<TabButton>` component.

### 13. `toCamel` in both models
[order.model.js L3-20](file:///d:/Alif/Saikote-Digital-Studio/backend/models/order.model.js#L3-L20) and [expense.model.js L3-13](file:///d:/Alif/Saikote-Digital-Studio/backend/models/expense.model.js#L3-L13) each define their own `toCamel`. A generic snake→camel mapper utility would remove this duplication.

---

## 🗑️ Redundant Code

### 14. `Input` component double-checks `id === "photoNo"`
[Input.jsx L8, L11](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/components/Input.jsx#L7-L11): The parent `FormField` already calculates `isDisabled` based on `id === "photoNo"`, but `Input` checks it again internally. The `disabled` prop alone should be sufficient.

### 15. `order.model.js` `toRow` is partially redundant with validation
[order.model.js L22-33](file:///d:/Alif/Saikote-Digital-Studio/backend/models/order.model.js#L22-L33): `toRow` nullifies Lab fields when `printMethod !== "Lab"`, but `validate.js` already does the same conditional logic. The sanitization happens twice.

### 16. `Select` component has a redundant template literal
[Select.jsx L7](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/components/Select.jsx#L7): `` className={`rounded-sm ...`} `` — no interpolation, just use a plain string.

### 17. `ExpenseForm` re-maps category both on submit and in the validator
[ExpenseForm.jsx L44](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/components/ExpenseForm.jsx#L44) maps display→DB category, and [validate.js L65](file:///d:/Alif/Saikote-Digital-Studio/backend/lib/validate.js#L65) also strips `expenseType` for salary. The mapping responsibility is split across two layers.

---

## ⚠️ Design Concerns (Minor)

### 18. `Form` and `ExpenseForm` list keys use array `index` instead of `input.id`
[Form.jsx L49, L54](file:///d:/Alif/Saikote-Digital-Studio/frontend/src/components/Form.jsx#L48-L54): Using `index` as React key is fine here since the list is static, but using `input.id` would be more semantically correct and defensive.

### 19. No global error boundary
A single unhandled React error will white-screen the entire Electron app with no recovery path.

### 20. `dotenv.config()` in backend is unnecessary inside Electron
[app.js L10](file:///d:/Alif/Saikote-Digital-Studio/backend/app.js#L10): When packaged, there's no `.env` file. Harmless but misleading — the only env var (`DB_PATH`) is set by the Electron main process directly.

---

## Summary Table

| # | Severity | Category | File(s) |
|---|----------|----------|---------|
| 1 | 🟡 Medium | Unused deps | `backend/package.json` |
| 2 | 🟡 Medium | Unused dep | `frontend/package.json` |
| 3 | 🟢 Low | Nesting | `App.jsx` |
| 4 | 🟡 Medium | Memory leak | `useToast.js` |
| 5 | 🟢 Low | Dead code | `index.css` |
| 6 | 🟡 Medium | SQL pattern risk | `summary.model.js` |
| 7 | 🔴 High | Missing error handling | Both controllers |
| 8 | 🟡 Medium | Unnecessary refetch | `DocumentsList.jsx` |
| 9 | 🟡 Medium | Duplication | `formContext.jsx` |
| 10 | 🟡 Medium | Duplication | Both controllers |
| 11 | 🟢 Low | Duplication | 3 files |
| 12 | 🟢 Low | Duplication | 2 components |
| 13 | 🟢 Low | Duplication | Both models |
| 14 | 🟢 Low | Redundant logic | `Input.jsx` |
| 15 | 🟢 Low | Redundant logic | `order.model.js` + `validate.js` |
| 16 | 🟢 Low | Redundant syntax | `Select.jsx` |
| 17 | 🟢 Low | Split responsibility | `ExpenseForm.jsx` + `validate.js` |
| 18 | 🟢 Low | React key | `Form.jsx` |
| 19 | 🟡 Medium | Resilience | No error boundary |
| 20 | 🟢 Low | Redundant call | `app.js` |
