# Ju Menezes Beauty — demo source (`/demo/juliana-menezes-01`)

Three single-page concepts (Noir, Atelier, Fúcsia) for Juliana Menezes (@unhasdajuboston).

- `templates/*.html` — page templates; `[[pt||en]]` marks bilingual strings, `{{…}}` are filled by the builder
- `img/` — photos prepared by `prep.py` from her public asset pack
- `gallery.html` — the chooser page published at the slug root

```
python3 -I build.py dev       # local pages beside img/
python3 -I build.py publish   # writes jp-web-design/public/demo/juliana-menezes-01 + _shared/juliana-menezes
```
