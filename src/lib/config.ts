// ==========================================
// FILFORA GHAR - CENTRAL UI CONFIGURATION
// ==========================================
// This file contains all the global toggles and settings you can use
// to quickly alter the look and feel of the application.
// ==========================================

export const siteConfig = {
    // ------------------------------------------------------------------------
    // 1. GLOBAL TYPOGRAPHY
    // Affects: Entire Application (via src/app/layout.tsx)
    // ------------------------------------------------------------------------
    // Change this number (1-20) to instantly swap the font family across the site.
    // 1: Outfit | 2: Inter | 3: Playfair | 4: Merriweather | 5: Montserrat
    // 6: Poppins | 7: Oswald | 8: Dancing Script | 9: Pacifico | 10: Space Mono
    // 11: Quicksand | 12: Cinzel | 13: Josefin | 14: Caveat | 15: Bebas Neue
    // 16: Comfortaa | 17: Cormorant | 18: Lobster | 19: Abril | 20: Righteous
    ACTIVE_FONT_INDEX: 1,

    // ------------------------------------------------------------------------
    // 2. HERO SECTION STYLING
    // Affects: The main banner on the homepage (via src/components/Hero.tsx)
    // ------------------------------------------------------------------------

    // BACKGROUND STYLE
    // Toggle between different high-quality background images:
    // 1 = Original (Dark/Orange focus)
    // 2 = Dark Moody (Cinematic, rustic wooden table, rich Mughlai colors)
    // 3 = Bright Marble (Elegant, sunlit, clean marble table)
    HERO_BG_STYLE: 1 as 1 | 2 | 3,

    // BRANDING/LOGO DISPLAY
    // Set to 'true' to use the image logo (/assets/filfora_ghar_small.png)
    // Set to 'false' to use the stylized text logo ("Filfora Ghar")
    USE_IMAGE_LOGO_IN_HERO: false,

    // TEXT COLOR (If using text logo)
    // Change this number (1-21) to select a different color for the Hero text.
    // 1: Primary Orange | 2: White | 3: Black | 4: Red | 5: Light Orange
    // 6: Amber | 7: Yellow | 8: Lime | 9: Green | 10: Emerald | 11: Teal
    // 12: Cyan | 13: Sky | 14: Blue | 15: Indigo | 16: Violet | 17: Purple
    // 18: Fuchsia | 19: Pink | 20: Rose | 21: Silver
    HERO_TEXT_COLOR: 7,

    // ------------------------------------------------------------------------
    // 3. MOBILE BOTTOM NAVIGATION ICONS
    // Affects: The persistent bottom rail on mobile (via src/components/MobileBottomNav.tsx)
    // ------------------------------------------------------------------------
    // Change this number (1-20) to entirely swap the icon style on the bottom nav.
    // 
    // OUTLINE THEMES
    // 1: Classic Outline           (Home, ShoppingBag, User)
    // 2: Chunky Outline            (Store, ShoppingCart, UserCircle)
    // 3: Minimal Outline           (LayoutGrid, Package, UserRound)
    // 4: Playful Outline           (Tent, ShoppingBasket, Smile)
    // 5: Corporate Outline         (Building2, Archive, Contact)
    //
    // FILLED THEMES
    // 6: Classic Filled            (Home, ShoppingBag, User)
    // 7: Chunky Filled             (Store, ShoppingCart, UserCircle)
    // 8: Minimal Filled            (LayoutGrid, Package, UserRound)
    // 9: Abstract Filled           (Circle, Square, Triangle)
    // 10: Bold Filled              (MapPin, Gift, Heart)
    //
    // DYNAMIC THEMES (Outline when inactive, Filled when active!)
    // 11: Classic Dynamic          (Home, ShoppingBag, User)
    // 12: Chunky Dynamic           (Store, ShoppingCart, UserCircle)
    // 13: Minimal Dynamic          (LayoutGrid, Package, UserRound)
    // 14: Playful Dynamic          (Tent, ShoppingBasket, Smile)
    // 15: Corporate Dynamic        (Building2, Archive, Contact)
    //
    // CREATIVE THEMES (Mix of dynamic, outline, and fun!)
    // 16: Culinary Dynamic         (ChefHat, Utensils, UserCheck)
    // 17: Explorer Dynamic         (Compass, Wallet, Fingerprint)
    // 18: Vacation Dynamic         (Map, Ticket, Sun)
    // 19: Cafe Dynamic             (Coffee, CreditCard, Sparkles)
    // 20: Geometry Dynamic         (Hexagon, Box, Triangle)
    BOTTOM_NAV_ICON_THEME: 16 as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20,
};
