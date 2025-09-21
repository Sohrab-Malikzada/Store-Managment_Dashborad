import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  TrendingUp,
  Bell,
  ChevronLeft,
  Menu,
  LogOut,
  DollarSign,
  UserCog,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const sidebarGroups = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Inventory",
        href: "/inventory",
        icon: Package,
      },
      {
        title: "Sales",
        href: "/sales",
        icon: ShoppingCart,
      },
      {
        title: "Purchases", 
        href: "/purchases",
        icon: CreditCard,
      },
      {
        title: "Returns",
        href: "/returns",
        icon: RotateCcw,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Employees",
        href: "/employees",
        icon: Users,
      },
      {
        title: "Payroll",
        href: "/payroll",
        icon: DollarSign,
      },
      {
        title: "Debts",
        href: "/debts",
        icon: Bell,
      },
    ],
  },
  {
    title: "Reports & Settings",
    items: [
      {
        title: "Analytics",
        href: "/analytics",
        icon: TrendingUp,
      },
      {
        title: "User Management",
        href: "/user-management",
        icon: UserCog,
      },
    ],
  },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const getRoleDisplayInfo = (role) => {
    switch (role) {
      case 'admin':
        return { name: 'Admin User', color: 'bg-red-500' };
      case 'sales_point':
        return { name: 'Sales Manager', color: 'bg-blue-500' };
      case 'inventory':
        return { name: 'Inventory Clerk', color: 'bg-green-500' };
      default:
        return { name: 'User', color: 'bg-gray-500' };
    }
  };

  const roleInfo = getRoleDisplayInfo(user?.role);

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">
              TradeLedger
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent p-2"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarGroups.map((group, groupIndex) => (
          <div key={group.title} className={cn("space-y-2", groupIndex > 0 && "mt-6")}>
            {!collapsed && (
              <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth hover:bg-sidebar-accent group",
                      active
                        ? "bg-sidebar-accent text-sidebar-primary shadow-soft"
                        : "text-sidebar-foreground hover:text-sidebar-primary"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 flex-shrink-0", active && "text-sidebar-primary")} />
                    {!collapsed && (
                      <span className="truncate">{item.title}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-3")}>
          <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", roleInfo.color)}>
            <span className="text-xs font-medium text-white">{user?.name?.[0] || 'U'}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name || roleInfo.name}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {user?.email || 'user@company.com'}
              </p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;