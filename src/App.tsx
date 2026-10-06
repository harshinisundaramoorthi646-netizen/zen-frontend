import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { RootLayout } from './layouts/RootLayout';
import { ProtectedRoute } from './layouts/ProtectedRoute';

import { LoginPage } from './pages/auth/LoginPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTeamA } from './pages/admin/AdminTeamA';
import { AdminTeamB } from './pages/admin/AdminTeamB';
import { AdminTeamC } from './pages/admin/AdminTeamC';
import { AdminLeads } from './pages/admin/AdminLeads';
import { AdminClients } from './pages/admin/AdminClients';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

// Team A Pages
import { TeamADashboard } from './pages/team-a/TeamADashboard';
import { TeamALeads } from './pages/team-a/TeamALeads';
import { AddLeadPage } from './pages/team-a/AddLeadPage';

// Team B Pages
import { TeamBDashboard } from './pages/team-b/TeamBDashboard';
import { TeamBLeads } from './pages/team-b/TeamBLeads';
import { TeamBFollowUps } from './pages/team-b/TeamBFollowUps';
import { TeamBCalls } from './pages/team-b/TeamBCalls';
import { TeamBClients } from './pages/team-b/TeamBClients';

// Team C Pages
import { TeamCDashboard } from './pages/team-c/TeamCDashboard';
import { TeamCProjects } from './pages/team-c/TeamCProjects';
import { TeamCClients } from './pages/team-c/TeamCClients';
import { ProjectDetailPage } from './pages/team-c/ProjectDetailPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Root App Frame Layout */}
        <Route element={<RootLayout />}>
          {/* Index Redirect */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/team-a"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminTeamA />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/team-b"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminTeamB />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/team-c"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminTeamC />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminLeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminClients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          {/* TEAM A ROUTES */}
          <Route
            path="/team-a"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team A']}>
                <TeamADashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-a/leads"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team A']}>
                <TeamALeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-a/add-lead"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team A']}>
                <AddLeadPage />
              </ProtectedRoute>
            }
          />

          {/* TEAM B ROUTES */}
          <Route
            path="/team-b"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team B']}>
                <TeamBDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-b/leads"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team B']}>
                <TeamBLeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-b/follow-ups"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team B']}>
                <TeamBFollowUps />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-b/calls"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team B']}>
                <TeamBCalls />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-b/clients"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team B']}>
                <TeamBClients />
              </ProtectedRoute>
            }
          />

          {/* TEAM C ROUTES */}
          <Route
            path="/team-c"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team C']}>
                <TeamCDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-c/projects"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team C']}>
                <TeamCProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-c/clients"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team C']}>
                <TeamCClients />
              </ProtectedRoute>
            }
          />

          {/* DETAIL VIEWS */}
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team A', 'Team B', 'Team C']}>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients/:id"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Team B', 'Team C']}>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback wildcard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
