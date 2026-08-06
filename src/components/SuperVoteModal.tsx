import React, { useState, useEffect } from "react";
import { Zap, X, Check, ShieldCheck, Sparkles, CreditCard, Coins, Copy, ArrowLeft, Loader2, Lock, ShoppingBag } from "lucide-react";
import { Contestant } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface SuperVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  contestants: Contestant[];
  currentBalance: number;
  onBuyTokens: (amount: number) => void;
  onCastSuperVote: (contestantId: string) => void;
  preselectedContestantId?: string;
}

export const SuperVoteModal: React.FC<SuperVoteModalProps> = ({
  isOpen,
  onClose,
  contestants,
  currentBalance,
  onBuyTokens,
  onCastSuperVote,
  preselectedContestantId,
}) => {
  const { t } = useLanguage();
  const [selectedContestantId, setSelectedContestantId] = useState<string>(
    preselectedContestantId || (contestants[0]?.id ?? "")
  );
  const [activeTab, setActiveTab] = useState<"store" | "boost">("boost");
  const [selectedPack, setSelectedPack] = useState<{
    id: string;
    tokens: number;
    votes: number;
    price: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (preselectedContestantId) {
        setSelectedContestantId(preselectedContestantId);
        setActiveTab("boost");
      } else if (currentBalance >= 1) {
        setActiveTab("boost");
      } else {
        setActiveTab("boost");
      }
    }
  }, [isOpen, preselectedContestantId, currentBalance]);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const [cryptoNetwork, setCryptoNetwork] = useState<"trc20" | "erc20" | "sol" | "btc">("trc20");
  const [txHash, setTxHash] = useState("");
  const [copied, setCopied] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const packages = [
    { id: "pack-5", tokens: 5, votes: 50, price: "$1.99", popular: false },
    { id: "pack-20", tokens: 20, votes: 200, price: "$5.99", popular: true },
    { id: "pack-50", tokens: 50, votes: 12.99, price: "$12.99", popular: false },
    { id: "pack-100", tokens: 100, votes: 1000, price: "$24.99", popular: false },
  ];

  const walletAddresses: Record<string, string> = {
    trc20: "TSpid3rQu33nsUSDT20TronNetworkAddressX9",
    erc20: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    sol: "Spid3rQnSOL1111111111111111111111111111111",
    btc: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(walletAddresses[cryptoNetwork]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPack) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onBuyTokens(selectedPack.tokens);
      setPurchaseSuccess(`⚡ ${selectedPack.tokens} Super Vote jetonu hesabınıza eklendi!`);
      setSelectedPack(null);
      setTimeout(() => setPurchaseSuccess(null), 4000);
    }, 1500);
  };

  const handleBoost = () => {
    if (!selectedContestantId) return;
    onCastSuperVote(selectedContestantId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0c0c] border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 space-y-6 relative shadow-[0_0_50px_rgba(245,158,11,0.25)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#080808] text-gray-400 hover:text-white cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto animate-pulse">
            <Zap className="w-6 h-6 fill-amber-400" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Super Vote Boost System
          </h2>
          <p className="text-xs text-gray-400">
            1 Super Vote Token = <span className="text-amber-300 font-bold">+10 Instant Votes</span>
          </p>

          {/* Token Balance Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#050505] border border-amber-500/50 text-amber-300 text-xs font-mono font-bold mt-1">
            <span>Bakiyeniz:</span>
            <span className="text-white text-sm">{currentBalance} Jeton</span>
          </div>
        </div>

        {/* Tab Selector */}
        {!selectedPack && (
          <div className="flex bg-[#050505] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab("store")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "store"
                  ? "bg-amber-500 text-[#050505] shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🛒 Jeton Mağazası
            </button>
            <button
              onClick={() => setActiveTab("boost")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "boost"
                  ? "bg-amber-500 text-[#050505] shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              ⚡ Kraliçe Destekle
            </button>
          </div>
        )}

        {/* Purchase Feedback Toast */}
        {purchaseSuccess && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{purchaseSuccess}</span>
          </div>
        )}

        {/* STORE TAB - PACKAGES */}
        {activeTab === "store" && !selectedPack && (
          <div className="space-y-3">
            {packages.map((pack) => (
              <div
                key={pack.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  pack.popular
                    ? "bg-[#050505] border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "bg-[#050505]/60 border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">
                      {pack.tokens} Süper Oy
                    </span>
                    {pack.popular && (
                      <span className="text-[9px] font-bold bg-amber-500 text-[#050505] px-2 py-0.5 rounded uppercase">
                        POPÜLER
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-amber-300 font-mono">
                    Yarışmacıya +{pack.tokens * 10} Oy Kazandırır
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPack(pack)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-[#050505] font-black text-xs hover:scale-105 transition-transform cursor-pointer shadow-md"
                >
                  Satın Al {pack.price}
                </button>
              </div>
            ))}

            <p className="text-[10px] text-gray-500 text-center pt-2 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-amber-500" />
              <span>Kredi Kartı ve Kripto Para (USDT / BTC) Ödeme Desteği</span>
            </p>
          </div>
        )}

        {/* CHECKOUT FLOW WHEN PACKAGE IS SELECTED */}
        {selectedPack && (
          <form onSubmit={handleCompletePayment} className="space-y-4 bg-[#050505] p-4 rounded-2xl border border-amber-500/30">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <button
                type="button"
                onClick={() => setSelectedPack(null)}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Paket Seçimine Dön
              </button>
              <div className="text-xs font-mono font-bold text-white bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/40">
                {selectedPack.tokens} Süper Oy ({selectedPack.price})
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "bg-amber-500 text-[#050505] border-amber-400 shadow-md"
                    : "bg-[#0c0c0c] text-gray-400 border-white/10 hover:text-white"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Kredi Kartı</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("crypto")}
                className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  paymentMethod === "crypto"
                    ? "bg-amber-500 text-[#050505] border-amber-400 shadow-md"
                    : "bg-[#0c0c0c] text-gray-400 border-white/10 hover:text-white"
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>Kripto Para</span>
              </button>
            </div>

            {/* CREDIT CARD FORM */}
            {paymentMethod === "card" ? (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400">Kart Üzerindeki İsim</label>
                  <input
                    type="text"
                    required
                    placeholder="Ad Soyad"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080808] border border-white/10 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-400">Kart Numarası</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4543 •••• •••• 1234"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080808] border border-white/10 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400">Son Kullanma (AA/YY)</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="08/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080808] border border-white/10 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400">CVC / CVV</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      placeholder="888"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080808] border border-white/10 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-Bit SSL Şifreli Güvenli Ödeme Altyapısı</span>
                </div>
              </div>
            ) : (
              /* CRYPTO FORM */
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400">Ağ / Network Seçin</label>
                  <select
                    value={cryptoNetwork}
                    onChange={(e) => setCryptoNetwork(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080808] border border-white/10 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="trc20">USDT (TRC20 - Tron Network)</option>
                    <option value="erc20">USDT (ERC20 - Ethereum Network)</option>
                    <option value="sol">Solana (SOL Network)</option>
                    <option value="btc">Bitcoin (BTC Network)</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-[#080808] border border-white/10 space-y-2">
                  <div className="text-[10px] font-semibold text-gray-400">Yatırılacak Cüzdan Adresi:</div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-amber-300 break-all select-all">
                      {walletAddresses[cryptoNetwork]}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyWallet}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-bold flex items-center gap-1 flex-shrink-0 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      {copied ? "Kopyalandı!" : "Kopyala"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-400">İşlem Kodu (TXID / TxHash) - Opsiyonel</label>
                  <input
                    type="text"
                    placeholder="Örn: 0x8a91c... veya TRC20 TXID"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080808] border border-white/10 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Complete Payment Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-[#050505] font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#050505]" />
                  <span>Ödeme Doğrulanıyor...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#050505]" />
                  <span>Ödemeyi Tamamla ({selectedPack.price})</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* BOOST TAB */}
        {activeTab === "boost" && !selectedPack && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Desteklenecek Spider Kraliçesi:</label>
              <select
                value={selectedContestantId}
                onChange={(e) => setSelectedContestantId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {contestants
                  .filter((c) => c.status === "approved")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.displayName} ({c.country}) — Mevcut Oy: {c.voteCount}
                    </option>
                  ))}
              </select>
            </div>

            {currentBalance < 1 ? (
              <div className="space-y-3 p-4 rounded-2xl bg-[#050505] border border-amber-500/30 text-center">
                <p className="text-xs text-amber-200">
                  Süper Oy kullanabilmek için jetonunuz bulunmuyor. 1 Süper Oy jetonu yarışmacınıza anında <strong className="text-amber-400">+10 oy</strong> kazandırır.
                </p>
                <button
                  onClick={() => setActiveTab("store")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-[#050505] font-black text-xs uppercase tracking-wider hover:scale-105 transition-transform cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#050505]" />
                  <span>Jeton Mağazasına Git & Jeton Al</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleBoost}
                className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-400 text-[#050505] shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-105"
              >
                <Zap className="w-4 h-4 fill-[#050505]" />
                <span>+10 Süper Oy Desteği Gönder (1 Jeton Harca)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
