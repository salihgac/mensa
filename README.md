# Mensa Yapı Malzemeleri A.Ş. — Kurumsal Site

Tek sayfalık statik site. Derleme adımı, bağımlılık, çerçeve yok — dosyaları
herhangi bir statik sunucuya kopyalamak yeterli.

## Dosya yapısı

```
mensa/
├── index.html          ← tek kaynak; tüm metinler burada
├── favicon.ico         ← 16/32/48 tek dosyada (kök dizinde durmalı)
├── site.webmanifest
├── assets/
│   ├── style.css       ← tasarım jetonları + bileşenler
│   └── app.js          ← mobil menü, başlık gölgesi, gezinme vurgusu
└── img/
    ├── logo.webp             açık zemin için logo
    ├── logo-beyaz.webp       koyu zemin için (saydam, beyaz)
    ├── apple-touch-icon.png  180×180, iOS ana ekran
    ├── icon-192.png          Android / manifest
    ├── icon-512.png          Android / manifest
    ├── hero-depo.webp        + -700w varyantı
    ├── hakkimizda.webp       + -600w / -900w / -1400w varyantları
    ├── urun/     (6)   ürün grubu görselleri
    ├── galeri/   (5)   depo fotoğrafları
    └── marka/    (32)  marka logoları
```

### Favicon hakkında

Simgeler logonun **yazı kısmından değil, soldaki kare işaretinden** üretildi —
"mensa" yazısı 16px'te okunmaz lekeye döner.

İşaret **saydam zemin** üzerinde marka renginde (`#9A3B26`). Terracotta tonu
beyaz, gri ve koyu sekme zeminlerinin üçünde de okunur; koyu bir işaret koyu
sekmede kaybolurdu.

**`apple-touch-icon.png` bilerek saydam değildir.** iOS ana ekran simgelerinde
alfa kanalını yok sayar ve arkasına **siyah** koyar; saydam bırakılsaydı simge
siyah bir kutu içinde görünürdü. Bu dosya açık zeminle (`#F7F4F1`) kaydedildi.

`favicon.ico` **site kökünde** kalmalı: tarayıcılar `<link>` etiketi olmasa
bile `/favicon.ico` adresini isterler.

Simgeleri değiştirmek gerekirse dördü birden yenilenmeli: `favicon.ico`,
`img/apple-touch-icon.png`, `img/icon-192.png`, `img/icon-512.png`.

## Yayına alma

Dizinin tamamını statik hosting'e yükleyin — Netlify, Vercel, Cloudflare
Pages, GitHub Pages veya klasik cPanel/FTP. Sunucu tarafı gereksinimi yoktur.

Yerel önizleme:

```bash
python -m http.server 8000
```

> `index.html`'i çift tıklayıp `file://` ile de açabilirsiniz, ancak Google
> Haritalar `<iframe>`'i bu modda yüklenmez. Gerçek görünüm için yerel sunucu
> kullanın.

## İçerik düzenleme

`index.html` düz HTML'dir; metinler doğrudan orada değiştirilir. Şablon dili
veya derleme yoktur — dosyayı düzenleyip kaydetmek yeterli.

Sık değişen yerler:

| Ne | Nerede |
|---|---|
| Telefon numaraları | `tel:` bağlantıları (5 yerde: başlık, iletişim ×2, footer ×2) |
| Adres | `<address>` etiketleri (iletişim + footer) ve JSON-LD |
| Ürün grupları | `<article class="product">` blokları |
| Marka logoları | `<ul class="brands">` + `img/marka/` |
| Referanslar | `<ul class="refs">` |

Yeni marka eklerken: görseli `img/marka/` içine koyun ve listeye
`width`/`height` değerleriyle birlikte bir `<li>` ekleyin. Bu ölçüler yer
kaymasını (CLS) önlediği için atlanmamalı.

### Renk veya tipografi değişimi

`assets/style.css` başındaki `:root` bloğundaki jetonlar tüm siteyi besler.
Marka rengini değiştirmek için üç değişkeni birlikte güncelleyin:

```css
--brand:         #9A3B26;   /* açık zeminde     */
--brand-dark:    #7A2B18;   /* hover            */
--brand-on-dark: #D26047;   /* koyu zeminde     */
```

`--brand-on-dark` ayrı durur çünkü `#9A3B26` koyu zeminde yalnızca **2.71:1**
kontrast verir ve WCAG AA'da (4.5:1) kalır. Açılmış ton aynı renk tonunu
korur, kontrastı 4.93:1'e çıkarır.

## Erişilebilirlik

Doğrulanmış durum:

- Tüm metin/zemin çiftleri WCAG 2.1 **AA** (≥4.5:1) — ölçülen aralık 4.74–5.75
- Tüm dokunma hedefleri **≥44×44px** (masaüstü ve mobil)
- Tek `<h1>`, düzgün başlık hiyerarşisi, `header`/`main`/`nav`/`footer` işaretleri
- Klavye: "İçeriğe geç" bağlantısı, her etkileşimli öğede `:focus-visible`
- Mobil menü `aria-expanded` / `aria-controls` ile; Escape kapatır
- `prefers-reduced-motion` tüm animasyonları kapatır
- Her `<img>` üzerinde `alt`, `width`, `height`

## Yenilemede başa dönme

`index.html`'in `<head>` bölümünde küçük bir **satır içi** betik var. Yerinin
önemi var: tarayıcının kaydırma konumunu geri yüklemesi ve `#hash` hedefine
atlaması sayfa ayrıştırılırken olur. Aynı kodu `app.js` içine (defer) koymak
geç kalır ve kullanıcı önce zıplamayı görür, sonra düzeltilir.

Davranış `performance` gezinme tipine göre ayrışır:

| Nasıl gelindi | Sonuç |
|---|---|
| Yenileme (F5 / Ctrl+R) | Başa döner, `#hash` adres çubuğundan temizlenir |
| Normal açılış | Başa açılır |
| Paylaşılan `site.com/#iletisim` | **İletişim bölümüne iner** — bozulmaz |
| Geri / İleri | Tarayıcı davranışı korunur |

Yani "yenilemede başa dön" isteği, paylaşılan bölüm bağlantılarını
çalışmaz hâle getirmeden karşılanıyor.

## Tarayıcı davranışı

JavaScript kapalıysa site tam işlevseldir: bağlantılar çapa, menü geniş
ekranda zaten açıktır. `app.js` yalnızca iyileştirme katmanıdır.

## Animasyonlar

Tamamı `assets/style.css` içindeki **5. Hareket** bölümünde, `prefers-reduced-
motion` koruması altında. Bu tercihi açan kullanıcı hiçbir hareket görmez.

| Ne | Nasıl |
|---|---|
| Kaydırınca beliriş (84 öğe) | `animation-timeline: view()` |
| Izgara içi kademeli dalga | `animation-range` kaydırma, `--i` değişkeni |
| Kaydırma ilerleme çubuğu | `animation-timeline: scroll()` |
| Başlık + logo küçülmesi | `animation-timeline: scroll()`, 0–170px |
| Hero girişi | klasik `@keyframes` + gecikme |
| Hero sayaçları | `app.js`, `requestAnimationFrame` |
| Ürün görselinde maskeleme | `clip-path` + `view()` |
| Galeri parallax (≥1000px) | `animation-timeline: view()`, `cover` aralığı |
| Hover: kart kaldırma, görsel zoom, ok kayması | `transition`, `@media (hover: hover)` |

Üç nokta dikkat gerektirir:

**Kaydırmaya bağlı animasyonlarda `animation-delay` çalışmaz.** Kademelendirme
`animation-range` başlangıcını kaydırarak yapılır — bu yüzden `--i` değişkeni
`nth-child` ile atanıp `calc()` içinde kullanılıyor.

**Beliriş öğeleri `class="reveal"` ile işaretlenir.** Yeni bölüm eklerken bu
sınıfı vermeniz yeterli; ayrıca CSS yazmanız gerekmez.

**Firefox'ta `animation-timeline` henüz yok.** `app.js` bunu algılar, `<html>`
öğesine `.js-reveal` ekler ve `IntersectionObserver` ile aynı etkiyi verir.
JavaScript de kapalıysa hiçbir gizleme kuralı devreye girmez — içerik baştan
görünür kalır. Hiçbir koşulda görünmez içerik oluşmaz.

Sayaçların hedef değerleri HTML'de `data-to` ile durur, görünen metin ise
son değerdir (`6.500`). JavaScript çalışmazsa doğru rakam zaten ekrandadır.

### Dokunmatik cihazlar

Durum değiştiren hover'lar (kart kaldırma, görsel zoom, marka gri tonlaması,
referans inversiyonu, ok kayması) `@media (hover: hover)` içindedir. Sebep iki
yönlü: dokunmatikte `:hover` tetiklenemediği için marka logoları kalıcı gri
kalırdı; tetiklendiğinde ise dokunulan öğede "yapışıp" kalırdı.

Galeri parallax'ı yalnızca **1000px ve üzeri** ekranlarda çalışır. Dar ekranda
tek sütun ve kısa hücrelerde derinlik değil titreme gibi okunur.

### Değiştirirken dikkat

Ürün görselinin maskelemesi **yalnızca `clip-path`** animasyonlar — `transform`
bilerek dışarıda bırakılmıştır. `animation-fill-mode: both` olan bir animasyon
bittikten sonra da değerini tutar ve kaskadda normal bildirimleri yener; maskeye
`transform` eklenirse `.product:hover img` içindeki `scale(1.05)` çalışmaz olur.

Galeri parallax'ında görsel, hücresinden **%20 uzundur** (`height: 120%`,
`top: -10%`) ve `figure` onu kırpar. Kaydırma miktarını %7'nin üzerine
çıkarırsanız bu pay yetmez ve görselin altında boşluk açılır.
