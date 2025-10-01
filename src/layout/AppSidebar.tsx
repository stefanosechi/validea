"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Generazioni Salvate", path: "/generated" },
  { icon: <GridIcon />, name: "My Idea Prompt", path: "/blank" },

  {
    icon: <GridIcon />,
    name: "Business Overview",
    subItems: [
      { name: "Business Viability", path: "/business-overview/business-viability" },
      { name: "Business Overview", path: "/business-overview/overview" }, // cartella: src/app/(admin)/business-overview/overview/page.tsx
    ],
  },

  {
    icon: <GridIcon />,
    name: "Market Research",
    subItems: [
      { name: "Trends in the Market Sector", path: "/market-research/trends-in-the-market-sector" },
      { name: "Competitive Analysis", path: "/market-research/competitive-analysis" },
      { name: "Market Size and Growth Potential", path: "/market-research/market-size-and-growth-potential" },
      { name: "Consumer Behavior", path: "/market-research/consumer-behavior" },
      { name: "Customer Segmentation", path: "/market-research/customer-segmentation" },
      { name: "Regulatory Environment", path: "/market-research/regulatory-environment" },
      { name: "Key Considerations", path: "/market-research/key-considerations" },
    ],
  },

  {
    icon: <GridIcon />,
    name: "Launch and Scale",
    subItems: [
      { name: "MVP Roadmap", path: "/launch-and-scale/mvp-roadmap" },
      { name: "Hiring Roadmap and Cost", path: "/launch-and-scale/hiring-roadmap-and-cost" },
      { name: "Operational Cost", path: "/launch-and-scale/operational-cost" },
      { name: "Tech Stack", path: "/launch-and-scale/tech-stack" },
      { name: "Code / No Code", path: "/launch-and-scale/code-no-code" },
      { name: "AI / ML Implementation", path: "/launch-and-scale/ai-ml-implementation" },
      { name: "Analytics and Metrics", path: "/launch-and-scale/analytics-and-metrics" },
      { name: "Distribution Channels", path: "/launch-and-scale/distribution-channels" },
      { name: "Early User Acquisition Strategy", path: "/launch-and-scale/early-user-acquisition-strategy" },
      { name: "Late Game User Acquisition Strategy", path: "/launch-and-scale/late-game-user-acquisition-strategy" },
      { name: "Partnership and Collaborations", path: "/launch-and-scale/partnership-and-collaborations" },
      { name: "Customer Retention", path: "/launch-and-scale/customer-retention" },
      { name: "Guerrilla Marketing Ideas", path: "/launch-and-scale/guerrilla-marketing-ideas" },
      { name: "Website FAQs", path: "/launch-and-scale/website-faqs" },
      { name: "SEO Teams", path: "/launch-and-scale/seo-teams" },
      { name: "Google / Text Ad Copy", path: "/launch-and-scale/google-text-ad-copy" },
    ],
  },

  {
    icon: <GridIcon />,
    name: "Raise Capital",
    subItems: [
      { name: "Elevator Pitch", path: "/raise-capital/elevator-pitch" },
      { name: "YC-style Pitch Deck", path: "/raise-capital/yc-style-pitch-deck" },
      { name: "Pitch Preparation", path: "/raise-capital/pitch-preparation" },
      { name: "Valuation", path: "/raise-capital/valuation" },
      { name: "Funding Required (Seed/Pre-seed)", path: "/raise-capital/funding-required-seed-preseed" },
      { name: "Investor Outreach", path: "/raise-capital/investor-outreach" },
      { name: "Investor Concerns", path: "/raise-capital/investor-concerns" },
      { name: "Business Introduction", path: "/raise-capital/business-introduction" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main"].forEach((menuType) => {
      const items = navItems;
      items.forEach((nav, index) => {
        nav.subItems?.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: menuType as "main", index });
            submenuMatched = true;
          }
        });
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev?.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, "main")}
              className={`menu-item group ${
                openSubmenu?.type === "main" && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span
                className={`${
                  openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
              >
                <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height: openSubmenu?.index === index ? `${subMenuHeight[`main-${index}`]}px` : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((sub) => (
                  <li key={sub.name}>
                    <Link
                      href={sub.path}
                      className={`menu-dropdown-item ${
                        isActive(sub.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
      ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
              <Image className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        {(isExpanded || isHovered || isMobileOpen) && (
          <div className="mt-4 mb-6 px-1">
            <div className="relative group">
              {/* Idea switcher (placeholder) */}
              <button className="w-full px-4 py-2 text-left bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex justify-between items-center">
                <span className="truncate">Seleziona un’idea...</span>
                <ChevronDownIcon className="w-4 h-4 ml-2" />
              </button>
              <div className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 hidden group-hover:block">
                <ul className="max-h-60 overflow-y-auto">
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">💡 Idea #1</li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">📊 Idea #2</li>
                  <li className="px-4 py-2 text-brand-600 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-t border-gray-200 dark:border-gray-700">
                    ➕ Aggiungi nuova idea
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <nav className="mb-6">
          <h2
            className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
              !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
          >
            {isExpanded || isHovered || isMobileOpen ? "Documentation" : <HorizontaLDots />}
          </h2>
          {renderMenuItems(navItems)}
        </nav>

        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;