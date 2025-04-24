import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

const SettingsMenu = () => {
  return (
    <div className="w-full flex justify-end items-center gap-4 pr-4">
      <LanguageSelector />
      <ThemeToggle />
    </div>
  );
};

const WalletInfo = () => {
  return (
    <div>
      <div className="bg-blue-500 text-white p-4 mb-4">
        <h1>Wallet Name</h1>
        <p>Description</p>
      </div>
      <div className="mb-4">
        <p>Connected Wallet Address: 0x123...abc</p>
      </div>
      <div className="mt-4">
        <div className="border p-4">
          <p>Token Balance: 100</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
