import { Config } from "@remotion/cli/config";

/* Alfa kanalı (şeffaf arka plan) yalnızca PNG kare biçiminde korunur;
   JPEG'de şeffaflık diye bir şey yok. */
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
