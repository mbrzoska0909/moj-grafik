# Mój Grafik PWA v0.6.3

Wersja naprawcza.

Znaleziony konkretny błąd:
v0.6–v0.6.2 zawierały pozostałość po starszym ekranie (`#parseBtn`). Tego elementu nie ma już w aktualnym HTML, więc JavaScript zatrzymywał się natychmiast przy starcie. Z tego powodu nie działał wybór zdjęcia, przełączanie trybu ani napis „Moduł zdjęć: gotowy”.

v0.6.3:
- usuwa błąd startowy,
- zabezpiecza starszy handler,
- naprawia brakujące funkcje używane przez ekran kontroli,
- naprawia tabelę reguł,
- zachowuje dwa tryby grafiku,
- zachowuje poprawioną obsługę zdjęć iPhone,
- pokazuje „Moduł zdjęć: gotowy ✓”, jeśli cały JS wystartował.
