# Mój Grafik PWA v0.7

Przebudowany OCR grafiku zbiorczego:
- najpierw wykrywa geometrię nagłówka dni,
- wskazany wiersz dzieli na osobne komórki 1–31,
- każdą komórkę powiększa 5×, konwertuje do skali szarości i zwiększa kontrast,
- OCR działa osobno dla każdego dnia,
- nierozpoznany wpis = `?`, nigdy automatycznie „wolne”,
- ekran kontroli pokazuje miniaturę oryginalnej komórki obok wyniku,
- zachowane działające wczytywanie zdjęć z v0.6.3.

To nadal prototyp: przed eksportem wynik musi być skontrolowany.
