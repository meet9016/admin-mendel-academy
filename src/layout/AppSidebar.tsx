"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  UserCircleIcon,
} from "../icons/index";

/* -----------------------------
  Types
----------------------------- */
type SubItem = { name: string; path: string; pro?: boolean; new?: boolean };
type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  subItems?: SubItem[];
};

/* -----------------------------
  NAV DATA (constant - not re-created)
----------------------------- */
export const MAIN_NAV: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  {
    icon: <ListIcon />,
    name: "Pathology",
    subItems: [
      { name: "live Courses", path: "/liveCourses" },
      { name: "Pre Recorded", path: "/prerecord" },
      { name: "Upcoming Programs", path: "/upcomingProgram" },
    ],
  },
  { icon: <CalenderIcon />, name: "Medical Exam List", path: "/medicalexamlist" },
  { icon: <CalenderIcon />, name: "Blogs", path: "/blogs" },
  { icon: <CalenderIcon />, name: "Question", path: "/question" },
  { icon: <CalenderIcon />, name: "Add To Cart", path: "/addtocart" },
  { icon: <CalenderIcon />, name: "Payment", path: "/payment" },
  {
    icon: <ListIcon />,
    name: "Content Management",
    subItems: [
      { name: "FAQ", path: "/faq" },
      { name: "Terms & Condition", path: "/term-condition" },
      { name: "Contact Us", path: "/contactus" },
    ],
  },
  // { icon: <UserCircleIcon />, name: "User Profile", path: "/profile" },
];

export const OTHER_NAV: NavItem[] = [
  // keep empty or add later
];

/* -----------------------------
  Small presentational components
----------------------------- */

const IconWrapper: React.FC<{ active?: boolean; children: React.ReactNode }> = ({ active, children }) => (
  <span className={active ? "menu-item-icon-active" : "menu-item-icon-inactive"}>{children}</span>
);

const SidebarLink: React.FC<{ item: NavItem; active: boolean; showText: boolean }> = React.memo(({ item, active, showText }) => {
  if (!item.path) return null;
  return (
    <Link href={item.path} className={`menu-item group ${active ? "menu-item-active" : "menu-item-inactive"}`}>
      <IconWrapper active={active}>{item.icon}</IconWrapper>
      {showText && <span className="menu-item-text">{item.name}</span>}
    </Link>
  );
});
SidebarLink.displayName = "SidebarLink";

const SidebarDropdown: React.FC<{
  item: NavItem;
  index: number;
  type: "main" | "others";
  isOpen: boolean;
  toggle: (i: number, t: "main" | "others") => void;
  showText: boolean;
  isActivePath: (p: string) => boolean;
  setRef: (key: string, el: HTMLDivElement | null) => void;
  maxHeight: number | undefined;
}> = React.memo(({ item, index, type, isOpen, toggle, showText, isActivePath, setRef, maxHeight }) => {
  return (
    <div>
      <button
        onClick={() => toggle(index, type)}
        className={`menu-item group ${isOpen ? "menu-item-active" : "menu-item-inactive"} cursor-pointer ${!showText ? "lg:justify-center" : "lg:justify-start"
          }`}
      >
        <IconWrapper active={isOpen}>{item.icon}</IconWrapper>
        {showText && <span className="menu-item-text">{item.name}</span>}
        {showText && (
          <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-500" : ""}`} />
        )}
      </button>

      {/* Submenu - animate using maxHeight to reduce layout thrash */}
      <div
        ref={(el) => setRef(`${type}-${index}`, el)}
        className="overflow-hidden transition-[max-height] duration-300"
        style={{ maxHeight: isOpen ? `${maxHeight ?? 0}px` : 0 }}
      >
        <ul className="mt-2 space-y-1 ml-9">
          {item.subItems?.map((sub) => {
            const active = isActivePath(sub.path);
            return (
              <li key={sub.name}>
                <Link href={sub.path} className={`menu-dropdown-item ${active ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
                  {sub.name}
                  <span className="flex items-center gap-1 ml-auto">
                    {sub.new && <span className={`menu-dropdown-badge ${active ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"}`}>new</span>}
                    {sub.pro && <span className={`menu-dropdown-badge ${active ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"}`}>pro</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});
SidebarDropdown.displayName = "SidebarDropdown";

/* -----------------------------
  Main Sidebar
----------------------------- */

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  // open submenu state with index + type
  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);

  // refs to submenu wrapper elements for height calc
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [subMenuHeights, setSubMenuHeights] = useState<Record<string, number>>({});

  // show text when sidebar expanded/hovered/mobile open
  const showText = isExpanded || isHovered || isMobileOpen;

  // helper: check active path (memoized)
  const isActivePath = useCallback((path: string) => path === pathname, [pathname]);

  // compute initial open submenu if current path belongs to a subItem
  useEffect(() => {
    let matched: { type: "main" | "others"; index: number } | null = null;

    const scan = (items: NavItem[], type: "main" | "others") => {
      items.forEach((nav, idx) => {
        if (nav.subItems) {
          nav.subItems.forEach((sub) => {
            if (sub.path === pathname) {
              matched = { type, index: idx };
            }
          });
        }
      });
    };

    scan(MAIN_NAV, "main");
    scan(OTHER_NAV, "others");

    setOpenSubmenu(matched);
  }, [pathname]);

  // update heights when openSubmenu or window size changes
  useEffect(() => {
    if (!openSubmenu) return;
    const key = `${openSubmenu.type}-${openSubmenu.index}`;
    const el = subMenuRefs.current[key];
    if (el) {
      setSubMenuHeights((prev) => ({ ...prev, [key]: el.scrollHeight }));
    }
    // also update heights on resize
    const onResize = () => {
      const el2 = subMenuRefs.current[key];
      if (el2) {
        setSubMenuHeights((prev) => ({ ...prev, [key]: el2.scrollHeight }));
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [openSubmenu]);

  const setRef = useCallback((key: string, el: HTMLDivElement | null) => {
    subMenuRefs.current[key] = el;
  }, []);

  const toggleSubmenu = useCallback((index: number, type: "main" | "others") => {
    setOpenSubmenu((prev) => (prev && prev.index === index && prev.type === type ? null : { index, type }));
  }, []);

  const renderMenuItems = useCallback(
    (items: NavItem[], type: "main" | "others") => {
      return (
        <ul className="flex flex-col gap-4">
          {items.map((nav, idx) => {
            const hasSub = !!nav.subItems;
            const open = openSubmenu?.type === type && openSubmenu?.index === idx;
            return (
              <li key={nav.name}>
                {hasSub ? (
                  <SidebarDropdown
                    item={nav}
                    index={idx}
                    type={type}
                    isOpen={!!open}
                    toggle={toggleSubmenu}
                    showText={showText}
                    isActivePath={isActivePath}
                    setRef={setRef}
                    maxHeight={subMenuHeights[`${type}-${idx}`]}
                  />
                ) : (
                  <SidebarLink item={nav} active={isActivePath(nav.path ?? "")} showText={showText} />
                )}
              </li>
            );
          })}
        </ul>
      );
    },
    [openSubmenu, subMenuHeights, showText, toggleSubmenu, isActivePath, setRef]
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/" className="flex items-center gap-2">
          {showText ? (
            <>
              <Image src="https://mendelacademy.com/mendel-logo/mendel-logo-main.svg" alt="Logo" width={50} height={40} priority />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-lg dark:text-white text-gray-900">MENDEL</span>
                <span className="text-xs dark:text-white text-gray-500 uppercase tracking-wider">ACADEMY</span>
              </div>
            </>
          ) : (
            <Image src="https://mendelacademy.com/mendel-logo/mendel-logo-main.svg" alt="Logo" width={35} height={35} priority />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                {showText ? "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(MAIN_NAV, "main")}
            </div>

            <div className="mt-6">
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                {showText ? "Others" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(OTHER_NAV, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default React.memo(AppSidebar);
