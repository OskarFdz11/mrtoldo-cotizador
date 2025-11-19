"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BuildingStorefrontIcon,
  TagIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useI18n } from "@/app/ui/i18n-provider";

type NavLinksProps = {
  showTextOnAllSizes?: boolean;
  onNavigate?: () => void;
};

export default function NavLinks({
  showTextOnAllSizes = false,
  onNavigate,
}: NavLinksProps) {
  const pathname = usePathname();
  const { locale, dict } = useI18n();

  const links = [
    { name: dict.navigation.home, href: "/dashboard", icon: HomeIcon },
    {
      name: dict.navigation.quotations,
      href: "/dashboard/quotations",
      icon: DocumentDuplicateIcon,
    },
    {
      name: dict.navigation.customers,
      href: "/dashboard/customers",
      icon: UserGroupIcon,
    },
    {
      name: dict.navigation.products,
      href: "/dashboard/products",
      icon: BuildingStorefrontIcon,
    },
    {
      name: dict.navigation.categories,
      href: "/dashboard/categories",
      icon: TagIcon,
    },
    {
      name: dict.navigation.billingDetails,
      href: "/dashboard/billing-details",
      icon: BanknotesIcon,
    },
  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const localizedHref = `/${locale}${link.href}`;
        const isHome = link.href === "/dashboard";
        const isActive = isHome
          ? pathname === localizedHref
          : pathname === localizedHref ||
            pathname.startsWith(localizedHref + "/");

        const baseClasses = clsx(
          "flex h-[48px] items-center gap-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-sky-100 text-blue-600"
            : "bg-gray-50 hover:bg-sky-100 hover:text-blue-600",
          showTextOnAllSizes
            ? "w-full justify-start px-3"
            : "grow justify-center p-3 md:justify-start md:p-2 md:px-3"
        );

        return (
          <Link
            key={link.name}
            href={localizedHref}
            onClick={onNavigate}
            className={baseClasses}
            aria-current={isActive ? "page" : undefined}
          >
            <LinkIcon className="w-6" />
            <p
              className={clsx(showTextOnAllSizes ? "block" : "hidden md:block")}
            >
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}
