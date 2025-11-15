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
import { Dictionary } from "@/app/lib/dictionaries";
import { usePathname } from "next/navigation";

type NavLinksProps = {
  lang: string;
  showTextOnAllSizes?: boolean;
  dict: Dictionary;
  onNavigate?: () => void;
};

export default function NavLinks({
  lang,
  dict,
  showTextOnAllSizes = false,
  onNavigate,
}: NavLinksProps) {
  const pathname = usePathname();

  const links = [
    { name: dict.navigation.home, href: `/${lang}/dashboard`, icon: HomeIcon },
    {
      name: dict.navigation.quotations,
      href: `/${lang}/dashboard/quotations`,
      icon: DocumentDuplicateIcon,
    },
    {
      name: dict.navigation.customers,
      href: `/${lang}/dashboard/customers`,
      icon: UserGroupIcon,
    },
    {
      name: dict.navigation.products,
      href: `/${lang}/dashboard/products`,
      icon: BuildingStorefrontIcon,
    },
    {
      name: dict.navigation.categories,
      href: `/${lang}/dashboard/categories`,
      icon: TagIcon,
    },
    {
      name: dict.navigation.billingDetails,
      href: `/${lang}/dashboard/billing-details`,
      icon: BanknotesIcon,
    },
  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const cleanPathname = pathname.replace(`/${lang}`, "");
        const linkPath = link.href.replace(`/${lang}`, "");
        const isActive = cleanPathname === linkPath;

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
            href={link.href}
            onClick={onNavigate}
            className={baseClasses}
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
