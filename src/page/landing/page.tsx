"use client";

import FullBleed from "./components/FullBleed";
import LandingCategories from "./components/LandingCategories";
import LandingCommunity from "./components/LandingCommunity";
import LandingCta from "./components/LandingCta";
import LandingFooter from "./components/LandingFooter";
import LandingHero from "./components/LandingHero";
import LandingReviews from "./components/LandingReviews";

const PAGE_GRADIENT =
  "bg-[linear-gradient(180deg,#f6f7f9_0%,#e1f4ff_20%,white_40%,white_60%,#e1f4ff_80%,#f6f7f9_100%)]";

const LandingPage = () => {
  return (
    <div>
      <FullBleed className={PAGE_GRADIENT}>
        <LandingHero />
        <LandingCategories />
        <LandingReviews />
        <LandingCommunity />
        <LandingCta />
      </FullBleed>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
