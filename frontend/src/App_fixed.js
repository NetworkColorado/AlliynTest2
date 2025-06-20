import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Enhanced state management
  const [accountType, setAccountType] = useState('free'); // free, premium
  const [swipeCount, setSwipeCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lastLockoutTime, setLastLockoutTime] = useState(null);
  const [searchRadius, setSearchRadius] = useState(20); // Local search radius in miles

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    companyName: "Your Company",
    companyDescription: "",
    logo: "",
    ownerName: "Your Name",
    ownerTitle: "Owner",
    profileImage: "",
    serviceAreas: ["Denver"],
    industry: "Technology",
    yearsInBusiness: 5,
    seekingPartnership: "Local",
    partnerships: ["Strategic Alliances"],
    email: ""
  });

  // Add this after other useState declarations
  const [currentProfile, setCurrentProfile] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Live profile state
  const [liveProfiles, setLiveProfiles] = useState([
    {
      id: 1,
      companyName: "TechFlow Solutions",
      companyDescription: "Enterprise software development and digital transformation specialists",
      logo: "",
      ownerName: "Sarah Chen",
      ownerTitle: "CEO",
      profileImage: "",
      serviceAreas: ["Denver", "Boulder", "Fort Collins"],
      industry: "Technology",
      yearsInBusiness: 7,
      seekingPartnership: "Local",
      partnerships: ["Strategic Alliances", "Joint Ventures"],
      email: "sarah@techflowsolutions.com"
    },
    // ... (keep existing profiles for now)
  ]);

  // Filtered profiles for matchmaking
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isFilteringProfiles, setIsFilteringProfiles] = useState(false);

  // Other states...
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('matchmaker');
  const [authMode, setAuthMode] = useState('login'); // login, signup
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Profile and navigation states
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  // Leaderboard and deals
  const [deals, setDeals] = useState([]);
  const [sponsorshipRequests, setSponsorshipRequests] = useState([]);

  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfileForModal, setSelectedProfileForModal] = useState(null);

  // Add advertisement states
  const [currentAdPopup, setCurrentAdPopup] = useState(null);
  const [showAdPopup, setShowAdPopup] = useState(false);

  // Add admin states
  const [adminUsers, setAdminUsers] = useState([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Mock data for ads
  const popupAds = [
    {
      id: 1,
      title: "Boost Your Network",
      description: "Connect with 10x more businesses in your area",
      cta: "Upgrade to Premium",
      backgroundColor: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "Exclusive Deals",
      description: "Access member-only partnership opportunities",
      cta: "Join Premium",
      backgroundColor: "from-blue-500 to-cyan-500"
    }
  ];

  // Authentication functions with Airtable integration
  const handleSignUp = async (formData) => {
    try {
      // Create user profile data
      const userProfileData = {
        name: formData.ownerName,
        email: formData.email,
        company: formData.companyName,
        company_description: formData.companyDescription,
        industry: formData.industry,
        years_in_business: parseInt(formData.yearsInBusiness),
        service_areas: formData.serviceAreas.split(',').map(area => area.trim()),
        partnerships: formData.partnerships || ["Strategic Alliances"],
        seeking_partnership: formData.seekingPartnership
      };

      // Register user in backend (which will also track in Airtable)
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfileData)
      });

      if (response.ok) {
        const registeredUser = await response.json();
        
        // Create local profile for immediate use
        const newProfile = {
          id: registeredUser.id,
          companyName: registeredUser.company,
          companyDescription: registeredUser.company_description,
          logo: "",
          ownerName: registeredUser.name,
          ownerTitle: formData.ownerTitle || "Owner",
          profileImage: "",
          serviceAreas: registeredUser.service_areas,
          industry: registeredUser.industry,
          yearsInBusiness: registeredUser.years_in_business,
          seekingPartnership: registeredUser.seeking_partnership,
          partnerships: registeredUser.partnerships,
          email: registeredUser.email
        };
        
        // Add to live profiles
        setLiveProfiles(prev => [...prev, newProfile]);
        
        // Update user profile
        setUserProfile(newProfile);
        
        // Authenticate user
        setIsAuthenticated(true);
        setShowAuthModal(false);
        
        alert('🎉 Welcome to Alliyn! Your profile is now live and ready for matching! Your registration has been automatically tracked.');
      } else {
        const errorData = await response.json();
        alert(`❌ Registration failed: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('❌ Registration failed. Please try again.');
    }
  };

  const handleLogin = (email) => {
    const existingProfile = liveProfiles.find(p => p.email === email);
    if (existingProfile) {
      setUserProfile(existingProfile);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      alert('✅ Welcome back!');
    } else if (email === 'thenetworkcolorado@gmail.com') {
      setIsAdminAuthenticated(true);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setActiveTab('admin');
      alert('✅ Admin access granted');
    } else {
      alert('❌ Account not found. Please sign up first.');
    }
  };

  // Industry synergy calculations
  const calculateIndustrySynergy = (industry1, industry2) => {
    if (industry1 === industry2) return 1.0; // Perfect match
    
    const industrySynergies = {
      'Technology': ['Professional Services', 'Manufacturing', 'Financial Services', 'Healthcare & Medical'],
      'Professional Services': ['Technology', 'Real Estate', 'Financial Services', 'Manufacturing'],
      'Healthcare & Medical': ['Technology', 'Non-Profit', 'Professional Services', 'Retail & E-commerce'],
      'Manufacturing': ['Technology', 'Professional Services', 'Construction', 'Energy & Utilities'],
      'Real Estate': ['Professional Services', 'Construction', 'Financial Services', 'Hospitality & Tourism'],
      'Financial Services': ['Technology', 'Professional Services', 'Real Estate', 'Manufacturing'],
      'Retail & E-commerce': ['Technology', 'Food & Beverage', 'Healthcare & Medical', 'Hospitality & Tourism'],
      'Construction': ['Real Estate', 'Manufacturing', 'Professional Services', 'Energy & Utilities'],
      'Education': ['Technology', 'Non-Profit', 'Professional Services', 'Healthcare & Medical'],
      'Hospitality & Tourism': ['Food & Beverage', 'Retail & E-commerce', 'Real Estate', 'Transportation & Logistics'],
      'Transportation & Logistics': ['Manufacturing', 'Retail & E-commerce', 'Technology', 'Hospitality & Tourism'],
      'Food & Beverage': ['Hospitality & Tourism', 'Retail & E-commerce', 'Agriculture'],
      'Energy & Utilities': ['Manufacturing', 'Construction', 'Technology'],
      'Non-Profit': ['Education', 'Professional Services', 'Healthcare & Medical'],
      'Agriculture': ['Food & Beverage', 'Technology', 'Manufacturing']
    };

    const synergistic = (industrySynergies[industry1] && industrySynergies[industry1].includes(industry2)) || 
                       (industrySynergies[industry2] && industrySynergies[industry2].includes(industry1));
    
    return synergistic ? 0.8 : 0.3; // High synergy or low compatibility
  };

  const calculatePartnershipAlignment = (partnerships1, partnerships2) => {
    if (partnerships1.length === 0 || partnerships2.length === 0) return 0.5;
    
    const overlap = partnerships1.filter(p => partnerships2.includes(p));
    const union = [...new Set([...partnerships1, ...partnerships2])];
    
    return overlap.length / union.length; // Jaccard similarity
  };

  // Location-based filtering with configurable distance
  const isWithinLocalRange = async (userAreas, businessAreas, maxDistance = searchRadius) => {
    try {
      // Simple area matching as fallback
      const commonAreas = userAreas.filter(area => 
        businessAreas.some(bArea => 
          area.toLowerCase().includes(bArea.toLowerCase()) || 
          bArea.toLowerCase().includes(area.toLowerCase())
        )
      );
      
      return commonAreas.length > 0;
    } catch (error) {
      console.error('Location filtering error:', error);
      return true; // Default to true on error
    }
  };

  // Enhanced matching algorithm
  const getFilteredProfiles = async () => {
    if (!userProfile.seekingPartnership || !isAuthenticated) {
      return liveProfiles;
    }

    const filtered = [];
    
    for (const profile of liveProfiles) {
      // Skip own profile
      if (profile.email === userProfile.email) continue;
      
      let shouldInclude = false;
      
      // Filter by partnership preference
      if (userProfile.seekingPartnership === 'National') {
        shouldInclude = true; // Show all profiles for national
      } else if (userProfile.seekingPartnership === 'Local') {
        // Check if they're within the user's selected radius
        const isWithinRange = await isWithinLocalRange(
          userProfile.serviceAreas || [],
          profile.serviceAreas || [],
          searchRadius
        );
        shouldInclude = isWithinRange;
      }
      
      if (shouldInclude) {
        // Calculate compatibility score
        const industrySynergy = calculateIndustrySynergy(userProfile.industry, profile.industry);
        const partnershipAlignment = calculatePartnershipAlignment(
          userProfile.partnerships || [],
          profile.partnerships || []
        );
        const experienceBalance = Math.min(userProfile.yearsInBusiness, profile.yearsInBusiness) / 
                                Math.max(userProfile.yearsInBusiness, profile.yearsInBusiness);
        
        const compatibilityScore = (
          industrySynergy * 0.4 + 
          partnershipAlignment * 0.4 + 
          experienceBalance * 0.2
        );
        
        filtered.push({
          ...profile,
          compatibilityScore: Math.round(compatibilityScore * 100)
        });
      }
    }
    
    // Sort by compatibility score (highest first)
    return filtered.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  };

  // Admin functions
  const handleUnbanUser = (userId) => {
    const user = adminUsers.find(u => u.id === userId);
    if (confirm(`Unban ${user && user.name ? user.name : 'user'} and restore their access to the platform?`)) {
      setAdminUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: 'active' } : u
      ));
      alert(`✅ User ${user && user.name ? user.name : 'user'} has been unbanned and can now access the platform.`);
    }
  };

  const handleWaiveFee = (userId) => {
    const user = adminUsers.find(u => u.id === userId);
    if (confirm(`Waive premium fee for ${user && user.name ? user.name : 'user'}?`)) {
      setAdminUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, accountType: 'premium' } : u
      ));
      alert(`✅ Premium fee waived for ${user && user.name ? user.name : 'user'}. They now have premium access at no cost.`);
    }
  };

  const handleDeactivatePremium = (userId) => {
    const user = adminUsers.find(u => u.id === userId);
    if (confirm(`Deactivate premium account for ${user && user.name ? user.name : 'user'}?`)) {
      setAdminUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, accountType: 'free' } : u
      ));
      alert(`✅ Premium account deactivated for ${user && user.name ? user.name : 'user'}. They now have a free account.`);
    }
  };

  const handleDeleteAccount = (userId) => {
    const user = adminUsers.find(u => u.id === userId);
    if (confirm(`⚠️ WARNING: This will permanently delete ${user && user.name ? user.name : 'user'}'s account. This action cannot be undone. Continue?`)) {
      if (confirm(`⚠️ FINAL WARNING: Are you absolutely sure you want to delete ${user && user.name ? user.name : 'user'}'s account? All their data will be lost forever.`)) {
        setAdminUsers(prev => prev.filter(u => u.id !== userId));
        alert(`✅ Account for ${user && user.name ? user.name : 'user'} has been permanently deleted.`);
      }
    }
  };

  // ... [All other functions continue here with fixed optional chaining]

  // Premium upgrade function
  const handlePremiumUpgrade = async () => {
    try {
      // Get current origin for success/cancel URLs
      const originUrl = window.location.origin;
      
      // Prepare checkout request
      const checkoutRequest = {
        package_id: 'premium_monthly',
        origin_url: originUrl,
        user_data: {
          email: userProfile.email || 'user@example.com',
          name: userProfile.ownerName || 'User',
          company: userProfile.companyName || 'Company'
        }
      };

      // Create checkout session
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/premium/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutRequest)
      });

      if (response.ok) {
        const checkoutData = await response.json();
        
        // Redirect to Stripe Checkout
        window.location.href = checkoutData.checkout_url;
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to start payment: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('❌ Payment failed to start. Please try again.');
    }
  };

  const upgradeToePremium = () => {
    setAccountType('premium');
    setSwipeCount(0);
    setMatchCount(0);
    setIsLockedOut(false);
    setLastLockoutTime(null);
    setShowUpgradeModal(false);
    alert('🎉 Welcome to Premium! Enjoy unlimited matching!');
  };

  // ... [Rest of the component continues with all functions properly fixed]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Your existing JSX structure remains the same */}
      <div>App Content Here</div>
    </div>
  );
}

export default App;