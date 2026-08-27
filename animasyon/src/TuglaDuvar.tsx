import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/* --- duvar ölçüleri (kompozisyon 1600x320) --------------------------- */
const TUGLA_G = 148;   // tuğla genişliği
const TUGLA_Y = 52;    // tuğla yüksekliği
const DERZ = 9;        // tuğlalar arası boşluk (harç payı)
const SIRA = 2;        // kaç sıra
const TABAN = 320;     // duvarın oturduğu taban (kompozisyonun alt kenarı)

/* Marka paletinden türetilmiş tuğla tonları. Tek renk kullanılırsa duvar
   düz bir blok gibi duruyor; gerçek tuğlada her parça biraz farklı.
   Her ton [açık yüz, koyu kenar] çifti: degradede saydam siyah (rgba)
   KULLANILMIYOR - şeffaf zeminde o, tuğlayı koyulaştırmak yerine
   siliyor. İki katı renk arasında geçiş yapılıyor. */
const TONLAR: [string, string][] = [
  ["#A0442F", "#6E2C1D"],
  ["#B24E36", "#7C3323"],
  ["#8C3A27", "#5E2417"],
  ["#A94A32", "#73301F"],
  ["#BE5739", "#843926"],
];

type Tugla = { x: number; y: number; g: number; gecikme: number; ton: [string, string] };

const duvariKur = (): Tugla[] => {
  const list: Tugla[] = [];
  for (let sira = 0; sira < SIRA; sira++) {
    const y = TABAN - (sira + 1) * (TUGLA_Y + DERZ);
    /* Tek sıralar yarım tuğla kaydırılıyor (kesme derz): gerçek duvar
       örgüsü böyle, düz hizalanınca dikey çizgiler kolon gibi çıkıyor. */
    const kayma = sira % 2 === 1 ? -(TUGLA_G + DERZ) / 2 : 0;
    let x = kayma;
    let sutun = 0;
    while (x < 1600) {
      const g = Math.min(TUGLA_G, 1600 - Math.max(x, 0)) - (x < 0 ? -x : 0);
      if (g > 12) {
        list.push({
          x: Math.max(x, 0),
          y,
          g,
          /* Alttan üste, soldan sağa: duvar gerçekten örülüyormuş gibi. */
          gecikme: sira * 12 + sutun * 3.2,
          ton: TONLAR[(sira * 7 + sutun * 3) % TONLAR.length],
        });
      }
      x += TUGLA_G + DERZ;
      sutun++;
    }
  }
  return list;
};

const TUGLALAR = duvariKur();

export const TuglaDuvar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    /* Arka plan ŞEFFAF: video hero fotoğrafının üzerine biniyor. */
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {TUGLALAR.map((t, i) => {
        const p = spring({
          frame: frame - t.gecikme,
          fps,
          config: { damping: 13, mass: 0.62, stiffness: 105 },
        });
        const dusus = interpolate(p, [0, 1], [-330, 0]);
        const donus = interpolate(p, [0, 1], [i % 2 ? 7 : -7, 0]);
        const gorunur = interpolate(p, [0, 0.12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: t.x,
              top: t.y,
              width: t.g,
              height: TUGLA_Y,
              opacity: gorunur,
              transform: `translateY(${dusus}px) rotate(${donus}deg)`,
              borderRadius: 3,
              background: `linear-gradient(158deg, ${t.ton[0]} 0%, ${t.ton[0]} 52%, ${t.ton[1]} 100%)`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.16)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
