# Devretme Notu — Mensa Yapı sitesi

Bu dosya, projeyi başka bir makinede kaldığı yerden sürdürmek için yazıldı.
Konuşma geçmişi taşınamadığı için burada **neyin neden öyle yapıldığı** ve
**nelerin açık kaldığı** kayıtlı.

Son güncelleme: 26 Ağustos 2026

---

## Durum

Site tamamlanmış ve çalışır hâlde. `index.html` + `assets/` + `img/`, derleme
adımı yok. Kaynak, 2.61 MB'lık tek dosyalık bir React sayfasından (`index1.html`,
`Downloads` klasöründe duruyor) yeniden yazıldı.

İlk yükleme **2.61 MB → 405 KB**. Masaüstü sayfa yüksekliği 7.723px,
mobil 10.823px.

## Yerel önizleme

```bash
cd mensa && python -m http.server 8788
```

`file://` ile açarsanız site çalışır ama **Google Haritalar iframe'i yüklenmez**
— tarayıcılar `file://` sayfalarına opak origin atayıp harici iframe gömmeyi
engeller.

---

## Kolay unutulan kararlar

Bunlar keyfi değil; her biri ölçülmüş bir sorunun çözümü.

### Marka renginin koyu zemin için ayrı tonu var

`--brand: #5C221A` koyu zeminde (`#14110F`) yalnızca **1.52:1** kontrast verir
ve WCAG AA'da (4.5:1) kalır. Bu yüzden `--brand-on-dark: #CC6557` (4.98:1) ayrı
bir jeton olarak duruyor. Marka rengini değiştirirseniz **üçünü birden**
güncelleyin: `--brand`, `--brand-hover`, `--brand-on-dark` — ayrıca
`index.html`'deki `theme-color` ve `site.webmanifest`'teki `theme_color`.

Jeton adı `--brand-dark` değil `--brand-hover`: yeni marka rengi %23 aydınlıkta,
hover'da daha da koyulaştırmak görünür bir geri bildirim vermiyordu, bu yüzden
hover tonu marka renginden **açık**.

### Ürün maskelemesinde `transform` kullanılmaz

`.product-media img` üzerindeki `media-wipe` animasyonu **yalnızca `clip-path`**
animasyonlar. Sebep: `animation-fill-mode: both` olan bir animasyon bittikten
sonra da değerini tutar ve kaskadda normal bildirimleri yener. Maskeye
`transform` eklenirse `.product:hover img { scale(1.05) }` çalışmaz olur.

### Kaydırmaya bağlı animasyonlarda `animation-delay` etkisizdir

`animation-timeline: view()` kullanan animasyonlarda zaman saniye değil kaydırma
konumudur. Kademelendirme `animation-range` başlangıcı kaydırılarak yapılır —
`--i` değişkeni `nth-child` ile atanıp `calc()` içinde kullanılıyor.

### `<figure>` marjı sıfırlanmalı

Tarayıcı varsayılanı `1em 40px`. `.gallery figure { margin: 0 }` satırı
silinirse galeri görselleri ızgara hücresinden 80px dar kalır — bu hata bir kez
fark edilmeden kaldı.

### Hero manşetindeki iki `<span>` arasında **boşluk karakteri var**

`</span> <span>` — kasıtlı. Masaüstünde `display: block` olduğu için görünmez,
ama mobilde `display: inline` yapılıyor ve boşluk olmazsa
"ProjelerinizdeGüvenilir" diye birleşir.

### Dokunmatik cihazlar

Durum değiştiren hover'lar `@media (hover: hover)` içinde. Dışına çıkarılırsa
dokunulan kart/karo "yapışık" kalır. (Marka logoları artık her zaman renkli;
gri tonlama kaldırıldı, hover'da karo büyüyor.)

### `apple-touch-icon.png` bilerek saydam değil

iOS ana ekran simgelerinde alfayı yok sayıp arkasına siyah koyar.

---

## Açık konular

### 0. Beş ürün kartının fotoğrafı eksik

Ürün grupları 12 kategoriye çıktı; 7'sinde fotoğraf var, beşinde yer tutucu:
**Dökme Malzemeler, Demir – Profil, Kereste Grubu, Mantolama Malzemeleri,
Nalbur – Hırdavat.** `yeni fotolar/` klasöründeki 25 fotoğrafta bu ürünler
yok. Yerleştirme yöntemi README'de "Kart görselleri" başlığı altında.




### 1. Mobil tasarım onay bekliyor

Kullanıcı mobil görünümü beğenmedi ("genel"). İki tur yapıldı:

- **1. tur** — uzunluk 14.781 → 10.946px. Ama bu **sıkıştırmaydı, tasarım
  değil**: ürün görseli 2:1'e basıldı, marka logoları 44px'e küçültüldü,
  referans metni 13px'e indi. Kalite düştü.
- **2. tur** (son) — kalite geri verildi, uzunluk **yerleşimle** kazanıldı:
  marka ızgarası yatay kaydırmalı iki sıralı şeride dönüştü
  (1.113px → **179px**), ürün görseli 3:2'ye ve logolar 52px'e döndü.
  Sayfa 10.823px.

Tümü `assets/style.css` içindeki **6. MOBİL DÜZEN** bloğunda. Beğenilmezse o
blok tek parça silinebilir.

**Bu son hâli kullanıcı henüz görmedi.**

### 2. Depo durumu — `D:\claude1` (bu siteyle ilgisiz)

Kullanıcı "commit'le ve push'la" dedi, **uygulanmadı** çünkü:

- `origin` → `github.com/shanraisshan/claude-code-best-practice` — **başkasının**
  halka açık deposu (kullanıcı: `salih_agac`)
- Yerel `main`, `origin/main`'in **1.897 commit gerisinde** → push reddedilir
- Commit'lenmeyi bekleyen 147 dosyanın çoğu ilgisiz kişisel proje
  (`quantlab/`, `.agents/`, `shorts-factory/`, `outputs/`)
- `.claude/settings.json` **401 satır siliyor** — hooks yapılandırmasının
  tamamı. Kasıtlı mı, teyit bekliyor.
- 3 adet SQLite dry-run veritabanı (`-wal`/`-shm` dâhil) commit kapsamında

Sır taraması temiz: `.env`, kimlik bilgisi, API anahtarı yok.

### 3. Bu proje sürüm kontrolünde değil

`mensa/` klasörü hiçbir git deposunda değil. Makineler arası taşıma için
kendi deponuzu açmak en sağlıklısı.

---

## Görülmeyen kısım

Bu proje boyunca site **görsel olarak doğrulanamadı** — çalışma ortamında
ekran görüntüsü alınamıyordu. Her şey ölçümle doğrulandı (geometri, kontrast
oranları, hesaplanmış stiller, animasyon bağlantıları). Bu yüzden:

- Yerleşim, kontrast, erişilebilirlik ve boyutlar **ölçülerek** doğrulandı
- Estetik (renk dengesi, boşluk hissi, kartların duruşu) **doğrulanmadı**

Ayrıca kaydırmaya bağlı animasyonlar ve `IntersectionObserver` o ortamda hiç
tetiklenmiyordu, çünkü panel kare işlemiyordu. Doğru bağlandıkları
doğrulandı, **görüntüleri değerlendirilmedi**.
