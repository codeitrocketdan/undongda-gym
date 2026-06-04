import headerWishlist from "@/pages/favorite/assets/images/header_wishlist.svg";
import SubPageHeader from "@/shared/ui/SubPageHeader/SubPageHeader";
import FavoriteSection from "./components/FavoriteSection";

export default function FavoritePage() {
  return (
    <main className="inner mt-8 md:mt-10 lg:mt-12.75">
      <SubPageHeader
        imageSrc={headerWishlist}
        title="찜한 다짐"
        description="마감되기 전에 지금 바로 참여해보세요 (☞ﾟヮﾟ)☞"
      />

      <FavoriteSection />
    </main>
  );
}
