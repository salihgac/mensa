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
    ├── slogan.png            "Her Yapının Temelinde, Mensa" — saydam,
    │                         gri+alfa (LA) PNG, kurumsal PDF'ten çıkarıldı
    ├── logo.png              açık zemin için logo — saydam, alt satırsız
    ├── logo.webp             öncesi: beyaz zeminli, "YAPI MALZEMELERİ A.Ş."
    │                         satırlı orijinal (artık kullanılmıyor)
    ├── logo-beyaz.webp       koyu zemin için (saydam, beyaz)
    ├── apple-touch-icon.png  180×180, iOS ana ekran
    ├── icon-192.png          Android / manifest
    ├── icon-512.png          Android / manifest
    ├── hero-hava.webp        2000w + -1600w / -1200w / -800w varyantları
    │                         (havadan depo görünümü, 16:9)
    │                         Ad bilerek değişti: eski dosya da hero-depo.webp
    │                         idi, aynı adla değiştirilince tarayıcılar eski
    │                         görseli önbellekten sunmaya devam ediyordu.
    ├── hakkimizda.webp       ARTIK KULLANILMIYOR (+ -600w / -900w / -1400w,
    │                         toplam 480 KB) — Hakkımızda görseli slogan
    │                         paneliyle değiştirildi, dosyalar silinmedi
    ├── urun/     (6)   ürün grubu görselleri
    ├── galeri/   (5)   depo fotoğrafları
    └── marka/     (38)   marka logoları — 400×175, beyaz zemin
        ├── eski/            PDF'ten kesilmiş ilk sürüm (çerçeve artıklı)
        └── kaynak/          logoların ham hâlleri (PNG/SVG)
```

### Başlık logosu hakkında

Başlıkta `img/logo.png` kullanılır. Orijinal `logo.webp` beyaz zeminliydi ve
işaretin sağında, `mensa` yazısının altında **"YAPI MALZEMELERİ A.Ş."**
satırını taşıyordu. Yeni dosyada ikisi de yok: beyaz zemin alfa kanalına
çevrildi (kenar yumuşatma korunarak), alt satır silindi. Kutu
**500×182 → 419×109**.

Bu oran değişimi CSS'i ilgilendirir: `.logo-link img` yüksekliğe göre
ölçeklenir, dolayısıyla eski yükseklik aynen bırakılsaydı işaret bir anda
~1,7 kat büyürdü. Yükseklik `clamp(38px, 3.4vw, 50px)` → `clamp(36px, 3vw, 46px)`
yapıldı. 1440px'de logo **166×43px** çiziliyor (eski hâli 137×50 idi):
görünür işaret ve yazı belirgin biçimde büyük, başlık yüksekliği ise
değişmiyor — `.logo-link { min-height: 44px }` dokunma hedefi tabanı hâlâ
belirleyici. Kaydırma küçülmesi (`@keyframes logo-shrink`) eski 0,72 oranını
koruması için 36px → 33px.

Logoyu büyütmek/küçültmek isterseniz **tek yer** `assets/style.css` içindeki
`.logo-link img` yüksekliğidir; genişlik `width: auto` ile kendiliğinden gelir.

Alt satır silinince `mensa` yazısı işaretin dikey ortasından **4,5px yukarıda**
kaldı — çünkü orijinalde yazı, kendisi ve alt satırın oluşturduğu bloğa göre
konumlandırılmıştı. Yazı 4,5px aşağı kaydırılarak iki parçanın dikey merkezi
eşitlendi (ikisi de 54,0). Yeniden üretmek gerekirse bu adım atlanmamalı.

Dosya PNG olarak istendi (19,1 KB). Palete indirmek 3,9 KB'a düşürüyor ama
işaretteki terracotta geçişte bantlanma yapıyor, bu yüzden RGBA bırakıldı.

Koyu zeminde kullanılan `logo-beyaz.webp` **dokunulmadı** — footer'daki logoda
alt satır hâlâ duruyor.

### Favicon hakkında

Simgeler logonun **yazı kısmından değil, soldaki kare işaretinden** üretildi —
"mensa" yazısı 16px'te okunmaz lekeye döner.

> **Dikkat — simgeler eski marka renginde.** Marka rengi `#9A3B26`'dan
> `#5C221A`'ya çekildi ama `favicon.ico`, `apple-touch-icon.png`, `icon-192`,
> `icon-512` ve `img/logo.png` içindeki ev şekli hâlâ eski terracotta tonunda.
> Bunlar marka varlığı olduğu için CSS jetonuyla birlikte otomatik değişmez;
> yeniden üretilmeleri ayrı bir karardır.

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
| Çalışma saatleri | `<dl class="footer-hours">` **ve** JSON-LD `openingHoursSpecification` — ikisi birlikte güncellenmeli |
| Ürün grupları | `<article class="product">` blokları |
| Marka logoları | `<ul class="brands">` + `img/marka/` |
| Referanslar | `<ul class="refs">` |

Yeni marka eklerken: görseli `img/marka/` içine 400×175 beyaz zeminli WebP
olarak koyun ve listeye şu yapıda bir `<li>` ekleyin:

```html
<li class="reveal"><span><img src="img/marka/<slug>.webp" width="400" height="175"
    loading="lazy" decoding="async" alt="Marka Adı"></span></li>
```

`<span>` **zorunlu** — hover'daki büyüme ona uygulanıyor, sebebi "Marka ızgarası"
bölümünde. `width`/`height` de atlanmamalı, yer kaymasını (CLS) önlüyorlar.

### Çalışma saatleri

Şu an: **Pazartesi – Cumartesi 08:00 – 18:00, Pazar kapalı.**

Aynı bilgi **iki yerde** duruyor ve ikisi birlikte güncellenmeli:

1. Footer'daki görünür blok — `<dl class="footer-hours">`
2. `<head>` içindeki JSON-LD — `openingHoursSpecification`

İkisi çeliştiğinde Google yapılandırılmış veriyi esas alır ve arama sonucunda
yanlış "Açık / Kapalı" gösterir. Pazar günü JSON-LD'de `opens` ve `closes`
alanlarının ikisi de `"00:00"` — schema.org'da "o gün kapalı"nın yazılış
biçimi bu, silmek değil.

Blok, footer ızgarasında **marka sütununda** durur. Sütun yükseklikleri
ölçüldüğünde marka 235px ile en kısaydı (diğerleri 303/303/269); saatler oraya
konunca 352px'e çıkıp sütunlar dengelendi. İletişim sütununa eklenseydi o sütun
~350px'e çıkıp tek başına taşardı.

### Renk veya tipografi değişimi

`assets/style.css` başındaki `:root` bloğundaki jetonlar tüm siteyi besler.
Marka rengini değiştirmek için üç değişkeni birlikte güncelleyin:

```css
--brand:       #5C221A;   /* açık zeminde   11.28:1 */
--brand-hover: #7E3025;   /* hover           8.20:1 */
--brand-on-dark: #CC6557; /* koyu zeminde    4.98:1 */
```

Ayrıca **`index.html`'deki `<meta name="theme-color">` ve
`site.webmanifest`'teki `theme_color`** de aynı değeri taşır — marka rengi
değişince o ikisi de güncellenmeli.

`--brand-on-dark` ayrı durur çünkü `#5C221A` koyu zeminde (`#14110F`) yalnızca
**1.52:1** verir; okunmaz. Açılmış ton aynı renk tonunu (7°) korur, kontrastı
4.98:1'e çıkarır.

`--brand-hover` jetonu marka renginden **daha açıktır** ve adı bu yüzden
`--brand-dark` değildir. Eski `#9A3B26` için "hover'da koyulaştır" mantıklıydı;
`#5C221A` zaten %23 aydınlıkta, daha da koyulaştırmak kullanıcıya hiçbir geri
bildirim vermiyordu.

### Hero görseli

`yeni fotolar/ana foto.jpg` (5207×4021, havadan depo görünümü) kaynak alındı.
**16:9'a kırpıldı** — dikey merkez avlunun ortasına (`%56`) oturtuldu, üstten
gökyüzünün bir kısmı ve alttan yol payı atıldı. Dört boy üretildi:

| Dosya | Boyut | Ağırlık |
|---|---|---|
| `hero-hava.webp` | 2000×1125 | 303 KB |
| `hero-hava-1600w.webp` | 1600×900 | 206 KB |
| `hero-hava-1200w.webp` | 1200×675 | 123 KB |
| `hero-hava-800w.webp` | 800×450 | 58 KB |

**Öncesi tek bir 900×1200 dosyaydı (347 KB) ve dikeydi.** Geniş ekranda iki
kattan fazla büyütülüyordu — hâlbuki bu, sayfanın LCP görseli. Yeni set hem
daha keskin hem daha hafif: mobilde 800w → 58 KB (öncesi 700w → 174 KB),
1440px masaüstünde 1600w → 206 KB.

Kalite 68'de tutuldu; üzerine gelen `.hero::after` gradyanı soldan sağa
%90 → %28 karartma yaptığı için sıkıştırma izleri görünmüyor.

**Kırpımın kompozisyonu kasıtlı:** gradyan solda en koyu, metin orada duruyor;
sağdaki depo çatısındaki mensa tabelası gradyanın açık ucuna denk geliyor ve
görünür kalıyor. Görseli değiştirirseniz bu dengeye dikkat edin — ilgi çekici
öğe sağda olmalı.

#### Gradyan ve yükseklik

Hero yüksekliği `clamp(30rem, 62vh + 8rem, 47.5rem)` → **`clamp(34rem, 78vh +
6rem, 55rem)`**. 1440×900'de 694px → **798px**. Mobilde (bölüm 6)
`34rem` → `40rem`.

Gradyan üç duraktan **dört durağa** çıktı ve sağ taraf açıldı:

```css
/* önce */ 0.90 @0%, 0.66 @45%, 0.28 @100%
/* sonra */ 0.88 @0%, 0.66 @42%, 0.28 @68%, 0.04 @100%
```

Sebep: **metin ekranın yalnızca sol %60'ında.** Sağı karartmanın kontrast
gerekçesi yok. Sol iki durak metin için aynen korundu, sağ taraf serbest
bırakıldı — sağ yarıdaki ortalama karartma **%42'den %20'ye** indi.

Değerler tahminle değil, **gerçek metin kutuları ölçülerek** seçildi: fotoğraf
gradyanla birleştirilip her metin öğesinin bulunduğu dikdörtgende 95. yüzdelik
parlaklık alındı, o parlaklığa karşı metin renginin kontrastı hesaplandı.

| Öğe | Renk | Kontrast | Eşik |
|---|---|---|---|
| `h1` (74px) | `#fff` | 6.00 | 3.0 |
| Paragraf (20px) | `--on-dark` | 4.93 | 4.5 |
| Sayaç rakamı | `#fff` | 8.03 | 3.0 |
| Sayaç etiketi (15px) | `--on-dark-muted` | 5.33 | 4.5 |

**Bağlayıcı kısıt paragraf ve sayaç etiketi** — ikisi de normal punto, 4.5:1
istiyor. Gradyanı daha da açarsanız önce onlar düşer. Denenen bir sonraki
adım (`0.80/0.56/0.20`) paragrafı 3.89'a indiriyordu.

Durakların **%42 ve %68** konumları önemli: metin orada bitiyor. Metin bloğunun
genişliğini değiştirirseniz bu iki değeri de yeniden ölçün.

Mobil gradyan da aynı yöntemle açıldı — orada metin neredeyse tüm yüksekliği
kapladığı için yalnızca üstteki boş şerit açılabildi: **%60 → %33**.

`srcset` **dört yerde birden** tutarlı olmalı: `<img>` etiketi, `<head>`
içindeki `preload` bağlantısı, `og:image` ve JSON-LD `image` alanı.

Öncesi `img/eski/` altına taşındı.

### Ürün grupları: 12 kategori, karusel ve ürün listeleri

Bölüm 6 karttan **12 karta** çıktı. Kartlar **iki sayfa × 6** halinde yatay bir
karusel içinde; bir karta basınca o grubun ürün listesi katman olarak açılıyor.

**Açılıp kapanma CSS'te, `:target` ile.** Kart başlığındaki bağlantı
`#liste-<slug>` adresine gider, `.urun-liste:target` kuralı katmanı gösterir.
Yani **JavaScript kapalıyken de çalışır**. `app.js` yalnızca şunları ekler:
Escape ile kapatma, odağın katmana taşınıp kapanınca geri verilmesi, arka planın
kaydırılmaması. Hiçbiri olmasa da katman açılır ve kapanır (kapatma bağlantısı
`#urunler`'e gider).

Karusel de aynı mantıkta: ray `overflow-x: auto`, yani JS olmadan kaydırılabilir
ve dokunmatikte parmakla sürülür. Ok düğmeleri ve `1 / 2` sayacı HTML'de
`hidden` gelir, `app.js` açar — JS yoksa ölü kontrol olarak görünmesinler diye.
Kaydırma çubuğu yalnızca oklar devredeyken gizlenir (`[data-js]`), çünkü JS
kapalıyken tek kaydırma yolu odur.

**620px altında karusel tamamen kapanır.** Tek sütunda bir sayfa 6 kart
yüksekliğine çıkıyordu; onun yerine 12 kart alt alta akar, oklar gizlenir.

#### İçerik nereden geldi

`tüm ürünler.pdf` (Mensa Depo stok kartları dökümü, 1.914 satır). Ham adlar
**siteye olduğu gibi taşınmadı**, üç sebeple:

1. Adlar PDF'te **sütun genişliğinde kesilmiş** — "İNŞAAT ÇİVİSİ-8 LİK (1 KUTU 25"
   gibi, parantezi kapanmıyor. Kaynak veri eksik.
2. Dosyada **alış fiyatları** var. Siteye girmemeli.
3. İçinde `(DEFOLU)`, `ESKİ STOK`, `KULLANILMAYAN STOK`, `deneme stok`,
   `FİYAT FARKI` gibi iç kayıtlar ve tedarikçi cari kartları var.

Bunun yerine her grup için okunabilir listeler derlendi. Gruplandırma dökümdeki
`Grubu` sütunundan; `NAKLİYE` (584 satır), `İŞÇİLİK` ve `İŞ MAKİNASI` grupları
ürün olmadıkları için dışarıda bırakıldı.

#### Kart görselleri

**12 kategorinin 7'sinde fotoğraf var, 5'i hâlâ yer tutucu.**

Fotoğraflar `yeni fotolar/` klasöründeki 25 orijinalden üretildi: EXIF dönüşü
düzeltildi, 16:10'a ortadan kırpıldı, 900×563 WebP (q76) olarak kaydedildi.
Kartta ~341px çiziliyor, yani 2,6×. Yedisi toplam **~525 KB**, hepsi
`loading="lazy"` — ilk yükleme etkilenmiyor.

| Kategori | Kaynak |
|---|---|
| Torbalı Malzemeler | `YÜKLEME 2.jpg` |
| Tuğla Grubu | `IMG_3578` |
| Gazbeton Ürünleri | `GİRİŞ 1.jpg` — ürünlere yaklaşarak kırpıldı |
| Beton Elemanları | `IMG_3613` |
| Altyapı – PVC – Koruge | `IMG_3489` |
| Yalıtım Malzemeleri | `IMG_3550` |
| Yapı Kimyasalları | `IMG_3620` |

Gazbeton kartı düz ortadan değil, **ürünlere yaklaşarak** kırpıldı
(kaynak yüksekliğin %62'si, merkez x %58 / y %53). Düz ortadan kırpım kadrajın
yarısını gökyüzü ve parke taşına veriyordu; kart 341px genişlikte çizildiği için
paletler okunmuyordu. Öncesi `img/urun/eski/gazbeton-nuh.webp` altında.

**Fotoğrafı olmayan beş kategori:** Dökme Malzemeler, Demir – Profil, Kereste
Grubu, Mantolama Malzemeleri, Nalbur – Hırdavat. Gelen 25 fotoğrafta bu
ürünler görünmüyor. Mantolama için `IMG_3623` denendi ama oradaki sarı paketler
Ytong/Ege, yani gazbeton — yanlış eşleşme olurdu, geri alındı.

Yer tutucu `.product-media--bos`: kategori numarasını taşıyan köşegen bir blok.
Fotoğraf gelince o `<div>` şununla değiştirilir, başka hiçbir yere dokunulmaz:

```html
<div class="product-media"><img src="img/urun/<slug>.webp"
     width="900" height="563" loading="lazy" decoding="async" alt="..."></div>
```

Metin görselde olmadığı için `alt` betimleyici olmalı — kategori adını
tekrarlamak yerine fotoğrafta ne görüldüğünü yazın.

Eski altı ürün görseli `img/urun/eski/` altına taşındı; hiçbir yerden
çağrılmıyorlar ama silinmediler.

#### Kart bağlantısı

Kartın tamamı tıklanabilir ama **tek bir gerçek bağlantı** var: başlıktaki
`.product-link`. Tıklama alanını `::after { inset: 0 }` yayıyor. Kartın
tamamını `<a>` içine almak, ekran okuyucuda başlıktan önce açıklama ve
etiketleri de okuyan çok uzun bir bağlantı adı üretirdi.

### Hakkımızda slogan paneli

Bölümdeki depo görseli ve "Yönetim Kurulu" alıntısı (`<figure>` + `.quote`)
kaldırıldı; yerine **aynı ızgara hücresinde** marka renkli slogan paneli geldi:
`<aside class="motto">`. Köşegen ayrım kurumsal PDF'in kapağından alındı.

**Slogan web fontu değil, görsel:** `img/slogan.png`.

Sebep lisans: PDF'in kullandığı font `LibelSuitRg-Regular` (*Libel Suit*,
Måns Grebäck) — bu, PDF'e gömülü font tablosundan okundu. Ticari bir font ve
web'e gömülmesi ayrı lisans gerektiriyor. Görsel olarak koyunca ne lisans
sorunu kalıyor, ne de font indirmesi.

**Nasıl üretildi** (yeniden gerekirse):

1. PDF'in 2. sayfası 450 DPI'da rasterize edildi, slogan bölgesi kırpıldı.
2. Beyaz yazı kırmızı zeminden **alfa kanalına ayrıştırıldı**: zemin gri
   açılımla (grey opening, 45px) kestirildi, sonra her piksel için
   `P = a·255 + (1−a)·zemin` denklemi kanallar üzerinden en küçük karelerle
   çözülüp `a` bulundu. Basit "beyazı seç" eşiklemesi kenar yumuşatmayı
   bozardı ve kırmızı hale bırakırdı.
3. Tek satır dar panelde ince kalıyordu; virgülden sonraki **boş sütun bloğu
   bulunup** (x≈1093–1129) yazı ikiye ayrıldı ve üst üste dizildi.
4. RGB'nin tamamı beyaz olduğu için dosya **gri+alfa (LA)** PNG olarak
   kaydedildi — RGBA'ya göre **%22 küçük** (59,9 KB / 76,3 KB).

1000×402px; panelde ~480px çiziliyor, yani 2×. `loading="lazy"` ve
`width`/`height` öznitelikleri var — ekran kayması (CLS) olmuyor.

Metin görsel içinde olduğu için **`alt` özniteliği sloganın kendisidir**;
değiştirilirse ikisi birlikte değişmeli.

### Marka ızgarası

Logolar **her zaman renkli**. Önceden fareli cihazlarda `grayscale(1)` +
`opacity: .72` uygulanıyor, renk yalnızca hover'da geliyordu.

Hover'da karo öne çıkıp büyüyor: `scale(1.12)` + gölge + `z-index`. Karo,
ızgaranın 1px'lik çizgilerinin üzerine taşarak "kalkmış" görünür.

**Marka ızgarası `.grid-lines` tekniğini kullanmaz.** O teknikte çizgiler kabın
**zemininden** (`var(--line)`) 1px'lik boşluklardan sızarak oluşur; marka sayısı
sütun sayısına tam bölünmediğinde son satırda hücre kalmayan alan da o rengi
gösterir — 38 logo 6 sütunda **811×104px'lik gri bir blok** bırakıyordu.

Burada çizgiler **hücrelerin kenarlığı**: `gap: 0`, kap `border-top` + `border-left`,
her hücre `border-right` + `border-bottom`. Komşu hücreler tek 1px çizgide
buluşur, ızgara son logodan sonra kendiliğinden biter. Marka sayısı değişse de
ayar gerekmez.

`<ul>` hâlâ `grid-lines` sınıfını taşır (ızgara ve hücre zemini oradan gelir);
`.brands` yalnızca zemin/boşluk/kenarlık bildirimlerini geçersiz kılar. Kaskadda
kazanır çünkü aynı özgüllükte ve dosyada sonra tanımlıdır.

**Logolar PDF'ten yeniden çıkarıldı.** İlk sürümde kurumsal PDF'in marka
sayfasındaki hücreler kabaca kesilmişti; kenarlarda tablonun **bordo çerçeve
parçaları** kalmış, birkaç logo da kırpılmıştı (ABS'in "Alçı Plaka" alt yazısı,
Çinişan'ın altı). 30 dosyanın 29'unda artık vardı.

Yeni çıkarım hücre ızgarasını ölçerek yapıldı: sayfa 400 DPI'da rasterize
edildi, çerçeve çizgileri satır/sütun profilinden bulundu (3 sütun × 11 satır),
her hücrenin **içinden** 14px pay bırakılarak kırpıldı. Ardından kirli beyaz
zemin saf beyaza çekilip (bazı hücrelerde soluk gri kutular vardı) içeriğe göre
kırpıldı ve 400×175 tuvale ortalandı.

PDF çıkarımı yine de bazı logolarda yetersiz kaldı (kaynak çözünürlük düşüktü);
onlar internetten bulunan sürümlerle değiştirildi. **Şu 19 logo PDF'ten değil,
doğrudan dosyadan üretildi:**

Pramiks, Kaspor, Safi Çimento, Baumit, BTM, Çinişan, Delta, Erra, Kılıçoğlu,
Nuh, Tekno, UKS, Yurtbay + altı yeni marka (Akyüzler, Ateş Tuğla, Uplast,
Vezirhan Çimento, Evona, Yapı Tasarım).

Toplam **38 marka, ~200 KB**.

Boru hattı zemin rengini **köşe bloklarından kestirir** ve açıksa saf beyaza
çeker — sabit bir eşik yetmiyordu, örneğin Çinişan dosyasının zemini krem
(252, 255, 246) idi ve "beyaza yakın" eşiğini geçmiyordu.

Ham dosyalar `img/marka/kaynak/`, eski çerçeveli sürüm `img/marka/eski/` altında.

**Logo neden `<span>` içinde:** `.brands li` aynı zamanda `.reveal` ve o
animasyon `transform`'a yazıyor. `animation-fill-mode: both` olduğu için
animasyon bittikten sonra da değerini tutar ve kaskadda normal bildirimleri
yener — hücreye stil sayfasından verilen `transform` (ve `scale`) uygulanmazdı.
Sarmalayıcı `<span>`'ın hiç animasyonu yok, dolayısıyla kaskad yarışı hiç
doğmuyor. Aynı tuzak `.product-media img` için de not edilmiş durumda.

Sarmalayıcı `position: absolute; inset: 0` ile hücreyi doldurur ve zemini
`var(--surface)`'tir — büyürken komşularını ve ızgara çizgisini kapatması için.
Hücre iç boşluğu (`padding`) da artık sarmalayıcıda; masaüstünde `var(--s2)`,
mobil şeritte `0.75rem`.

Kenardaki karolar büyürken sayfa taşmıyor: 1280px'de en sağdaki karo 1259'da,
en soldaki 21'de kalıyor — `.wrap` iç boşluğu payı yetiyor.

`img/marka/safi-cimento.webp` gerçekten gri görünür; markanın kendi logosu öyle,
bir hata değil. Diğer 31 dosyanın hepsi renkli.

### Referans listesindeki font

`.refs li` gövde fontu (Barlow) yerine **başlık fontunu (Archivo) 500 / 15px**
kullanır. Barlow yarı daraltılmış bir grotesk; 14px'te bu uzun ticari unvanlar
("… San. ve Tic. Ltd. Şti.") sıkışık okunuyordu. Archivo daha geniş ve açık
apertürlü, Türkçe aksanlarını (ğ / ş / ı / İ) 15px'te net ayırıyor.

**Bu değişiklik sıfır bayt ekledi.** Google Fonts, Archivo'yu değişken font
olarak servis ediyor: `wght@600;700;800` ile `wght@500;600;700;800` isteklerinin
ikisi de **birebir aynı 3 woff2 dosyasını** döndürüyor (alt küme başına bir
dosya). 500 ağırlığı eklemek yalnızca zaten inen dosyanın kullanılan ağırlık
aralığını genişletiyor.

Aynı ölçü mobilde de geçerli — daraltılmadı. 375px'te hücre 166px, en uzun
unvan 4 satıra sarıyor, taşma yok.

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
| Hover: marka karosunun büyümesi | `transform: scale`, `@media (hover: hover)` |

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

Durum değiştiren hover'lar (kart kaldırma, görsel zoom, marka karosunun
büyümesi, referans inversiyonu, ok kayması) `@media (hover: hover)` içindedir:
dokunmatikte `:hover` tetiklendiğinde dokunulan öğede "yapışıp" kalırdı.

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
