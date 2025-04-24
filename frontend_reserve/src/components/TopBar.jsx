import LanguageSelector from "../components/settings/LanguageSelector";

const TopBar = () => {
  return (
    <div className="w-full bg-zinc-900 text-white px-4 py-2 shadow-md flex justify-end items-center sticky top-0 z-50">
      <LanguageSelector />
    </div>
  );
};

export default TopBar;