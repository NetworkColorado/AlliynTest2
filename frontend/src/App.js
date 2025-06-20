import React, { useState, useRef, useCallback, useEffect } from 'react';
import './App.css';

// Popup ads for monetization
const adPopups = [
  {
    id: 'popup1',
    title: '🚀 Scale Your Business Fast!',
    description: 'Join 10,000+ entrepreneurs using our proven growth system',
    cta: 'Get 30% Off Today',
    image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b',
    backgroundColor: 'from-blue-500 to-purple-600'
  },
  {
    id: 'popup2',
    title: '💰 Business Funding Available',
    description: 'Get up to $500K funding for your business expansion',
    cta: 'Apply in 5 Minutes',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
    backgroundColor: 'from-green-500 to-teal-600'
  },
  {
    id: 'popup3',
    title: '📈 Free Marketing Audit',
    description: 'Discover how to 3x your revenue with expert strategies',
    cta: 'Get Free Audit',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    backgroundColor: 'from-orange-500 to-red-600'
  }
];

// Mock sponsor profiles for advertising revenue
const sponsorProfiles = [
  {
    id: 'sponsor1',
    type: 'sponsor',
    companyName: "Microsoft for Startups",
    companyDescription: "Get $150,000 in Azure credits, free Office 365, and startup support programs",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    sponsorBadge: "Featured Sponsor",
    ctaText: "Apply for Program",
    ctaUrl: "#",
    backgroundColor: "from-blue-600 to-blue-800"
  },
  {
    id: 'sponsor2', 
    type: 'sponsor',
    companyName: "Stripe Atlas",
    companyDescription: "Start your company in minutes. Get a US bank account, incorporate in Delaware, and get your tax ID",
    logo: "https://images.unsplash.com/photo-1559526324-593bc073d938",
    sponsorBadge: "Startup Partner",
    ctaText: "Start Your Company",
    ctaUrl: "#",
    backgroundColor: "from-purple-600 to-indigo-800"
  },
  {
    id: 'sponsor3',
    type: 'sponsor', 
    companyName: "AWS Activate",
    companyDescription: "Get up to $100,000 in AWS credits, technical support, and training for your startup",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    sponsorBadge: "Cloud Partner",
    ctaText: "Get AWS Credits",
    ctaUrl: "#",
    backgroundColor: "from-orange-600 to-yellow-600"
  }
];

// Mock business data with comprehensive profiles
const mockBusinesses = [
  {
    id: 1,
    companyName: "TechFlow Solutions",
    companyDescription: "AI-powered business automation platform helping companies streamline operations",
    logo: "https://images.unsplash.com/photo-1663124178667-28b3776d7c15",
    ownerName: "Sarah Chen",
    ownerTitle: "CEO & Founder",
    profileImage: "https://images.pexels.com/photos/19245168/pexels-photo-19245168.jpeg",
    serviceAreas: ["San Francisco", "Silicon Valley", "Remote"],
    industry: "Technology",
    yearsInBusiness: 3,
    seekingPartnership: "National",
    partnerships: ["Strategic Alliances", "Joint Ventures", "Co-Branding"]
  },
  {
    id: 2,
    companyName: "Green Energy Consulting",
    companyDescription: "Sustainable energy solutions for businesses looking to reduce carbon footprint",
    logo: "https://images.unsplash.com/photo-1693801873650-b1091c25abbf",
    ownerName: "Michael Rodriguez",
    ownerTitle: "Managing Director",
    profileImage: "https://images.unsplash.com/photo-1576558656222-ba66febe3dec",
    serviceAreas: ["Los Angeles", "Orange County", "San Diego"],
    industry: "Renewable Energy",
    yearsInBusiness: 8,
    seekingPartnership: "Local",
    partnerships: ["Affiliate Partnerships", "Event Collaborations", "Sponsorship Agreements"]
  },
  {
    id: 3,
    companyName: "Digital Marketing Pro",
    companyDescription: "Full-service digital marketing agency specializing in growth hacking for startups",
    logo: "https://images.unsplash.com/photo-1740587010576-0ecff8049c8f",
    ownerName: "Jessica Thompson",
    ownerTitle: "Creative Director",
    profileImage: "https://images.unsplash.com/photo-1590496552566-41aca09db352",
    serviceAreas: ["New York", "Boston", "Philadelphia"],
    industry: "Marketing & Advertising",
    yearsInBusiness: 5,
    seekingPartnership: "National",
    partnerships: ["Co-Branding", "Joint Ventures", "Event Collaborations"]
  },
  {
    id: 4,
    companyName: "FinTech Innovations",
    companyDescription: "Revolutionary financial technology solutions for modern businesses",
    logo: "https://images.unsplash.com/photo-1637844528486-6dc108bd5c7f",
    ownerName: "David Park",
    ownerTitle: "CEO",
    profileImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    serviceAreas: ["Chicago", "Milwaukee", "Madison"],
    industry: "Financial Technology",
    yearsInBusiness: 4,
    seekingPartnership: "National",
    partnerships: ["Strategic Alliances", "Incubator/Accelerator Collaborations"]
  },
  {
    id: 5,
    companyName: "Wellness Hub Co.",
    companyDescription: "Corporate wellness programs designed to boost employee productivity and happiness",
    logo: "https://images.unsplash.com/photo-1617091076336-03dc99aff1df",
    ownerName: "Amanda Foster",
    ownerTitle: "Founder & Wellness Expert",
    profileImage: "https://images.unsplash.com/photo-1425421669292-0c3da3b8f529",
    serviceAreas: ["Miami", "Tampa", "Orlando"],
    industry: "Health & Wellness",
    yearsInBusiness: 2,
    seekingPartnership: "Local",
    partnerships: ["Affiliate Partnerships", "Sponsorship Agreements", "Event Collaborations"]
  },
  {
    id: 6,
    companyName: "CloudSecure Systems",
    companyDescription: "Enterprise cybersecurity solutions protecting businesses from digital threats",
    logo: "https://images.unsplash.com/photo-1731012189558-c2d035998542",
    ownerName: "Robert Kim",
    ownerTitle: "CTO & Co-Founder",
    profileImage: "https://images.pexels.com/photos/3714743/pexels-photo-3714743.jpeg",
    serviceAreas: ["Seattle", "Portland", "Vancouver"],
    industry: "Cybersecurity",
    yearsInBusiness: 6,
    seekingPartnership: "National",
    partnerships: ["Strategic Alliances", "Joint Ventures", "Incubator/Accelerator Collaborations"]
  },
  {
    id: 7,
    companyName: "Sustainable Supply Chain",
    companyDescription: "Eco-friendly supply chain optimization for environmentally conscious companies",
    logo: "https://images.pexels.com/photos/3689532/pexels-photo-3689532.jpeg",
    ownerName: "Maria Gonzalez",
    ownerTitle: "Operations Director",
    profileImage: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg",
    serviceAreas: ["Denver", "Phoenix", "Salt Lake City"],
    industry: "Supply Chain Management",
    yearsInBusiness: 7,
    seekingPartnership: "National",
    partnerships: ["Strategic Alliances", "Co-Branding", "Event Collaborations"]
  },
  {
    id: 8,
    companyName: "AI Learning Platform",
    companyDescription: "Machine learning education platform for professionals and businesses",
    logo: "https://images.pexels.com/photos/9973170/pexels-photo-9973170.jpeg",
    ownerName: "Alex Johnson",
    ownerTitle: "Chief Education Officer",
    profileImage: "https://images.pexels.com/photos/7433822/pexels-photo-7433822.jpeg",
    serviceAreas: ["Austin", "Dallas", "Houston"],
    industry: "Education Technology",
    yearsInBusiness: 1,
    seekingPartnership: "National",
    partnerships: ["Joint Ventures", "Incubator/Accelerator Collaborations", "Affiliate Partnerships"]
  }
];

function App() {
  // Advanced matching probability algorithm
  const calculateAdvancedMatchProbability = (userProfile, businessProfile) => {
    let score = 0;
    let maxScore = 0;

    // 1. Industry Similarity and Synergy (25% of total score)
    maxScore += 25;
    const industryScore = calculateIndustryCompatibility(userProfile.industry, businessProfile.industry);
    score += industryScore * 25;

    // 2. Partnership Interests Alignment (20% of total score)
    maxScore += 20;
    const partnershipScore = calculatePartnershipAlignment(userProfile.partnerships || [], businessProfile.partnerships || []);
    score += partnershipScore * 20;

    // 3. Geographic Compatibility (15% of total score)
    maxScore += 15;
    const geographicScore = calculateGeographicCompatibility(userProfile, businessProfile);
    score += geographicScore * 15;

    // 4. Experience Level Match (15% of total score)
    maxScore += 15;
    const experienceScore = calculateExperienceCompatibility(userProfile.yearsInBusiness, businessProfile.yearsInBusiness);
    score += experienceScore * 15;

    // 5. Service Area Overlap (10% of total score)
    maxScore += 10;
    const serviceAreaScore = calculateServiceAreaOverlap(userProfile.serviceAreas || [], businessProfile.serviceAreas || []);
    score += serviceAreaScore * 10;

    // 6. Profile Keywords and Description Match (10% of total score)
    maxScore += 10;
    const keywordScore = calculateKeywordMatch(userProfile, businessProfile);
    score += keywordScore * 10;

    // 7. Partnership Scope Compatibility (5% of total score)
    maxScore += 5;
    const scopeScore = calculateScopeCompatibility(userProfile.seekingPartnership, businessProfile.seekingPartnership);
    score += scopeScore * 5;

    return Math.round((score / maxScore) * 100);
  };

  const calculateIndustryCompatibility = (industry1, industry2) => {
    if (industry1 === industry2) return 1.0; // Perfect match

    // Define industry synergy matrix - industries that work well together
    const industrySynergies = {
      'Technology': ['Healthcare & Medical', 'Financial Services', 'Education', 'Manufacturing', 'Retail & E-commerce'],
      'Healthcare & Medical': ['Technology', 'Insurance', 'Legal Services', 'Professional Services'],
      'Financial Services': ['Technology', 'Insurance', 'Legal Services', 'Real Estate', 'Professional Services'],
      'Legal Services': ['Insurance', 'Financial Services', 'Real Estate', 'Healthcare & Medical', 'Professional Services'],
      'Insurance': ['Legal Services', 'Financial Services', 'Healthcare & Medical', 'Real Estate', 'Consulting'],
      'Real Estate': ['Financial Services', 'Legal Services', 'Construction', 'Insurance'],
      'Marketing & Advertising': ['Technology', 'Retail & E-commerce', 'Entertainment & Media', 'Hospitality & Tourism'],
      'Manufacturing': ['Technology', 'Transportation & Logistics', 'Construction', 'Energy & Utilities'],
      'Retail & E-commerce': ['Technology', 'Marketing & Advertising', 'Transportation & Logistics'],
      'Construction': ['Real Estate', 'Manufacturing', 'Energy & Utilities', 'Professional Services'],
      'Transportation & Logistics': ['Manufacturing', 'Retail & E-commerce', 'Technology'],
      'Education': ['Technology', 'Professional Services', 'Non-Profit'],
      'Consulting': ['Professional Services', 'Technology', 'Financial Services', 'Insurance'],
      'Professional Services': ['Legal Services', 'Financial Services', 'Consulting', 'Healthcare & Medical'],
      'Entertainment & Media': ['Marketing & Advertising', 'Technology', 'Hospitality & Tourism'],
      'Hospitality & Tourism': ['Entertainment & Media', 'Marketing & Advertising', 'Food & Beverage'],
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

  const calculateGeographicCompatibility = (profile1, profile2) => {
    // If either wants National partnerships, they're compatible
    if (profile1.seekingPartnership === 'National' || profile2.seekingPartnership === 'National') {
      return 1.0;
    }
    
    // Both want Local partnerships - check service areas
    if (profile1.seekingPartnership === 'Local' && profile2.seekingPartnership === 'Local') {
      return calculateServiceAreaOverlap(profile1.serviceAreas || [], profile2.serviceAreas || []);
    }
    
    return 0.7; // Mixed preferences
  };

  const calculateExperienceCompatibility = (years1, years2) => {
    const diff = Math.abs(years1 - years2);
    
    // Perfect match for similar experience levels
    if (diff <= 2) return 1.0;
    if (diff <= 5) return 0.8;
    if (diff <= 10) return 0.6;
    
    // Different experience levels can still be valuable (mentor/mentee relationships)
    return 0.4;
  };

  const calculateServiceAreaOverlap = (areas1, areas2) => {
    if (areas1.length === 0 || areas2.length === 0) return 0.5;
    
    // Check for remote work
    const hasRemote1 = areas1.some(area => area.toLowerCase().includes('remote'));
    const hasRemote2 = areas2.some(area => area.toLowerCase().includes('remote'));
    
    if (hasRemote1 || hasRemote2) return 1.0;
    
    const overlap = areas1.filter(area => 
      areas2.some(area2 => 
        area.toLowerCase().includes(area2.toLowerCase()) || 
        area2.toLowerCase().includes(area.toLowerCase())
      )
    );
    
    return overlap.length > 0 ? 0.9 : 0.2;
  };

  const calculateKeywordMatch = (profile1, profile2) => {
    const keywords1 = extractKeywords(profile1.companyDescription || '');
    const keywords2 = extractKeywords(profile2.companyDescription || '');
    
    if (keywords1.length === 0 || keywords2.length === 0) return 0.3;
    
    const overlap = keywords1.filter(keyword => keywords2.includes(keyword));
    return Math.min(overlap.length / Math.max(keywords1.length, keywords2.length), 1.0);
  };

  const extractKeywords = (text) => {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'we', 'our', 'is', 'are', 'a', 'an'];
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 10); // Top 10 keywords
  };

  const calculateScopeCompatibility = (scope1, scope2) => {
    if (scope1 === scope2) return 1.0;
    if (scope1 === 'National' || scope2 === 'National') return 0.8;
    return 0.6;
  };



  const unbanUser = (userId) => {
    const user = allUsers.find(u => u.id === userId);
    if (confirm(`Unban ${user && user.name ? user.name : 'user'} and restore their access to the platform?`)) {
      setAllUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'active', unbannedBy: 'admin', unbannedDate: new Date().toISOString() }
          : user
      ));
      alert(`✅ User ${user && user.name ? user.name : 'user'} has been unbanned and can now access the platform.`);
    }
  };
  
  const waivePremiumFee = (userId) => {
    const user = allUsers.find(u => u.id === userId);
    if (confirm(`Waive premium fee for ${user && user.name ? user.name : 'user'}?`)) {
      setAllUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, accountType: 'premium', premiumWaived: true, waiveDate: new Date().toISOString() }
          : user
      ));
      alert(`✅ Premium fee waived for ${user && user.name ? user.name : 'user'}. They now have premium access at no cost.`);
    }
  };
  
  const deactivatePremiumAccount = (userId) => {
    const user = allUsers.find(u => u.id === userId);
    if (confirm(`Deactivate premium account for ${user && user.name ? user.name : 'user'}?`)) {
      setAllUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, accountType: 'free', premiumWaived: false, deactivationDate: new Date().toISOString() }
          : user
      ));
      alert(`✅ Premium account deactivated for ${user && user.name ? user.name : "user"}. They now have a free account.`);
    }
  };
  
  const deleteAccount = (userId) => {
    const user = allUsers.find(u => u.id === userId);
    if (confirm(`⚠️ WARNING: This will permanently delete ${user && user.name ? user.name : "user"}'s account. This action cannot be undone. Continue?`)) {
      if (confirm(`⚠️ FINAL WARNING: Are you absolutely sure you want to delete ${user && user.name ? user.name : "user"}'s account? All their data will be lost forever.`)) {
        setAllUsers(prev => prev.filter(user => user.id !== userId));
        alert(`✅ Account for ${user && user.name ? user.name : "user"} has been permanently deleted.`);
      }
    }
  };

  // Enhanced sponsorship management with backend integration
  const createSponsorship = async (sponsorshipData) => {
    try {
      // Send to backend first
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/sponsorship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_name: sponsorshipData.companyName,
          offer_name: sponsorshipData.offerName || sponsorshipData.companyName,
          offer: sponsorshipData.offer,
          website: sponsorshipData.website || '',
          logo_url: sponsorshipData.logoUrl || '',
          media_url: sponsorshipData.mediaUrl || '',
          release_date: sponsorshipData.releaseDate || new Date().toISOString().split('T')[0],
          release_time: sponsorshipData.releaseTime || '12:00'
        })
      });

      if (response.ok) {
        const backendSponsorship = await response.json();
        
        // Create local version with 30-day expiry
        const newSponsorship = {
          id: backendSponsorship.id,
          ...sponsorshipData,
          createdDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          status: 'active',
          createdBy: 'admin'
        };
        
        setAdminSponsorships(prev => [newSponsorship, ...prev]);
        
        // Add to live sponsors immediately based on placement
        const sponsorProfile = {
          id: newSponsorship.id,
          type: 'sponsor',
          companyName: newSponsorship.companyName,
          companyDescription: newSponsorship.offer,
          title: newSponsorship.offer,
          description: `Special offer from ${newSponsorship.companyName}`,
          website: newSponsorship.website,
          logo: newSponsorship.logoUrl,
          placement: newSponsorship.placement || ['matchmaker'], // Default to matchmaker if no placement specified
          expiryDate: newSponsorship.expiryDate,
          backgroundColor: "from-blue-600 to-purple-800",
          sponsorBadge: "Featured Sponsor",
          ctaText: "Learn More",
          ctaUrl: newSponsorship.website
        };
        
        setSponsorProfiles(prev => [...prev, sponsorProfile]);
        
        return newSponsorship;
      } else {
        throw new Error('Failed to create sponsorship in backend');
      }
    } catch (error) {
      console.error('Error creating sponsorship:', error);
      // Fallback to local storage if backend fails
      const newSponsorship = {
        id: Date.now(),
        ...sponsorshipData,
        createdDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        createdBy: 'admin'
      };
      
      setAdminSponsorships(prev => [newSponsorship, ...prev]);
      
      const sponsorProfile = {
        id: newSponsorship.id,
        type: 'sponsor',
        companyName: newSponsorship.companyName,
        companyDescription: newSponsorship.offer,
        title: newSponsorship.offer,
        description: `Special offer from ${newSponsorship.companyName}`,
        website: newSponsorship.website,
        logo: newSponsorship.logoUrl,
        placement: newSponsorship.placement || ['matchmaker'],
        expiryDate: newSponsorship.expiryDate,
        backgroundColor: "from-blue-600 to-purple-800",
        sponsorBadge: "Featured Sponsor",
        ctaText: "Learn More",
        ctaUrl: newSponsorship.website
      };
      
      setSponsorProfiles(prev => [...prev, sponsorProfile]);
      
      return newSponsorship;
    }
  };

  // Auto-remove expired ads
  const checkExpiredAds = () => {
    const now = new Date();
    setAdminSponsorships(prev => {
      const updated = prev.map(ad => {
        if (new Date(ad.expiryDate) <= now && ad.status === 'active') {
          return { ...ad, status: 'expired' };
        }
        return ad;
      });
      return updated;
    });
    
    setSponsorProfiles(prev => 
      prev.filter(sponsor => {
        const expiry = new Date(sponsor.expiryDate);
        return expiry > now;
      })
    );
  };

  // Run expiry check every minute
  React.useEffect(() => {
    const interval = setInterval(checkExpiredAds, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Admin mode functions
  const enterAdminMode = () => {
    setIsAdminMode(true);
  };
  
  const exitAdminMode = () => {
    setIsAdminMode(false);
    setAdminCredentials({ email: '', password: '' });
  };
  
  const handleAdminLogin = () => {
    // Check admin credentials
    if (adminCredentials.email === 'thenetworkcolorado@gmail.com' && 
        adminCredentials.password === 'SuccessS2289') {
      setIsAdmin(true);
      setShowAuthModal(false);
      setShowAdminPanel(true);
      alert('✅ Admin login successful. Welcome to the admin panel.');
    } else {
      alert('❌ Invalid admin credentials. Please try again.');
    }
  };
  
  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
    setCurrentAdminPage('dashboard');
    setIsAdminMode(false);
    alert('✅ You have been logged out of the admin panel.');
  };
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

  const handlePaymentMethod = (method) => {
    // In a real app, this would handle different payment methods
    switch(method) {
      case 'stripe':
        alert('🔄 Redirecting to Stripe payment...\n\nIn a production app, this would open Stripe Checkout.');
        handlePremiumUpgrade();
        break;
      case 'paypal':
        alert('🔄 Redirecting to PayPal...\n\nIn a production app, this would open PayPal payment flow.');
        handlePremiumUpgrade();
        break;
      case 'apple':
        alert('🍎 Processing Apple Pay...\n\nIn a production app, this would use Apple Pay API.');
        handlePremiumUpgrade();
        break;
      default:
        handlePremiumUpgrade();
    }
  };
  const saveSettings = () => {
    // Save partnership preferences
    const partnershipCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedPartnerships = Array.from(partnershipCheckboxes).map(cb => cb.nextElementSibling.textContent);
    
    // Save settings to localStorage
    const settingsData = {
      partnerships: selectedPartnerships,
      seekingPartnership: userProfile.seekingPartnership,
      searchRadius: searchRadius,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('alliynsettings', JSON.stringify(settingsData));
    alert('✅ Settings saved successfully! Search radius updated.');
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      // Reset to default values
      setUserProfile(prev => ({ ...prev, seekingPartnership: 'Local' }));
      setSearchRadius(20);
      
      // Clear saved settings
      localStorage.removeItem('alliynsettings');
      
      // Reset checkboxes to checked state
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = true);
      
      alert('Settings reset to defaults.');
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('matchmaker');
  const [messages, setMessages] = useState([]);
  const [deals, setDeals] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState('');
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [currentAdPopup, setCurrentAdPopup] = useState(null);
  const [showMatchTitle, setShowMatchTitle] = useState(false);
  const [currentMatchTitle, setCurrentMatchTitle] = useState('');
  const [profilePreviewMode, setProfilePreviewMode] = useState(false);
  
  // Sponsorship state
  const [sponsorshipRequests, setSponsorshipRequests] = useState([]);
  const [showSponsorshipModal, setShowSponsorshipModal] = useState(false);
  
  // Filtering state
  const [filteredProfiles, setFilteredProfiles] = useState([...mockBusinesses]);
  const [isFilteringProfiles, setIsFilteringProfiles] = useState(false);
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const [adminSponsorships, setAdminSponsorships] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false); // Track if we're in admin login mode
  const [currentAdminPage, setCurrentAdminPage] = useState('dashboard'); // dashboard, sponsorships, users
  
  // Enhanced admin state
  const [showCreateSponsorshipModal, setShowCreateSponsorshipModal] = useState(false);
  const [newSponsorshipData, setNewSponsorshipData] = useState({
    companyName: '',
    offer: '',
    website: '',
    logoUrl: '',
    mediaUrl: '',
    placement: [],
    releaseDate: new Date().toISOString().split('T')[0],
    releaseTime: '12:00'
  });
  const [allUsers, setAllUsers] = useState([
    // Mock users for demo - in real app this would come from backend
    {
      id: 1,
      name: 'John Smith',
      email: 'john@techstartup.com',
      company: 'Tech Startup Inc',
      accountType: 'free',
      joinDate: '2025-06-01',
      lastActive: '2025-06-13',
      industry: 'Technology',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@healthcorp.com',
      company: 'HealthCorp Solutions',
      accountType: 'premium',
      joinDate: '2025-06-05',
      lastActive: '2025-06-12',
      industry: 'Healthcare & Medical',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike@financialgroup.com',
      company: 'Financial Group LLC',
      accountType: 'free',
      joinDate: '2025-06-08',
      lastActive: '2025-06-11',
      industry: 'Financial Services',
      status: 'active'
    }
  ]);
  
  // Sponsor profiles state
  const [sponsorProfiles, setSponsorProfiles] = useState([]);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [liveProfiles, setLiveProfiles] = useState([...mockBusinesses]);
  
  // Account Management
  const [accountType, setAccountType] = useState('free'); // 'free' or 'premium'
  const [swipeCount, setSwipeCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [lastLockoutTime, setLastLockoutTime] = useState(null);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [searchRadius, setSearchRadius] = useState(20); // Local search radius in miles
  
  const [userProfile, setUserProfile] = useState({
    companyName: "Your Company",
    companyDescription: "Enter your company description",
    logo: "",
    ownerName: "Your Name",
    ownerTitle: "Your Title",
    profileImage: "",
    serviceAreas: ["Your City"],
    industry: "Your Industry",
    yearsInBusiness: 1,
    seekingPartnership: "Local",
    partnerships: ["Strategic Alliances"]
  });
  const cardRef = useRef(null);

  // Check lockout status on component mount
  useEffect(() => {
    if (lastLockoutTime && accountType === 'free') {
      const now = new Date().getTime();
      const lockoutEnd = new Date(lastLockoutTime).getTime() + (24 * 60 * 60 * 1000); // 24 hours
      if (now < lockoutEnd) {
        setIsLockedOut(true);
      } else {
        setIsLockedOut(false);
        setSwipeCount(0);
        setMatchCount(0);
      }
    }
  // Load saved settings on component mount
  useEffect(() => {
    const loadSavedSettings = () => {
      try {
        const savedSettings = localStorage.getItem('alliynsettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.searchRadius) {
            setSearchRadius(settings.searchRadius);
          }
          if (settings.seekingPartnership && isAuthenticated) {
            setUserProfile(prev => ({ ...prev, seekingPartnership: settings.seekingPartnership }));
          }
        }
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    };

    loadSavedSettings();
  }, [isAuthenticated]);

  // Check for payment success on component mount
  useEffect(() => {
    const checkPaymentSuccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      
      if (sessionId) {
        try {
          // Poll payment status
          let attempts = 0;
          const maxAttempts = 5;
          const pollInterval = 2000; // 2 seconds
          
          const pollStatus = async () => {
            if (attempts >= maxAttempts) {
              alert('Payment status check timed out. Please check your email for confirmation.');
              return;
            }
            
            try {
              const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/checkout/status/${sessionId}`);
              
              if (response.ok) {
                const statusData = await response.json();
                
                if (statusData.payment_status === 'paid') {
                  setAccountType('premium');
                  setSwipeCount(0);
                  setMatchCount(0);
                  setIsLockedOut(false);
                  setLastLockoutTime(null);
                  
                  alert('🎉 Payment successful! Welcome to Premium! You now have unlimited access to all features.');
                  
                  // Clear URL parameters
                  window.history.replaceState({}, document.title, window.location.pathname);
                  return;
                } else if (statusData.status === 'expired') {
                  alert('❌ Payment session expired. Please try again.');
                  window.history.replaceState({}, document.title, window.location.pathname);
                  return;
                }
                
                // If payment is still pending, continue polling
                attempts++;
                setTimeout(pollStatus, pollInterval);
              } else {
                throw new Error('Failed to check payment status');
              }
            } catch (error) {
              console.error('Error checking payment status:', error);
              alert('❌ Error checking payment status. Please contact support if payment was successful.');
            }
          };
          
          pollStatus();
          
        } catch (error) {
          console.error('Payment verification error:', error);
        }
      }
    };
    
    checkPaymentSuccess();
  }, []);

  // Check for payment success on component mount
  useEffect(() => {
    const checkPaymentSuccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      
      if (sessionId) {
        try {
          // Poll payment status
          let attempts = 0;
          const maxAttempts = 5;
          const pollInterval = 2000; // 2 seconds
          
          const pollStatus = async () => {
            if (attempts >= maxAttempts) {
              alert('Payment status check timed out. Please check your email for confirmation.');
              return;
            }
            
            try {
              const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/checkout/status/${sessionId}`);
              
              if (response.ok) {
                const statusData = await response.json();
                
                if (statusData.payment_status === 'paid') {
                  setAccountType('premium');
                  setSwipeCount(0);
                  setMatchCount(0);
                  setIsLockedOut(false);
                  setLastLockoutTime(null);
                  
                  alert('🎉 Payment successful! Welcome to Premium! You now have unlimited access to all features.');
                  
                  // Clear URL parameters
                  window.history.replaceState({}, document.title, window.location.pathname);
                  return;
                } else if (statusData.status === 'expired') {
                  alert('❌ Payment session expired. Please try again.');
                  window.history.replaceState({}, document.title, window.location.pathname);
                  return;
                }
                
                // If payment is still pending, continue polling
                attempts++;
                setTimeout(pollStatus, pollInterval);
              } else {
                throw new Error('Failed to check payment status');
              }
            } catch (error) {
              console.error('Error checking payment status:', error);
              alert('❌ Error checking payment status. Please contact support if payment was successful.');
            }
          };
          
          pollStatus();
          
        } catch (error) {
          console.error('Payment verification error:', error);
        }
      }
    };
    
    checkPaymentSuccess();
  }, []);

  // Load sponsorship requests on component mount
  useEffect(() => {
    const loadSponsorshipRequests = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/sponsorship`);
        if (response.ok) {
          const requests = await response.json();
          setSponsorshipRequests(requests);
        }
      } catch (error) {
        console.error('Error loading sponsorship requests:', error);
      }
    };

    loadSponsorshipRequests();
  }, []);

  // Update filtered profiles when user preferences change
  useEffect(() => {
    const updateFilteredProfiles = async () => {
      if (!userProfile.seekingPartnership || !isAuthenticated) {
        setFilteredProfiles(liveProfiles);
        return;
      }

      setIsFilteringProfiles(true);
      try {
        const filtered = await getFilteredProfiles();
        setFilteredProfiles(filtered);
      } catch (error) {
        console.error('Error filtering profiles:', error);
        setFilteredProfiles(liveProfiles); // Fallback to all profiles
      } finally {
        setIsFilteringProfiles(false);
      }
    };

    updateFilteredProfiles();
  }, [userProfile.seekingPartnership, userProfile.serviceAreas, liveProfiles, isAuthenticated, searchRadius]);

  // Combine filtered businesses and sponsors for swiping
  const allProfiles = [...filteredProfiles];
  
  // Insert sponsors every 4-5 profiles for optimal ad exposure
  const getProfileAtIndex = (index) => {
    // Show sponsor every 4th profile
    if (index > 0 && index % 4 === 0 && sponsorProfiles.length > 0) {
      const sponsorIndex = Math.floor(index / 4) % sponsorProfiles.length;
      return sponsorProfiles[sponsorIndex];
    }
    return allProfiles[index % allProfiles.length];
  };

  const currentProfile = getProfileAtIndex(currentIndex);
  const isCurrentSponsor = currentProfile && currentProfile.type === 'sponsor';

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

  const handleSignIn = (email, password) => {
    // Simulate sign-in (in real app, this would validate credentials)
    setIsAuthenticated(true);
    setShowAuthModal(false);
    alert('Welcome back to Alliyn!');
  };

  // Calculate match probability based on partnership compatibility
  const calculateMatchProbability = (business1, business2) => {
    return calculateAdvancedMatchProbability(business1, business2);
  };

  // Enhanced badge generation with more fun names and match titles
  const generateBadge = (business1, business2) => {
    const exp1 = business1.yearsInBusiness;
    const exp2 = business2.yearsInBusiness;
    
    // Title matches with fun names
    if (business1.ownerTitle.includes('CEO') && business2.ownerTitle.includes('CEO')) {
      if (exp1 <= 5 && exp2 <= 5) {
        return { 
          name: 'Boss Babies', 
          description: 'Both CEOs with companies under 5 years',
          matchTitle: '👶 Boss Babies in Action!'
        };
      }
      return { 
        name: 'Power Titans', 
        description: 'Two visionary CEO leaders unite',
        matchTitle: '👑 CEO Power Duo!'
      };
    }
    
    if (business1.ownerTitle.includes('Founder') && business2.ownerTitle.includes('Founder')) {
      return { 
        name: 'Dream Builders', 
        description: 'Two founders building the future',
        matchTitle: '🚀 Founder Force Unite!'
      };
    }
    
    if (business1.ownerTitle.includes('Director') && business2.ownerTitle.includes('Director')) {
      return { 
        name: 'Vision Masters', 
        description: 'Directors with aligned strategic vision',
        matchTitle: '🎯 Director Dynasty!'
      };
    }
    
    // Partnership scope matches
    if (business1.seekingPartnership === business2.seekingPartnership) {
      if (business1.seekingPartnership === 'National') {
        return { 
          name: 'National Champions', 
          description: 'Both seeking nationwide partnerships',
          matchTitle: '🌟 National Network Activated!'
        };
      } else {
        return { 
          name: 'Local Heroes', 
          description: 'Perfect local partnership match',
          matchTitle: '🏘️ Local Legends Connected!'
        };
      }
    }
    
    // Industry matches
    if (business1.industry === business2.industry) {
      const industryTitles = {
        'Technology': { name: 'Tech Twins', title: '💻 Tech Titans Collide!' },
        'Health & Medical': { name: 'Health Heroes', title: '🏥 Medical Mavericks!' },
        'Finance & Banking': { name: 'Money Masters', title: '💰 Finance Force!' },
        'Real Estate': { name: 'Property Pros', title: '🏘️ Real Estate Royalty!' },
        'Food & Beverage': { name: 'Culinary Champions', title: '🍽️ Food Empire Builders!' },
        'Automotive & Transportation': { name: 'Mobility Masters', title: '🚗 Transport Titans!' },
        'Content Creation and Photography': { name: 'Creative Collective', title: '📸 Content Kings!' }
      };
      
      const industryData = industryTitles[business1.industry] || { 
        name: 'Industry Twins', 
        title: '🏢 Industry Leaders Unite!' 
      };
      
      return { 
        name: industryData.name, 
        description: `Same industry powerhouses in ${business1.industry}`,
        matchTitle: industryData.title
      };
    }
    
    // Experience level matches
    if (Math.abs(exp1 - exp2) <= 2) {
      if (exp1 <= 3 && exp2 <= 3) {
        return { 
          name: 'Startup Squad', 
          description: 'Both early-stage entrepreneurs',
          matchTitle: '🌱 Startup Squad Assembled!'
        };
      } else if (exp1 >= 7 && exp2 >= 7) {
        return { 
          name: 'Veteran Alliance', 
          description: 'Experienced business leaders',
          matchTitle: '🏆 Veteran Powerhouse!'
        };
      } else {
        return { 
          name: 'Growth Partners', 
          description: 'Similar experience levels',
          matchTitle: '📈 Growth Gang Connected!'
        };
      }
    }
    
    // Partnership type matches
    const commonPartnerships = business1.partnerships.filter(p => 
      business2.partnerships.includes(p)
    );
    
    if (commonPartnerships.includes('Strategic Alliances')) {
      return { 
        name: 'Alliance Masters', 
        description: 'Strategic partnership specialists',
        matchTitle: '🤝 Strategic Alliance Activated!'
      };
    }
    
    if (commonPartnerships.includes('Joint Ventures')) {
      return { 
        name: 'Venture Partners', 
        description: 'Joint venture enthusiasts',
        matchTitle: '🚀 Venture Squad Ready!'
      };
    }
    
    if (commonPartnerships.includes('Co-Branding')) {
      return { 
        name: 'Brand Builders', 
        description: 'Co-branding collaboration experts',
        matchTitle: '🎨 Brand Builder Brigade!'
      };
    }
    
    if (commonPartnerships.includes('Event Collaborations')) {
      return { 
        name: 'Event Dynamos', 
        description: 'Event collaboration specialists',
        matchTitle: '🎉 Event Empire Builders!'
      };
    }
    
    return { 
      name: 'Perfect Match', 
      description: 'Great partnership potential',
      matchTitle: '✨ Perfect Partnership Found!'
    };
  };

  const canSwipe = () => {
    if (accountType === 'premium') return true;
    if (isLockedOut) return false;
    return swipeCount < 10 && matchCount < 1;
  };

  const handleSwipe = useCallback((direction) => {
    if (currentIndex >= allProfiles.length) return;
    
    // Check if user can swipe
    if (!canSwipe()) {
      if (accountType === 'free') {
        setShowUpgradeModal(true);
      }
      return;
    }
    
    setSwipeDirection(direction);
    
    // Increment swipe count for free users
    if (accountType === 'free') {
      setSwipeCount(prev => prev + 1);
    }
    
    // Show popup ads occasionally (every 5 swipes for engagement)
    if (currentIndex > 0 && currentIndex % 5 === 0 && Math.random() > 0.5) {
      const randomAd = adPopups[Math.floor(Math.random() * adPopups.length)];
      setCurrentAdPopup(randomAd);
      setShowAdPopup(true);
    }
    
    setTimeout(() => {
      if (direction === 'right') {
        // Only create matches for regular business profiles, not sponsors
        if (!isCurrentSponsor) {
          // Create a match with probability and badge
          const matchBusiness = allProfiles[(currentIndex + 1) % allProfiles.length];
          const probability = calculateMatchProbability(currentProfile, matchBusiness);
          const badge = generateBadge(currentProfile, matchBusiness);
          
          // Show match title first
          setCurrentMatchTitle(badge.matchTitle);
          setShowMatchTitle(true);
          
          // Then show confetti
          setTimeout(() => {
            setShowConfetti(true);
            setShowMatchTitle(false);
          }, 1500);
          
          setTimeout(() => setShowConfetti(false), 4500);
          
          // Increment match count for free users
          if (accountType === 'free') {
            setMatchCount(prev => prev + 1);
          }
          
          const newMatch = {
            id: Date.now(),
            business: currentProfile,
            matchedWith: matchBusiness,
            probability,
            badge,
            timestamp: new Date().toISOString()
          };
          
          setMatches(prev => [newMatch, ...prev]);
          
          // Check if free user should be locked out
          if (accountType === 'free' && (swipeCount + 1 >= 10 || matchCount + 1 >= 1)) {
            setLastLockoutTime(new Date().toISOString());
            setIsLockedOut(true);
          }
        } else {
          // For sponsor profiles, just show celebration without creating match
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
          setTimeout(() => {
            alert('Thanks for your interest! Check out their exclusive offer.');
          }, 1500);
        }
      }
      
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection('');
    }, 300);
  }, [currentIndex, accountType, swipeCount, matchCount, isCurrentSponsor, allProfiles]);


  const addMessage = (matchId, message) => {
    const newMessage = {
      id: Date.now(),
      matchId,
      message,
      timestamp: new Date().toISOString(),
      sender: 'user'
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate response from the match after a delay
    setTimeout(() => {
      const responses = [
        "That sounds interesting! Tell me more.",
        "I'd love to explore this partnership opportunity.",
        "Great idea! When would be a good time to connect?",
        "This aligns perfectly with our goals.",
        "I'm excited about the potential collaboration.",
        "Let's schedule a call to discuss further.",
        "That's exactly what we've been looking for!",
        "I think there's real synergy here."
      ];
      
      const responseMessage = {
        id: Date.now() + 1,
        matchId,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        sender: 'match'
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const addDeal = (dealDetails) => {
    const newDeal = {
      id: Date.now(),
      ...dealDetails,
      timestamp: new Date().toISOString()
    };
    setDeals(prev => [newDeal, ...prev]);
    setShowAddDealModal(false);
    setSelectedMatch(null);
  };

  const updateUserProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  const saveProfile = () => {
    // Validate required fields
    const requiredFields = {
      'Company Name': userProfile.companyName,
      'Company Description': userProfile.companyDescription,
      'Your Name': userProfile.ownerName,
      'Job Title': userProfile.ownerTitle,
      'Industry': userProfile.industry,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([name, value]) => !value || value.trim() === '')
      .map(([name]) => name);

    if (missingFields.length > 0) {
      alert(`❌ Please fill in the following required fields:\n• ${missingFields.join('\n• ')}`);
      return;
    }

    // Validate service areas
    if (!userProfile.serviceAreas || userProfile.serviceAreas.length === 0) {
      alert('❌ Please add at least one service area.');
      return;
    }

    // Validate partnership interests
    if (!userProfile.partnerships || userProfile.partnerships.length === 0) {
      alert('❌ Please select at least one partnership interest.');
      return;
    }

    try {
      // Update live profiles if this user exists in the system
      setLiveProfiles(prev => {
        const existingIndex = prev.findIndex(profile => profile.id === userProfile.id);
        if (existingIndex >= 0) {
          // Update existing profile
          const updatedProfiles = [...prev];
          updatedProfiles[existingIndex] = { ...userProfile };
          return updatedProfiles;
        } else {
          // Add new profile (shouldn't happen in normal flow, but good fallback)
          return [...prev, { ...userProfile, id: Date.now() }];
        }
      });

      alert('✅ Profile saved successfully! Your updated information will be visible to other users.');
      
      // Optional: Switch to preview mode after saving
      setProfilePreviewMode(true);
    } catch (error) {
      alert('❌ Error saving profile. Please try again.');
      console.error('Profile save error:', error);
    }
  };

  const discardProfileChanges = () => {
    if (confirm('Are you sure you want to discard all changes? This cannot be undone.')) {
      // Reset to the last saved state
      // In a real app, you'd fetch from the server or keep a backup
      alert('Changes discarded. Profile reset to last saved state.');
    }
  };

  // Sponsorship utility functions
  const calculateCustomQuote = (packageType, industry, budget) => {
    let basePrice = 500; // Starting at $500/month
    
    if (packageType.includes('Premium')) {
      basePrice = 1500;
    } else if (packageType.includes('Enterprise')) {
      basePrice = 3000;
    }

    // Industry multipliers
    const industryMultipliers = {
      'Technology': 1.2,
      'Financial Services': 1.3,
      'Healthcare': 1.1,
      'Professional Services': 1.0,
      'Real Estate': 1.1,
      'Other': 1.0
    };

    const multiplier = industryMultipliers[industry] || 1.0;
    return Math.round(basePrice * multiplier);
  };

  const getSponsorshipStats = () => {
    return {
      totalRequests: sponsorshipRequests.length,
      avgBudget: sponsorshipRequests.length > 0 
        ? sponsorshipRequests.reduce((sum, req) => {
            const budget = req.budget && req.budget.replace(/[^\d]/g, '') || '500';
            return sum + parseInt(budget);
          }, 0) / sponsorshipRequests.length
        : 0,
      topIndustries: sponsorshipRequests.reduce((acc, req) => {
        acc[req.industry] = (acc[req.industry] || 0) + 1;
        return acc;
      }, {})
    };
  };

  // Geographic utility functions for location-based filtering
  const getLocationCoordinates = async (location) => {
    // In a real app, you'd use a geocoding service like Google Maps API
    // For demo purposes, using approximate coordinates for major cities
    const cityCoordinates = {
      'san francisco': { lat: 37.7749, lng: -122.4194 },
      'new york': { lat: 40.7128, lng: -74.0060 },
      'los angeles': { lat: 34.0522, lng: -118.2437 },
      'chicago': { lat: 41.8781, lng: -87.6298 },
      'houston': { lat: 29.7604, lng: -95.3698 },
      'phoenix': { lat: 33.4484, lng: -112.0740 },
      'philadelphia': { lat: 39.9526, lng: -75.1652 },
      'denver': { lat: 39.7392, lng: -104.9903 },
      'seattle': { lat: 47.6062, lng: -122.3321 },
      'miami': { lat: 25.7617, lng: -80.1918 },
      'boston': { lat: 42.3601, lng: -71.0589 },
      'austin': { lat: 30.2672, lng: -97.7431 },
      'dallas': { lat: 32.7767, lng: -96.7970 },
      'orange county': { lat: 33.7175, lng: -117.8311 },
      'san diego': { lat: 32.7157, lng: -117.1611 },
      'portland': { lat: 45.5152, lng: -122.6784 },
      'vancouver': { lat: 49.2827, lng: -123.1207 },
      'tampa': { lat: 27.9506, lng: -82.4572 },
      'orlando': { lat: 28.5383, lng: -81.3792 },
      'milwaukee': { lat: 43.0389, lng: -87.9065 },
      'madison': { lat: 43.0731, lng: -89.4012 },
      'salt lake city': { lat: 40.7608, lng: -111.8910 },
      'remote': { lat: 0, lng: 0 } // Special case for remote work
    };
    
    const normalized = location.toLowerCase().trim();
    return cityCoordinates[normalized] || null;
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    // Haversine formula to calculate distance between two points on Earth
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in miles
  };

  const isWithinLocalRange = async (userAreas, businessAreas, maxDistance = searchRadius) => {
    // If either business operates remotely, they can match with anyone
    if (userAreas.some(area => area.toLowerCase().includes('remote')) || 
        businessAreas.some(area => area.toLowerCase().includes('remote'))) {
      return true;
    }

    // Check if any of the user's service areas are within range of business areas
    for (const userArea of userAreas) {
      const userCoords = await getLocationCoordinates(userArea);
      if (!userCoords) continue;

      for (const businessArea of businessAreas) {
        const businessCoords = await getLocationCoordinates(businessArea);
        if (!businessCoords) continue;

        // Special case: if coordinates are (0,0) it means remote
        if (userCoords.lat === 0 || businessCoords.lat === 0) return true;

        const distance = calculateDistance(
          userCoords.lat, userCoords.lng,
          businessCoords.lat, businessCoords.lng
        );

        if (distance <= maxDistance) {
          return true;
        }
      }
    }
    return false;
  };

  // Filter profiles based on partnership preferences
  const getFilteredProfiles = async () => {
    if (!userProfile.seekingPartnership || !userProfile.serviceAreas) {
      return liveProfiles; // No filtering if preferences not set
    }

    // If user seeks National partnerships, show all profiles
    if (userProfile.seekingPartnership === 'National') {
      return liveProfiles;
    }

    // If user seeks Local partnerships, filter by geographic proximity
    if (userProfile.seekingPartnership === 'Local') {
      const filteredProfiles = [];
      
      for (const profile of liveProfiles) {
        // Only show profiles that also seek local partnerships or are within range
        if (profile.seekingPartnership === 'National') {
          // National businesses can match with local businesses
          filteredProfiles.push(profile);
        } else if (profile.seekingPartnership === 'Local') {
          // Check if they're within the user's selected radius
          const isWithinRange = await isWithinLocalRange(
            userProfile.serviceAreas || [],
            profile.serviceAreas || [],
            searchRadius
          );
          if (isWithinRange) {
            filteredProfiles.push(profile);
          }
        }
      }
      
      return filteredProfiles;
    }

    return liveProfiles;
  };

  const handleImageUpload = (file, type) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, GIF, etc.)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB. Please choose a smaller image.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      if (type === 'profile') {
        setUserProfile(prev => ({ ...prev, profileImage: base64Image }));
        alert('✅ Profile photo updated! Remember to save your changes.');
      } else if (type === 'logo') {
        setUserProfile(prev => ({ ...prev, logo: base64Image }));
        alert('✅ Company logo updated! Remember to save your changes.');
      }
    };
    reader.onerror = () => {
      alert('❌ Error reading the image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Calculate leaderboard stats
  const getLeaderboardStats = () => {
    // Match leaders
    const matchCounts = {};
    matches.forEach(match => {
      const company = match.business.companyName;
      matchCounts[company] = (matchCounts[company] || 0) + 1;
    });

    // Deal leaders  
    const dealCounts = {};
    const dealValues = {};
    deals.forEach(deal => {
      const company = deal.companyName || 'Your Company';
      dealCounts[company] = (dealCounts[company] || 0) + 1;
      
      // Extract numeric value from deal value string
      const value = parseFloat(deal.dealValue && deal.dealValue.replace(/[$,]/g, '') || 0);
      dealValues[company] = (dealValues[company] || 0) + value;
    });

    const matchLeaders = Object.entries(matchCounts)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const dealLeaders = Object.entries(dealCounts)
      .map(([company, count]) => ({ 
        company, 
        count, 
        totalValue: dealValues[company] || 0 
      }))
      .sort((a, b) => b.count - a.count || b.totalValue - a.totalValue)
      .slice(0, 5);

    return { matchLeaders, dealLeaders };
  };

  const getLockoutTimeRemaining = () => {
    if (!lastLockoutTime) return '';
    const now = new Date().getTime();
    const lockoutEnd = new Date(lastLockoutTime).getTime() + (24 * 60 * 60 * 1000);
    const remaining = Math.max(0, lockoutEnd - now);
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const renderAuthModal = () => {
    if (authMode === 'signup') {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">A</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Alliyn</h2>
                <p className="text-gray-600">Create your business profile and start matching!</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                  email: formData.get('email'),
                  password: formData.get('password'),
                  ownerName: formData.get('ownerName'),
                  ownerTitle: formData.get('ownerTitle'),
                  companyName: formData.get('companyName'),
                  companyDescription: formData.get('companyDescription'),
                  industry: formData.get('industry'),
                  yearsInBusiness: formData.get('yearsInBusiness'),
                  seekingPartnership: formData.get('seekingPartnership'),
                  serviceAreas: formData.get('serviceAreas'),
                  partnerships: Array.from(formData.getAll('partnerships'))
                };
                handleSignUp(data);
              }} className="space-y-4">
                
                {/* Account Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="ownerName"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input 
                      type="text" 
                      name="ownerTitle"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Company Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    name="companyName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                  <textarea 
                    name="companyDescription"
                    rows="2"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <select 
                      name="industry"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select industry</option>
                      <option value="Health & Medical">Health & Medical</option>
                      <option value="Retail">Retail</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Finance & Banking">Finance & Banking</option>
                      <option value="Technology">Technology</option>
                      <option value="Automotive & Transportation">Automotive & Transportation</option>
                      <option value="Energy & Utilities">Energy & Utilities</option>
                      <option value="Construction & Home Development">Construction & Home Development</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Education">Education</option>
                      <option value="Content Creation and Photography">Content Creation and Photography</option>
                      <option value="Hospitality & Leisure">Hospitality & Leisure</option>
                      <option value="Agriculture & Forestry">Agriculture & Forestry</option>
                      <option value="Consumer Goods">Consumer Goods</option>
                      <option value="Waste Management & Environmental Services">Waste Management & Environmental Services</option>
                      <option value="Marketing & Advertising">Marketing & Advertising</option>
                      <option value="Financial Technology">Financial Technology</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Health & Wellness">Health & Wellness</option>
                      <option value="Supply Chain Management">Supply Chain Management</option>
                      <option value="Education Technology">Education Technology</option>
                      <option value="Renewable Energy">Renewable Energy</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years in Business</label>
                    <input 
                      type="number" 
                      name="yearsInBusiness"
                      min="0"
                      max="100"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Areas (comma-separated)</label>
                  <input 
                    type="text" 
                    name="serviceAreas"
                    placeholder="e.g., San Francisco, New York, Remote"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partnership Scope</label>
                  <select 
                    name="seekingPartnership"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Local">Local Partnerships</option>
                    <option value="National">National Partnerships</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Interests</label>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {["Strategic Alliances", "Joint Ventures", "Co-Branding", "Affiliate Partnerships"].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          name="partnerships"
                          value={type}
                          className="h-3 w-3 text-purple-600 rounded"
                        />
                        <span className="text-xs text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Sign In Instead
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }

    // Sign In Modal
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-lg shadow-xl max-w-md w-full ${isAdminMode ? 'bg-red-50 border-2 border-red-500' : 'bg-white'}`}>
          <div className="p-6">
            {/* Admin Mode Banner */}
            {isAdminMode && (
              <div className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <span>🔐</span>
                  <span className="font-bold">ADMIN LOGIN MODE</span>
                </div>
                <button
                  onClick={exitAdminMode}
                  className="mt-2 text-xs underline hover:no-underline"
                >
                  ← Exit Admin Mode
                </button>
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isAdminMode 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}>
                <span className="text-white font-bold text-2xl">{isAdminMode ? '🔐' : 'A'}</span>
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${isAdminMode ? 'text-red-800' : 'text-gray-800'}`}>
                {isAdminMode ? 'Admin Access Required' : 'Welcome Back'}
              </h2>
              <p className={`${isAdminMode ? 'text-red-600' : 'text-gray-600'}`}>
                {isAdminMode ? 'Enter admin credentials to access admin panel' : 'Sign in to continue matching with businesses'}
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (isAdminMode) {
                const formData = new FormData(e.target);
                setAdminCredentials({
                  email: formData.get('email'),
                  password: formData.get('password')
                });
                handleAdminLogin();
              } else {
                const formData = new FormData(e.target);
                handleSignIn(formData.get('email'), formData.get('password'));
              }
            }} className="space-y-4">
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isAdminMode ? 'text-red-700' : 'text-gray-700'}`}>
                  {isAdminMode ? 'Admin Email' : 'Email'}
                </label>
                <input 
                  type="email" 
                  name="email"
                  required
                  defaultValue={isAdminMode ? adminCredentials.email : ''}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                    isAdminMode 
                      ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder={isAdminMode ? 'thenetworkcolorado@gmail.com' : 'your@email.com'}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isAdminMode ? 'text-red-700' : 'text-gray-700'}`}>
                  {isAdminMode ? 'Admin Password' : 'Password'}
                </label>
                <input 
                  type="password" 
                  name="password"
                  required
                  defaultValue={isAdminMode ? adminCredentials.password : ''}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                    isAdminMode 
                      ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder={isAdminMode ? 'Admin password' : 'Enter your password'}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                {!isAdminMode ? (
                  <>
                    <button 
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Create Account
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      type="button"
                      onClick={exitAdminMode}
                      className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      🔐 Admin Login
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderMatchmaker = () => {
    if (currentIndex >= allProfiles.length * 2) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">You've seen all businesses!</h2>
            <p className="text-gray-600">Check your matches in the sidebar</p>
            <button 
              onClick={() => setCurrentIndex(0)}
              className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
            >
              Start Over
            </button>
          </div>
        </div>
      );
    }

    // Show lockout screen for free users
    if (accountType === 'free' && isLockedOut) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center bg-white rounded-lg shadow-xl p-8 max-w-md">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Free Limit Reached</h2>
            <p className="text-gray-600 mb-4">
              You've used your free daily limit (10 swipes or 1 match). 
              Upgrade to Premium for unlimited matching!
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Time remaining: <span className="font-bold">{getLockoutTimeRemaining()}</span></p>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all font-bold"
            >
              Upgrade to Premium - $19.99
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Free User Swipe Counter */}
        {accountType === 'free' && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-4 z-10">
            <div className="text-center">
              <p className="text-sm text-gray-600">Free Account</p>
              <p className="text-xs text-gray-500">Swipes: {swipeCount}/10</p>
              <p className="text-xs text-gray-500">Matches: {matchCount}/1</p>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="mt-2 text-xs bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 transition-colors"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}

        {/* Filtering Status Indicator */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-4 z-10">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {userProfile.seekingPartnership === 'Local' ? '📍 Local Partnerships' : '🌍 National Partnerships'}
            </p>
            <p className="text-xs text-gray-500">
              {isFilteringProfiles ? 'Filtering...' : `${filteredProfiles.length} businesses available`}
            </p>
            {userProfile.seekingPartnership === 'Local' && (
              <p className="text-xs text-purple-600 mt-1">Within 20 miles of your areas</p>
            )}
          </div>
        </div>

        {/* Match Title Display */}
        {showMatchTitle && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="match-title bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-2xl">
              <h3 className="text-2xl font-bold text-center">{currentMatchTitle}</h3>
            </div>
          </div>
        )}

        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="confetti-container">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'][Math.floor(Math.random() * 7)]
                  }}
                />
              ))}
            </div>
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="match-celebration bg-white rounded-lg p-8 shadow-2xl">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">It's a Match!</h3>
                  <p className="text-gray-600">Great partnership potential detected!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative w-full max-w-md">
          {/* Sponsor Card */}
          {isCurrentSponsor ? (
            <div 
              ref={cardRef}
              className={`profile-card-enhanced ${swipeDirection ? `swipe-${swipeDirection}` : ''} 
                transform transition-all duration-300 hover:scale-105`}
            >
              {/* Sponsor Header */}
              <div className={`relative h-48 bg-gradient-to-br ${currentProfile.backgroundColor} p-6`}>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold backdrop-blur-sm">
                    {currentProfile.sponsorBadge}
                  </span>
                </div>
                <div className="flex items-start justify-between text-white">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{currentProfile.companyName}</h2>
                    <p className="text-sm opacity-90 leading-relaxed">{currentProfile.companyDescription}</p>
                  </div>
                  <img 
                    src={currentProfile.logo} 
                    alt="Sponsor Logo"
                    className="w-16 h-16 rounded-xl bg-white/20 object-cover ml-4"
                  />
                </div>
              </div>

              {/* Sponsor Content */}
              <div className="p-6">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 mb-4">
                    <h3 className="ad-header text-lg text-gray-800 mb-2">Exclusive Offer for Alliyn Members</h3>
                    <p className="text-sm text-gray-600">Join thousands of successful businesses already using this platform</p>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:shadow-lg transition-all">
                    {currentProfile.ctaText}
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    Sponsored content • Learn more about partnership opportunities
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Regular Business Card */
            <div 
              ref={cardRef}
              className={`profile-card-modern ${swipeDirection ? `swipe-${swipeDirection}` : ''} 
                transform transition-all duration-300 hover:scale-105`}
            >
              <div className="status-indicator-modern"></div>
              
              {/* Profile Avatar */}
              <img 
                src={currentProfile.profileImage} 
                alt={currentProfile.ownerName}
                className="profile-avatar-modern"
              />
              
              {/* Profile Info */}
              <h3 className="profile-name-modern">{currentProfile.ownerName}</h3>
              <p className="profile-status-modern">{currentProfile.ownerTitle}</p>
              
              {/* Match Probability */}
              <div className="match-indicator-modern">
                {calculateAdvancedMatchProbability(userProfile, currentProfile)}% Match
              </div>
              
              {/* Company Section */}
              <div className="company-section-modern">
                <div className="company-name-modern flex items-center gap-2">
                  <img 
                    src={currentProfile.logo || 'https://via.placeholder.com/20x20?text=🏢'} 
                    alt="Company Logo"
                    className="w-5 h-5 rounded object-fit-cover"
                  />
                  {currentProfile.companyName}
                </div>
                <div className="company-industry-modern">{currentProfile.industry}</div>
                <div className="company-description-modern">{currentProfile.companyDescription}</div>
              </div>
              
              {/* Info Grid */}
              <div className="info-grid-modern">
                <div className="info-item-modern">
                  <div className="info-label-modern">Experience</div>
                  <div className="info-value-modern">{currentProfile.yearsInBusiness}y</div>
                </div>
                <div className="info-item-modern">
                  <div className="info-label-modern">Scope</div>
                  <div className="info-value-modern">{currentProfile.seekingPartnership}</div>
                </div>
              </div>
              
              {/* Service Areas */}
              <div className="service-areas-modern">
                {currentProfile.serviceAreas && currentProfile.serviceAreas.slice(0, 3).map((area, index) => (
                  <span key={index} className="service-area-modern">
                    {area}
                  </span>
                ))}
              </div>
              
              {/* Partnership Tags */}
              <div className="tags-section-modern">
                {currentProfile.partnerships && currentProfile.partnerships.slice(0, 2).map((partnership, index) => (
                  <span key={index} className={`tag-modern ${index === 0 ? 'primary' : ''}`}>
                    {partnership}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Swipe Buttons */}
          <div className="flex justify-center space-x-8 mt-8">
            <button 
              onClick={() => handleSwipe('left')}
              disabled={!canSwipe()}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl transition-all hover:scale-110 shadow-lg ${
                canSwipe() 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isCurrentSponsor ? '⏭' : '✕'}
            </button>
            <button 
              onClick={() => handleSwipe('right')}
              disabled={!canSwipe()}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl transition-all hover:scale-110 shadow-lg ${
                canSwipe() 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isCurrentSponsor ? '📞' : '🤝'}
            </button>
          </div>
          
          {/* Advertisement Banner */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="ad-header text-sm text-gray-800">Sponsored by TechCorp Solutions</h4>
                <p className="text-xs text-gray-600">Enterprise software solutions for growing businesses</p>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded text-xs hover:bg-blue-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMessages = () => (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="heading-lg text-gray-800 mb-2">Messages</h2>
          <p className="body-text text-gray-600">Connect with your business matches</p>
        </div>
        
        {matches.length === 0 ? (
          <div className="text-center text-gray-500 mt-12 bg-white rounded-2xl p-12 shadow-sm">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="title text-xl mb-2">No conversations yet</h3>
            <p className="body-text">Start swiping to find potential partners and begin meaningful conversations!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {matches
              .sort((a, b) => {
                // Sort by latest message activity
                const aMessages = messages.filter(msg => msg.matchId === a.id);
                const bMessages = messages.filter(msg => msg.matchId === b.id);
                const aLatest = aMessages.length > 0 ? new Date(aMessages[aMessages.length - 1].timestamp) : new Date(a.matchDate || 0);
                const bLatest = bMessages.length > 0 ? new Date(bMessages[bMessages.length - 1].timestamp) : new Date(b.matchDate || 0);
                return bLatest - aLatest; // Newest first
              })
              .map((match) => {
              const matchMessages = messages.filter(msg => msg.matchId === match.id);
              
              return (
                <div key={match.id} className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                  {/* Compact Profile Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={match.business.profileImage} 
                      alt={match.business.ownerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 title">{match.business.ownerName}</div>
                      <div className="text-sm text-gray-600 body-text">{match.business.ownerTitle}</div>
                      <div className="text-sm text-blue-600 font-medium flex items-center gap-1">
                        <img 
                          src={match.business.logo || 'https://via.placeholder.com/16x16?text=🏢'} 
                          alt="Company Logo"
                          className="w-4 h-4 rounded"
                        />
                        <span className="title">{match.business.companyName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500 body-text">Active</span>
                    </div>
                  </div>
                  
                  {/* Compact Message Thread */}
                  <div className="messages-container">
                    <div className="message-thread" style={{maxHeight: '150px'}}>
                      {matchMessages.length === 0 ? (
                        <div className="text-center text-gray-400 py-3">
                          <p className="text-sm body-text">👋 Say hello!</p>
                        </div>
                      ) : (
                        matchMessages.map((msg) => {
                          const isUserMessage = msg.sender === 'user';
                          const messageDate = new Date(msg.timestamp);
                          const now = new Date();
                          const isToday = messageDate.toDateString() === now.toDateString();
                          const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === messageDate.toDateString();
                          
                          let dateDisplay;
                          if (isToday) {
                            dateDisplay = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          } else if (isYesterday) {
                            dateDisplay = 'Yesterday ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          } else {
                            dateDisplay = messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
                                         messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          }
                          
                          return (
                            <div key={msg.id} className="mb-3">
                              {/* Message Timestamp */}
                              <div className="text-xs text-gray-400 mb-1 text-center body-text" style={{color: '#6b7280'}}>
                                {dateDisplay}
                              </div>
                              {/* Message Bubble */}
                              <div className={`message-bubble ${isUserMessage ? 'message-sent' : 'message-received'}`}>
                                <div className="message-text">{msg.message}</div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    
                    <div className="message-input-container">
                      <input 
                        type="text" 
                        placeholder="iMessage"
                        className="message-input body-text"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            addMessage(match.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button 
                        className="send-button"
                        onClick={(e) => {
                          const input = e.target.parentElement.querySelector('.message-input');
                          if (input.value.trim()) {
                            addMessage(match.id, input.value);
                            input.value = '';
                          }
                        }}
                      >
                        <span>↑</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderLeaderboard = () => {
    const { matchLeaders, dealLeaders } = getLeaderboardStats();
    
    return (
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="heading-lg text-gray-800 mb-2">Leaderboard</h2>
            <p className="body-text text-gray-600">Top performers in business networking</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Match Leaders */}
            <div className="leaderboard-container">
              <div className="leaderboard-header">
                <h3 className="leaderboard-title">Top Matchers</h3>
                <p className="leaderboard-subtitle">Most connections this month</p>
              </div>
              <div className="leaderboard-list">
                {matchLeaders.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">🤝</div>
                    <p>Start matching to see rankings!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {matchLeaders.map((leader, index) => (
                      <div key={leader.company} className="leaderboard-item">
                        <div className={`leaderboard-rank ${
                          index === 0 ? 'rank-1' : 
                          index === 1 ? 'rank-2' : 
                          index === 2 ? 'rank-3' : 'rank-other'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </div>
                        <img 
                          src={leader.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.company)}&background=random`}
                          alt={leader.company}
                          className="w-10 h-10 rounded-full object-cover ml-3"
                        />
                        <div className="leaderboard-info">
                          <div className="leaderboard-name">{leader.company}</div>
                          <div className="leaderboard-details">
                            {leader.count} successful {leader.count === 1 ? 'match' : 'matches'}
                          </div>
                        </div>
                        <div className="leaderboard-score">{leader.count}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Deal Leaders */}
            <div className="leaderboard-container">
              <div className="leaderboard-header" style={{background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'}}>
                <h3 className="leaderboard-title">Deal Makers</h3>
                <p className="leaderboard-subtitle">Highest value partnerships</p>
              </div>
              <div className="leaderboard-list">
                {dealLeaders.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">🏆</div>
                    <p>Close your first deal to appear here!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dealLeaders.map((leader, index) => (
                      <div key={leader.company} className="leaderboard-item">
                        <div className={`leaderboard-rank ${
                          index === 0 ? 'rank-1' : 
                          index === 1 ? 'rank-2' : 
                          index === 2 ? 'rank-3' : 'rank-other'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </div>
                        <img 
                          src={leader.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.company)}&background=random`}
                          alt={leader.company}
                          className="w-10 h-10 rounded-full object-cover ml-3"
                        />
                        <div className="leaderboard-info">
                          <div className="leaderboard-name">{leader.company}</div>
                          <div className="leaderboard-details">
                            {leader.count} deals • ${leader.totalValue.toLocaleString()}
                          </div>
                        </div>
                        <div className="leaderboard-score">${(leader.totalValue / 1000).toFixed(0)}K</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="profile-card text-center">
              <div className="text-4xl font-bold text-gray-700 mb-2">{matches.length}</div>
              <div className="text-gray-600 font-medium">Total Matches</div>
              <div className="mt-2 text-sm text-gray-500">Connections made</div>
            </div>
            <div className="profile-card text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{deals.length}</div>
              <div className="text-gray-600 font-medium">Deals Closed</div>
              <div className="mt-2 text-sm text-gray-500">Successful partnerships</div>
            </div>
            <div className="profile-card text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                ${deals.reduce((sum, deal) => sum + (parseFloat(deal.dealValue && deal.dealValue.replace(/[$,]/g, '') || 0)), 0).toLocaleString()}
              </div>
              <div className="text-gray-600 font-medium">Total Deal Value</div>
              <div className="mt-2 text-sm text-gray-500">Revenue generated</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDeals = () => (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Deals Closed</h2>
        <button 
          onClick={() => setShowAddDealModal(true)}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Deal</span>
        </button>
      </div>
      
      {deals.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <div className="text-6xl mb-4">🤝</div>
          <p className="text-lg mb-2">No deals closed yet!</p>
          <p className="text-sm">Click "Add Deal" to record your first successful partnership</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{deal.dealName}</h3>
                  <p className="text-green-600 font-bold text-lg">{deal.dealValue}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    with <span className="font-medium">{deal.partnerCompany}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {deal.partnershipType}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(deal.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-3">{deal.description}</p>
              {deal.matchSource && (
                <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    <span className="font-medium">Match Source:</span> Found through {deal.matchSource}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Deal Modal */}
      {showAddDealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Add New Deal</h3>
                <button 
                  onClick={() => setShowAddDealModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const dealDetails = {
                  dealName: formData.get('dealName'),
                  dealValue: formData.get('dealValue'),
                  partnerCompany: formData.get('partnerCompany'),
                  partnershipType: formData.get('partnershipType'),
                  description: formData.get('description'),
                  matchSource: formData.get('matchSource'),
                  companyName: formData.get('companyName') || 'Your Company'
                };
                addDeal(dealDetails);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Company Name
                  </label>
                  <input 
                    type="text" 
                    name="companyName"
                    placeholder="Enter your company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Name
                  </label>
                  <input 
                    type="text" 
                    name="dealName"
                    placeholder="e.g., Marketing Partnership Agreement"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Value
                  </label>
                  <input 
                    type="text" 
                    name="dealValue"
                    placeholder="e.g., $50,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partner Company
                  </label>
                  <input 
                    type="text" 
                    name="partnerCompany"
                    placeholder="Company you partnered with"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partnership Type
                  </label>
                  <select 
                    name="partnershipType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select partnership type</option>
                    <option value="Strategic Alliances">Strategic Alliances</option>
                    <option value="Joint Ventures">Joint Ventures</option>
                    <option value="Co-Branding">Co-Branding</option>
                    <option value="Affiliate Partnerships">Affiliate Partnerships</option>
                    <option value="Sponsorship Agreements">Sponsorship Agreements</option>
                    <option value="Event Collaborations">Event Collaborations</option>
                    <option value="Incubator/Accelerator Collaborations">Incubator/Accelerator Collaborations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How did you find this partner?
                  </label>
                  <select 
                    name="matchSource"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select source (optional)</option>
                    <option value="Alliyn App Match">Alliyn App Match</option>
                    <option value="Networking Event">Networking Event</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Outreach">Cold Outreach</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Description
                  </label>
                  <textarea 
                    name="description"
                    placeholder="Brief description of the partnership deal..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    required
                  ></textarea>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddDealModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Add Deal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="flex-1 p-8">
      <div className="flex items-center space-x-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
        {accountType === 'premium' && (
          <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-bold flex items-center space-x-2">
            <span>⭐</span>
            <span>PREMIUM</span>
          </span>
        )}
        <button
          onClick={() => setProfilePreviewMode(!profilePreviewMode)}
          className={`px-4 py-2 rounded-lg transition-all ${
            profilePreviewMode 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {profilePreviewMode ? '✏️ Edit Profile' : '👀 Preview Profile'}
        </button>
      </div>
      
      {profilePreviewMode ? (
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-bold text-center mb-6 text-gray-700">
            How others see your profile:
          </h3>
          
          {/* Modern Profile Card - Matching Matchmaker Design */}
          <div className="profile-card-modern">
            <div className="status-indicator-modern"></div>
            
            {/* Profile Avatar */}
            <img 
              src={userProfile.profileImage || 'https://via.placeholder.com/80x80?text=👤'} 
              alt={userProfile.ownerName}
              className="profile-avatar-modern"
            />
            
            {/* Profile Info */}
            <h3 className="profile-name-modern">{userProfile.ownerName}</h3>
            <p className="profile-status-modern">{userProfile.ownerTitle}</p>
            
            {/* Match Probability */}
            <div className="match-indicator-modern">
              95% Match Example
            </div>
            
            {/* Company Section */}
            <div className="company-section-modern">
              <div className="company-name-modern flex items-center gap-2">
                <img 
                  src={userProfile.logo || 'https://via.placeholder.com/20x20?text=🏢'} 
                  alt="Company Logo"
                  className="w-5 h-5 rounded object-fit-cover"
                />
                {userProfile.companyName}
              </div>
              <div className="company-industry-modern">{userProfile.industry}</div>
              <div className="company-description-modern">{userProfile.companyDescription}</div>
            </div>
            
            {/* Info Grid */}
            <div className="info-grid-modern">
              <div className="info-item-modern">
                <div className="info-label-modern">Experience</div>
                <div className="info-value-modern">{userProfile.yearsInBusiness}y</div>
              </div>
              <div className="info-item-modern">
                <div className="info-label-modern">Scope</div>
                <div className="info-value-modern">{userProfile.seekingPartnership}</div>
              </div>
            </div>
            
            {/* Service Areas */}
            <div className="service-areas-modern">
              {userProfile.serviceAreas && userProfile.serviceAreas.slice(0, 3).map((area, index) => (
                <span key={index} className="service-area-modern">
                  {area}
                </span>
              ))}
            </div>
            
            {/* Partnership Tags */}
            <div className="tags-section-modern">
              {userProfile.partnerships && userProfile.partnerships.slice(0, 2).map((partnership, index) => (
                <span key={index} className={`tag-modern ${index === 0 ? 'primary' : ''}`}>
                  {partnership}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-8 text-purple-600">
            Edit Your Business Profile
          </h3>
          
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            {/* Profile Images */}
            <div className="grid md:grid-cols-2 gap-8 pb-6 border-b">
              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-4">Company Logo</h4>
                <div className="mb-4 flex justify-center">
                  {userProfile.logo ? (
                    <img src={userProfile.logo} alt="Logo" className="w-24 h-24 rounded-xl object-cover border-4 border-purple-100" />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gray-200 border-4 border-purple-100 flex items-center justify-center">
                      <span className="text-2xl">🏢</span>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors inline-block">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files[0], 'logo')} />
                  📷 Upload
                </label>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-4">Your Photo</h4>
                <div className="mb-4 flex justify-center">
                  {userProfile.profileImage ? (
                    <img src={userProfile.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-purple-100" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-purple-100 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors inline-block">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files[0], 'profile')} />
                  📷 Upload
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input 
                  type="text" 
                  value={userProfile.ownerName}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, ownerName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input 
                  type="text" 
                  value={userProfile.ownerTitle}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, ownerTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., CEO, Founder"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input 
                type="text" 
                value={userProfile.companyName}
                onChange={(e) => setUserProfile(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
              <textarea 
                value={userProfile.companyDescription}
                onChange={(e) => setUserProfile(prev => ({ ...prev, companyDescription: e.target.value }))}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Describe what your company does..."
              ></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select 
                  value={userProfile.industry}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare & Medical">Healthcare & Medical</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Marketing & Advertising">Marketing & Advertising</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail & E-commerce">Retail & E-commerce</option>
                  <option value="Construction">Construction</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Transportation & Logistics">Transportation & Logistics</option>
                  <option value="Energy & Utilities">Energy & Utilities</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Legal Services">Legal Services</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                  <option value="Non-Profit">Non-Profit</option>
                  <option value="Entertainment & Media">Entertainment & Media</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years in Business</label>
                <input 
                  type="number" 
                  min="0"
                  value={userProfile.yearsInBusiness}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, yearsInBusiness: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Areas</label>
              <input 
                type="text" 
                value={userProfile.serviceAreas && userProfile.serviceAreas.join(', ') || ''}
                onChange={(e) => setUserProfile(prev => ({ 
                  ...prev, 
                  serviceAreas: e.target.value.split(',').map(area => area.trim()).filter(area => area) 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., San Francisco, New York (comma-separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Partnership Scope</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    name="scope"
                    value="Local"
                    checked={userProfile.seekingPartnership === 'Local'}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, seekingPartnership: e.target.value }))}
                    className="h-4 w-4 text-purple-600"
                  />
                  <span>Local Partnerships</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    name="scope"
                    value="National"
                    checked={userProfile.seekingPartnership === 'National'}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, seekingPartnership: e.target.value }))}
                    className="h-4 w-4 text-purple-600"
                  />
                  <span>National Partnerships</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Partnership Interests</label>
              <div className="grid grid-cols-2 gap-2">
                {["Strategic Alliances", "Joint Ventures", "Co-Branding", "Affiliate Partnerships"].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={userProfile.partnerships && userProfile.partnerships.includes(type) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUserProfile(prev => ({ 
                            ...prev, 
                            partnerships: [...(prev.partnerships || []), type]
                          }));
                        } else {
                          setUserProfile(prev => ({ 
                            ...prev, 
                            partnerships: (prev.partnerships || []).filter(p => p !== type)
                          }));
                        }
                      }}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <button 
                type="button"
                onClick={() => setProfilePreviewMode(true)}
                className="px-6 py-2 border border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                👀 Preview
              </button>
              <button 
                type="button"
                onClick={saveProfile}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                💾 Save Changes
              </button>
            </div>
          </div>

          {/* Settings Actions */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={resetSettings}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              🔄 Reset to Defaults
            </button>
            <button
              onClick={saveSettings}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              💾 Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSponsor = () => (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Become a Sponsor</h2>
          <p className="text-xl text-gray-600 mb-2">Reach thousands of business professionals every day</p>
          <p className="text-gray-500">Connect with decision-makers actively seeking partnerships</p>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white mb-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-sm opacity-90">Monthly Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">2,500+</div>
              <div className="text-sm opacity-90">Business Matches Made</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-sm opacity-90">C-Level Executives</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">$2.5M+</div>
              <div className="text-sm opacity-90">Deals Closed Monthly</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sponsorship Packages */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Advertising Packages</h3>
            
            {/* Basic Package */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">Basic Sponsor</h4>
                  <p className="text-gray-600">Perfect for growing businesses</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">$500</div>
                  <div className="text-sm text-gray-500">/month</div>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Sidebar banner ads (2 rotations/day)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Profile card in swipe deck (1 in 10 profiles)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Monthly performance report</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Basic analytics dashboard</span>
                </li>
              </ul>
              <button 
                onClick={() => {
                  // Scroll to quote form
                  const quoteForm = document.querySelector('.quote-form-section');
                  if (quoteForm) {
                    quoteForm.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                Get Quote - Basic
              </button>
            </div>

            {/* Premium Package */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-purple-500 p-6 mb-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">Most Popular</span>
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">Premium Sponsor</h4>
                  <p className="text-gray-600">Maximum visibility and engagement</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">$1,500</div>
                  <div className="text-sm text-gray-500">/month</div>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Everything in Basic package</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Popup ads between swipes (1 in 5 interactions)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Featured leaderboard placement</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Profile card priority (1 in 4 profiles)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Advanced analytics & targeting</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Dedicated account manager</span>
                </li>
              </ul>
              <button 
                onClick={() => {
                  const quoteForm = document.querySelector('.quote-form-section');
                  if (quoteForm) {
                    quoteForm.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Get Quote - Premium
              </button>
            </div>

            {/* Enterprise Package */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">Enterprise Sponsor</h4>
                  <p className="text-gray-600">Custom solutions for large organizations</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">Custom</div>
                  <div className="text-sm text-gray-500">pricing</div>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Everything in Premium package</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Exclusive app integrations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Co-branded event opportunities</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Direct API access for leads</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Custom creative development</span>
                </li>
              </ul>
              <button className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium">
                Contact Sales
              </button>
            </div>
          </div>

          {/* Quote Request Form */}
          <div className="quote-form-section">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Request a Quote</h3>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const sponsorData = {
                  company_name: formData.get('companyName'),
                  contact_name: formData.get('contactName'),
                  email: formData.get('email'),
                  phone: formData.get('phone') || '',
                  website: formData.get('website') || '',
                  industry: formData.get('industry'),
                  package_type: formData.get('packageType'),
                  budget: formData.get('budget') || '',
                  goals: formData.get('goals'),
                  additional_info: formData.get('additionalInfo') || ''
                };
                
                try {
                  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/sponsorship`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(sponsorData)
                  });
                  
                  if (response.ok) {
                    const result = await response.json();
                    // Update local state for immediate UI feedback
                    setSponsorshipRequests(prev => [result, ...prev]);
                    alert(`🎉 Thank you for your interest! Our team will contact you within 24 hours with a custom quote. Estimated monthly cost: $${result.estimated_quote}`);
                    e.target.reset();
                  } else {
                    throw new Error('Failed to submit request');
                  }
                } catch (error) {
                  alert('❌ Error submitting request. Please try again or contact us directly.');
                  console.error('Sponsorship submission error:', error);
                }
              }} className="space-y-4">
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                    <input 
                      type="text" 
                      name="companyName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                    <input 
                      type="text" 
                      name="contactName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                  <input 
                    type="url" 
                    name="website"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                    <select 
                      name="industry"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select your industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare & Medical">Healthcare & Medical</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Marketing & Advertising">Marketing & Advertising</option>
                      <option value="Education">Education</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail & E-commerce">Retail & E-commerce</option>
                      <option value="Construction">Construction</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Transportation & Logistics">Transportation & Logistics</option>
                      <option value="Energy & Utilities">Energy & Utilities</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Legal Services">Legal Services</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                      <option value="Non-Profit">Non-Profit</option>
                      <option value="Entertainment & Media">Entertainment & Media</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interested Package *</label>
                    <select 
                      name="packageType"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select a package</option>
                      <option value="Basic - $500/month">Basic - $500/month</option>
                      <option value="Premium - $1,500/month">Premium - $1,500/month</option>
                      <option value="Enterprise - Custom">Enterprise - Custom</option>
                      <option value="Custom Package">Custom Package</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget Range</label>
                  <select 
                    name="budget"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select budget range</option>
                    <option value="$500 - $1,000">$500 - $1,000</option>
                    <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                    <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000+">$10,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advertising Goals *</label>
                  <textarea 
                    name="goals"
                    rows="3"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="What are you hoping to achieve with your sponsorship? (e.g., brand awareness, lead generation, partnership opportunities)"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                  <textarea 
                    name="additionalInfo"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Any specific requirements, target demographics, or questions you have..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg hover:shadow-lg transition-all font-bold text-lg"
                >
                  🚀 Request Custom Quote
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-800 mb-4">Need to talk to someone?</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>sponsors@alliyn.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>(555) 123-ALLY</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⏰</span>
                  <span>Monday - Friday, 9 AM - 6 PM PST</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sponsorship Requests (Admin View) */}
        {sponsorshipRequests.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Quote Requests</h3>
            <div className="grid gap-4">
              {sponsorshipRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{request.companyName}</h4>
                      <p className="text-gray-600">{request.contactName} • {request.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {request.packageType}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(request.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Industry:</span> {request.industry}</p>
                      <p><span className="font-medium">Budget:</span> {request.budget || 'Not specified'}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Website:</span> {request.website || 'Not provided'}</p>
                      <p><span className="font-medium">Phone:</span> {request.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-medium">Goals:</span> {request.goals}</p>
                    {request.additionalInfo && (
                      <p className="text-sm mt-2"><span className="font-medium">Additional Info:</span> {request.additionalInfo}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="flex-1 p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Settings</h2>
      <div className="max-w-2xl space-y-6">
        
        {/* Account Plan */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💎</span>
            Account Plan
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">
                Current Plan: <span className={`${accountType === 'premium' ? 'text-yellow-600' : 'text-gray-600'}`}>
                  {accountType === 'premium' ? 'Premium ⭐' : 'Free'}
                </span>
              </p>
              {accountType === 'free' && (
                <p className="text-sm text-gray-500 mt-1">
                  Limited to 10 swipes or 1 match per day
                </p>
              )}
              {accountType === 'premium' && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Unlimited swipes and matches
                </p>
              )}
            </div>
            {accountType === 'free' && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-bold"
              >
                Upgrade to Premium - $19.99
              </button>
            )}
          </div>
        </div>

        {/* Usage Stats for Free Users */}
        {accountType === 'free' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Usage</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Swipes Today:</span>
                <span className="font-medium">{swipeCount}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Matches Today:</span>
                <span className="font-medium">{matchCount}/1</span>
              </div>
              {isLockedOut && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">
                    ⏰ Locked out for: {getLockoutTimeRemaining()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Partnership Preferences</h3>
          <div className="space-y-3">
            {["Strategic Alliances", "Joint Ventures", "Co-Branding", "Affiliate Partnerships", 
              "Sponsorship Agreements", "Event Collaborations", "Incubator/Accelerator Collaborations"].map((type) => (
              <label key={type} className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-purple-600 rounded" />
                <span className="text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Preference</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input 
                type="radio" 
                name="geographic" 
                value="Local"
                checked={userProfile.seekingPartnership === 'Local'}
                onChange={(e) => setUserProfile(prev => ({ ...prev, seekingPartnership: e.target.value }))}
                className="h-4 w-4 text-purple-600" 
              />
              <div>
                <span className="text-gray-700">Local Partnerships</span>
                <p className="text-xs text-gray-500">Within your geographic area</p>
              </div>
            </label>
            <label className="flex items-center space-x-3">
              <input 
                type="radio" 
                name="geographic" 
                value="National"
                checked={userProfile.seekingPartnership === 'National'}
                onChange={(e) => setUserProfile(prev => ({ ...prev, seekingPartnership: e.target.value }))}
                className="h-4 w-4 text-purple-600" 
              />
              <div>
                <span className="text-gray-700">National Partnerships</span>
                <p className="text-xs text-gray-500">Nationwide and international</p>
              </div>
            </label>
          </div>
          
          {userProfile.seekingPartnership === 'Local' && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="text-sm font-medium text-purple-800 mb-3">Local Partnership Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-purple-700 mb-1">Search Radius</label>
                  <select 
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                  >
                    <option value="10">Within 10 miles</option>
                    <option value="20">Within 20 miles (Recommended)</option>
                    <option value="50">Within 50 miles</option>
                    <option value="100">Within 100 miles</option>
                  </select>
                  <p className="text-xs text-purple-600 mt-1">
                    Currently showing {filteredProfiles.length} businesses within {searchRadius} miles
                  </p>
                </div>
                <div className="text-xs text-purple-600">
                  <p>✓ Prioritizes businesses in your service areas</p>
                  <p>✓ Includes businesses open to your location</p>
                  <p>✓ Shows remote-friendly companies</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-purple-600 rounded" />
              <span className="text-gray-700">New Match Notifications</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-purple-600 rounded" />
              <span className="text-gray-700">Message Notifications</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="h-4 w-4 text-purple-600 rounded" />
              <span className="text-gray-700">Deal Opportunity Alerts</span>
            </label>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Upgrade to Premium</h3>
                <p className="text-gray-600">Unlock unlimited business matching!</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Unlimited swipes per day</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Unlimited matches</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">No 24-hour lockouts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Premium badge on profile</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Priority customer support</span>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-yellow-600 mb-2">$19.99</div>
                <p className="text-sm text-gray-500">per month</p>
              </div>

              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => handlePaymentMethod('stripe')}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <span>💳</span>
                  <span>Pay with Credit Card</span>
                </button>
                
                <button 
                  onClick={() => handlePaymentMethod('paypal')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <span>🅿️</span>
                  <span>Pay with PayPal</span>
                </button>
                
                <button 
                  onClick={() => handlePaymentMethod('apple')}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <span>🍎</span>
                  <span>Pay with Apple Pay</span>
                </button>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={upgradeToePremium}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-bold"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Authentication Modal */}
      {!isAuthenticated && showAuthModal && renderAuthModal()}
      
      {/* Main App */}
      {isAuthenticated && (
        <>
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div>
                    <h1 className="heading-md text-gray-800">
                      Alliyn
                    </h1>
                    <p className="body-text text-gray-500">Business Networking</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {accountType === 'premium' && (
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-xs font-bold flex items-center space-x-1">
                      <span>⭐</span>
                      <span>PREMIUM</span>
                    </span>
                  )}
                  <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                    <span className="text-gray-700 font-semibold">{matches.length}</span>
                    <span className="text-gray-600 text-sm">Matches</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex">
            {/* Sidebar */}
            <nav className="w-64 bg-white shadow-lg h-screen sticky top-0 overflow-y-auto">
              <div className="p-6">
                <div className="space-y-2">
                  {[
                    { id: 'matchmaker', name: 'Matchmaker', icon: '💼' },
                    { id: 'messages', name: 'Messages', icon: '💬' },
                    { id: 'leaderboard', name: 'Leaderboard', icon: '🏆' },
                    { id: 'deals', name: 'Deals Closed', icon: '🤝' },
                    { id: 'profile', name: 'My Profile', icon: '👤' },
                    { id: 'sponsor', name: 'Become a Sponsor', icon: '💰' },
                    { id: 'settings', name: 'Settings', icon: '⚙️' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-gray-800 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <span className="font-medium">{tab.name}</span>
                      {tab.id === 'messages' && matches.length > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {matches.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Sidebar Advertisement */}
                <div className="mt-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-4 border border-green-200">
                  <div className="text-center">
                    <div className="text-2xl mb-2">💼</div>
                    <h4 className="ad-header text-sm text-gray-800 mb-2">Business Accelerator</h4>
                    <p className="text-xs text-gray-600 mb-3">Join our 12-week program and scale your business 10x</p>
                    <button className="w-full bg-green-500 text-white py-2 px-3 rounded text-xs font-medium hover:bg-green-600 transition-colors">
                      Apply Now
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Ad</p>
                  </div>
                </div>

                {/* Second Ad */}
                <div className="mt-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 border border-purple-200">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚀</div>
                    <h4 className="ad-header text-sm text-gray-800 mb-2">Startup Funding</h4>
                    <p className="text-xs text-gray-600 mb-3">Get connected with investors looking for your business</p>
                    <button className="w-full bg-purple-500 text-white py-2 px-3 rounded text-xs font-medium hover:bg-purple-600 transition-colors">
                      Get Funding
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Sponsored</p>
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
              {activeTab === 'matchmaker' && renderMatchmaker()}
              {activeTab === 'messages' && renderMessages()}
              {activeTab === 'leaderboard' && renderLeaderboard()}
              {activeTab === 'deals' && renderDeals()}
              {activeTab === 'profile' && renderProfile()}
              {activeTab === 'sponsor' && renderSponsor()}
              {activeTab === 'settings' && renderSettings()}
            </main>
          </div>
        </>
      )}

      {/* Popup Advertisement Modal */}
      {showAdPopup && currentAdPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className={`relative h-48 bg-gradient-to-r ${currentAdPopup.backgroundColor} p-6`}>
              <button 
                onClick={() => setShowAdPopup(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
              <div className="text-white h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-2">{currentAdPopup.title}</h3>
                <p className="text-white/90">{currentAdPopup.description}</p>
              </div>
            </div>
            <div className="p-6">
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:shadow-lg transition-all mb-3">
                {currentAdPopup.cta}
              </button>
              <button 
                onClick={() => setShowAdPopup(false)}
                className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
