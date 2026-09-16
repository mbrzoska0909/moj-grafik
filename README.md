# Mój Grafik PWA v0.6.2

Naprawa wyboru zdjęć na iPhone:
- natywny input pliku przykrywa cały przycisk (bez pośredniego kliknięcia label),
- obsługa zarówno `input`, jak i `change`,
- `createImageBitmap` + fallback do blob URL,
- status pojawia się natychmiast po faktycznym przekazaniu pliku,
- diagnostyka „Moduł zdjęć: gotowy ✓” potwierdza załadowanie nowego JavaScript,
- tymczasowo wyłączone agresywne cache PWA, żeby GitHub Pages nie podawał starej wersji.

Jeśli po wybraniu zdjęcia nie pojawi się nawet komunikat „Plik został wybrany”, problem jest przed handlerem JS (picker/PWA/cache), co będzie od razu widoczne diagnostycznie.
