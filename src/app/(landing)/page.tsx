import Image from "next/image";

import { SiteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { BorderBeam } from "~/components/border-beam";
import SparklesText from "~/components/sparkles-text";

import landingImg from "./landing-img.png";

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={cn("mb-20 flex flex-col items-center justify-center")}>
        <SparklesText text={SiteConfig.title} />
      </div>

      <div className="relative h-[512px] rounded-xl">
        <BorderBeam />
        <Image src={landingImg} alt="Tasky Board" priority />
      </div>
    </div>
  );
}
