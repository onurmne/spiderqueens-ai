import React, { useState, useEffect } from "react";
import { UserProfile, Contestant, UserRole, Winner } from "./types";
import { spiderService } from "./services/spiderService";
import { Header } from "./components/Header";
import { MobileNav } from "./components/MobileNav";
import { LandingPage } from "./components/LandingPage";
import { FeedPage } from "./components/FeedPage";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { UploadPage } from "./components/UploadPage";
import { WeeklyCompetitionsPage } from "./components/WeeklyCompetitionsPage";
import { SuperVoteModal } from "./components/SuperVoteModal";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { ProfilePage } from "./components/ProfilePage";
import { MonetizationBanners } from "./components/MonetizationBanners";
import { PwaPrompt } from "./components/PwaPrompt";
import { LanguageProvider } from "./i18n/LanguageContext";

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [currentUser, setCurrentUser] = useState<UserProfile>(spiderService.getCurrentUser());
  const [allContestants, setAllContestants] = useState<Contestant[]>(spiderService.getAllContestants());
  const [approvedContestants, setApprovedContestants] = useState<Contestant[]>(spiderService.getApprovedContestants());
  const [winners, setWinners] = useState<Winner[]>(spiderService.getWinners());
  const [hasVotedMap, setHasVotedMap] = useState<Record<string, boolean>>({});
  const [isSuperVoteModalOpen, setIsSuperVoteModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [preselectedSuperVoteContestantId, setPreselectedSuperVoteContestantId] = useState<string>("");

  const refreshState = () => {
    setCurrentUser(spiderService.getCurrentUser());
    const all = spiderService.getAllContestants();
    setAllContestants(all);
    const approved = spiderService.getApprovedContestants();
    setApprovedContestants(approved);
    setWinners(spiderService.getWinners());

    const user = spiderService.getCurrentUser();
    const newVotedMap: Record<string, boolean> = {};
    approved.forEach((c) => {
      newVotedMap[c.id] = spiderService.hasUserVoted(c.id, user.id);
    });
    setHasVotedMap(newVotedMap);
  };

  useEffect(() => {
    refreshState();

    // Check if URL contains admin parameter or route
    if (
      typeof window !== "undefined" &&
      (window.location.search.toLowerCase().includes("admin") ||
        window.location.hash.toLowerCase().includes("admin") ||
        window.location.pathname.toLowerCase().includes("admin"))
    ) {
      setIsAdminLoginModalOpen(true);
    }
  }, []);

  const handleAdminLoginSuccess = () => {
    spiderService.setUserRole("admin");
    refreshState();
    setIsAdminLoginModalOpen(false);
    setActiveTab("admin");
  };

  const handleLogoutAdmin = () => {
    spiderService.setUserRole("user");
    refreshState();
    setActiveTab("landing");
  };

  const handleStandardVote = async (contestantId: string) => {
    const res = await spiderService.castVote(contestantId);
    if (!res.success) {
      alert(res.message);
    }
    refreshState();
  };

  const handleSuperVoteTrigger = (contestantId: string) => {
    setPreselectedSuperVoteContestantId(contestantId);
    setIsSuperVoteModalOpen(true);
  };

  const handleBuyTokens = (amount: number) => {
    spiderService.addSuperVoteTokens(amount);
    refreshState();
  };

  const handleCastSuperVote = async (contestantId: string) => {
    const res = await spiderService.castSuperVote(contestantId, 10);
    alert(res.message);
    refreshState();
  };

  const handleCrownWinner = (contestantId: string) => {
    spiderService.crownWeeklyWinner(contestantId);
    refreshState();
  };

  const userSubmissions = allContestants.filter((c) => c.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FF003C] selection:text-white">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenSuperVoteModal={() => setIsSuperVoteModalOpen(true)}
        onOpenAdminLoginModal={() => setIsAdminLoginModalOpen(true)}
        superVoteBalance={currentUser.superVoteBalance}
      />

      {/* Main Page View Switcher */}
      <main>
        {activeTab === "landing" && (
          <>
            <LandingPage
              onJoinCompetition={() => setActiveTab("upload")}
              onVoteNow={() => setActiveTab("feed")}
              onViewLeaderboard={() => setActiveTab("leaderboard")}
              featuredContestants={approvedContestants}
              onOpenSuperVoteModal={() => setIsSuperVoteModalOpen(true)}
            />
            <MonetizationBanners />
          </>
        )}

        {activeTab === "feed" && (
          <>
            <FeedPage
              contestants={approvedContestants}
              hasVotedMap={hasVotedMap}
              onVote={handleStandardVote}
              onSuperVote={handleSuperVoteTrigger}
              onJoinClick={() => setActiveTab("upload")}
            />
            <MonetizationBanners />
          </>
        )}

        {activeTab === "leaderboard" && (
          <LeaderboardPage
            contestants={approvedContestants}
            winners={winners}
            onVote={handleStandardVote}
            onSuperVote={handleSuperVoteTrigger}
            hasVotedMap={hasVotedMap}
          />
        )}

        {activeTab === "competitions" && (
          <WeeklyCompetitionsPage
            winners={winners}
            onVoteNow={() => setActiveTab("feed")}
            onJoinClick={() => setActiveTab("upload")}
          />
        )}

        {activeTab === "upload" && (
          <UploadPage
            onSuccess={() => {
              refreshState();
              setActiveTab("feed");
            }}
          />
        )}

        {activeTab === "profile" && (
          <ProfilePage
            user={currentUser}
            userContestantSubmissions={userSubmissions}
            onOpenSuperVoteModal={() => setIsSuperVoteModalOpen(true)}
            onNavigateUpload={() => setActiveTab("upload")}
          />
        )}

        {activeTab === "admin" && (
          <AdminDashboard
            allContestants={allContestants}
            onRefreshData={refreshState}
            onCrownWinner={handleCrownWinner}
            onLogoutAdmin={handleLogoutAdmin}
          />
        )}
      </main>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Super Vote Modal Dialog */}
      <SuperVoteModal
        isOpen={isSuperVoteModalOpen}
        onClose={() => setIsSuperVoteModalOpen(false)}
        contestants={approvedContestants}
        currentBalance={currentUser.superVoteBalance}
        onBuyTokens={handleBuyTokens}
        onCastSuperVote={handleCastSuperVote}
        preselectedContestantId={preselectedSuperVoteContestantId}
      />

      {/* Footer with subtle admin trigger */}
      <footer className="py-8 text-center text-xs text-gray-600 border-t border-white/5 space-y-2 mb-16 lg:mb-0">
        <p>© 2026 SpiderQueens Global Cosplay Championship. All rights reserved.</p>
        <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500">
          <span>Spider-Verse Fan Portal</span>
          <span>•</span>
          <button
            onClick={() => setIsAdminLoginModalOpen(true)}
            className="hover:text-gray-400 underline decoration-gray-700 cursor-pointer"
          >
            Yönetici Girişi
          </button>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* PWA Mobile Installation Prompt Banner */}
      <PwaPrompt />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
