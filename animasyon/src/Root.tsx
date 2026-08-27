import { Composition } from "remotion";
import { TuglaDuvar } from "./TuglaDuvar";

/* Boyut, hero'daki istatistik satırının altına gelen şeride göre seçildi:
   1600x320. Duvar alt 130 pikselde örülüyor, üstteki boşluk tuğlaların
   düşerken geçtiği alan — orası tamamen şeffaf kalıyor. */
export const RemotionRoot = () => (
  <Composition
    id="TuglaDuvar"
    component={TuglaDuvar}
    durationInFrames={140}
    fps={30}
    width={1600}
    height={320}
  />
);
