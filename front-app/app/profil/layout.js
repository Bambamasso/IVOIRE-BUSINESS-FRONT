"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function ProfileLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Mon Profil",
      href: "/profil",
      icon: "👤",
    },
    {
      label: "Mes Commandes",
      href: "/profil/orders",
      icon: "📦",
    },
    {
      label: "Paramètres",
      href: "/profile/settings",
      icon: "⚙️",
    },
    {
      label: "Adresses",
      href: "/profile/addresses",
      icon: "📍",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <aside className="md:col-span-1">
              <nav className="bg-white rounded-lg shadow-md p-4 sticky top-20">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Mon Compte
                </h2>
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-[#e0f4cc] text-[#93b86a] font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="md:col-span-3">{children}</main>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
