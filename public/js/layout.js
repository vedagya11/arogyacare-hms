/**
 * layout.js
 * Dynamically injects Navigation and Sidebar to maintain DRY architecture across pages
 */

const Layout = {
    init: () => {
        if (document.getElementById('sidebar-container')) {
            Layout.renderSidebar();
        }
        if (document.getElementById('topbar-container')) {
            Layout.renderTopbar();
        }
    },

    getCurrentRole: () => {
        return (window.Auth && typeof Auth.getUserRole === 'function')
            ? Auth.getUserRole()
            : (localStorage.getItem('hospital_role') || '').toLowerCase();
    },

    getSidebarLinks: () => {
        const role = Layout.getCurrentRole();
        const links = [];

        if (role === 'admin') {
            links.push(
                { name: 'Dashboard Overview', url: '/dashboard-admin.html', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { name: 'Doctors Management', url: '/doctors.html', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                { name: 'Patients', url: '/patients.html', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { name: 'Appointments', url: '/appointments.html', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { name: 'Medical Records', url: '/medical-records.html', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
            );
        } else if (role === 'doctor') {
            links.push(
                { name: 'My Dashboard', url: '/dashboard-doctor.html', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { name: 'My Appointments', url: '/appointments.html', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { name: 'Patients', url: '/patients.html', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { name: 'Medical Records', url: '/medical-records.html', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
            );
        } else if (role === 'receptionist') {
            links.push(
                { name: 'Front Desk', url: '/dashboard-receptionist.html', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                { name: 'Manage Patients', url: '/patients.html', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { name: 'Appointments', url: '/appointments.html', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
            );
        }

        return links;
    },

    isActiveLink: (url) => {
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop() || 'index.html';
        const targetFile = url.split('/').pop();
        return currentFile === targetFile;
    },

    renderSidebar: () => {
        const container = document.getElementById('sidebar-container');
        if (!container) return;

        const links = Layout.getSidebarLinks();

        const linksHtml = links.map(link => `
            <a href="${link.url}" class="sidebar-link ${Layout.isActiveLink(link.url) ? 'bg-white/10 text-white font-medium' : 'text-slate-300 hover:bg-white/10 hover:text-white'} flex items-center px-4 py-3 rounded-lg mb-1 transition-colors">
                <svg class="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${link.icon}"></path>
                </svg>
                <span>${link.name}</span>
            </a>
        `).join('');

        container.innerHTML = `
            <div class="h-full sidebar flex flex-col w-64 fixed left-0 top-0 text-white shadow-xl">
                <div class="p-6 border-b border-white/10 flex items-center">
                    <svg class="w-8 h-8 text-blue-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                    <div>
                        <h1 class="text-xl font-bold tracking-tight">AarogyaCare</h1>
                        <p class="text-[10px] text-blue-200 uppercase tracking-widest mt-0.5">Hospital System</p>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto p-4">
                    <nav>
                        <div class="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-4 px-4">Menu</div>
                        ${linksHtml}
                    </nav>
                </div>

                <div class="p-4 border-t border-white/10">
                    <button onclick="Auth.logout()" class="w-full flex items-center px-4 py-3 text-sm text-red-300 hover:text-red-100 hover:bg-red-900/30 rounded-lg transition-colors">
                        <svg class="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                    </button>
                </div>
            </div>
        `;
    },

    renderTopbar: () => {
        const container = document.getElementById('topbar-container');
        if (!container) return;

        const role = Layout.getCurrentRole() || 'user';
        const username = (window.Auth && typeof Auth.getUsername === 'function')
            ? Auth.getUsername()
            : (localStorage.getItem('hospital_username') || 'Guest');

        container.innerHTML = `
            <div class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm">
                <div class="text-slate-500 font-medium text-sm">
                    ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div class="flex items-center space-x-4">
                    <div class="text-right">
                        <div class="text-sm font-semibold text-slate-800">${username}</div>
                        <div class="text-xs text-blue-600 capitalize font-medium">${role}</div>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-blue-200">
                        ${username.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', Layout.init);