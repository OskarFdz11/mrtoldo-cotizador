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
import { useRouter } from "next/router";

type NavLinksProps = {
  showTextOnAllSizes?: boolean;
  dict: Dictionary;
  onNavigate?: () => void;
};

export default function NavLinks({
  dict,
  showTextOnAllSizes = false,
  onNavigate,
}: NavLinksProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = router;

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
        const isActive = pathname;

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
            locale={locale}
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
