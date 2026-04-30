import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TooltipModule } from "primeng/tooltip";


interface NavItem {
    label: string;
    icon: string;
    route: string;
}

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, RouterLink, RouterLinkActive, TooltipModule],
    templateUrl: 'sidebar.html',
}) 
export class Sidebar{
    collapsed = signal(false);

    navItems: NavItem[] = [
        { label: 'Deals', icon: 'pi pi-briefcase', route: '/deals' },
        { label: 'Counterparties', icon: 'pi pi-building', route: '/counterparties' },
        { label: 'Profile', icon: 'pi pi-user', route: '/profile' },
    ];

    toggleSidebar() {
        this.collapsed.update(value => !value);
    }
}