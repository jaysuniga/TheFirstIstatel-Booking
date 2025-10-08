import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bed, BookOpen, BookUser, Calendar, Folder, Image, Layers2, LayoutGrid, Settings, UserRound, Users } from 'lucide-react';
import AppLogo from './app-logo';
import roomTypes from '@/routes/room-types';
import rooms from '@/routes/rooms';
import users from '@/routes/users';
import bookings from '@/routes/bookings';

export function AppSidebar() {

    const { props } = usePage();
    const user = (props.auth as { user: { roles: string[] } }).user;

    // Define all possible items
    const allNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'Room Types', href: roomTypes.index(), icon: Layers2 },
        { title: 'Room', href: rooms.index(), icon: Bed },
        { title: 'Bookings', href: bookings.index(), icon: Calendar },
        { title: 'Gallery', href: '/gallery', icon: Image },
        { title: 'Users', href: users.index(), icon: Users, role: 'super admin' },
    ];

    // Filter items based on role
    const mainNavItems = allNavItems.filter((item) => {
        if (!item.role) return true; // no role required
        return user.roles.includes(item.role);
    });


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
