// import ExploreSheets from "@/components/exploresheets/ExploreSheets";

import ExploreSheets from "@/app/(dashboard)/explore-sheets/page";

export default function ExploreSheetsPage({
  searchParams,
}: {
  searchParams: { tab?: string; category?: string };
}) {
  const currentTab = searchParams.tab || "explore";
  const currentCategory = searchParams.category || "popular";

  return (
    <ExploreSheets currentTab={currentTab} currentCategory={currentCategory} />
  );
}
