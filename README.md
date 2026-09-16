# Mój Grafik PWA v0.7.1

Wersja naprawcza grafiku zbiorczego.

Zmiany:
- OCR nie próbuje już rozpoznawać numerów dni 1–31 w nagłówku.
- Użytkownik ustawia 4 granice: górę i dół własnego wiersza oraz początek dnia 1 i koniec ostatniego dnia.
- Aplikacja dzieli wskazany zakres matematycznie na 28/29/30/31 równych komórek.
- Niebieskie linie pokazują poziomy zakres dni; zielona ramka pokazuje analizowany obszar.
- Każda komórka jest powiększana 6× przed OCR.
- Nierozpoznany wpis pozostaje `?`.
- Po wybraniu nowego zdjęcia czyszczona jest stara diagnostyka i poprzedni wynik.

Przed eksportem wynik nadal wymaga kontroli.
