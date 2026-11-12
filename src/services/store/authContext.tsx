import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from '../../types';

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  login: (email: string, password?: string, targetRole?: Role) => { success: boolean; error?: string; user?: User };
  signup: (userData: {
    fullName: string;
    email: string;
    password?: string;
    role: Role;
    institutionName?: string;
    academicField?: string;
    country?: string;
  }) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  switchRole: (newRole: Role) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const DEFAULT_USERS: Record<Role, User> = {
  student: {
    id: 'usr-student-01',
    email: 'amina.njoya@univ-dschang.org',
    fullName: 'Amina Njoya',
    role: 'student',
    password: 'password123',
    institutionId: 'inst-dschang-01',
    institutionName: 'Université de Dschang (UDs) — Faculté des Sciences',
    academicField: 'Informatique & Bioinformatique Appliquée',
    country: 'Cameroun',
    preferredLanguage: 'fr',
    creditsRemaining: 45,
    creditsTotal: 50,
    plan: 'student',
    createdAt: '2026-09-12T10:00:00Z',
  },
  faculty: {
    id: 'usr-faculty-01',
    email: 'emmanuel.tabi@uniba-edu.cm',
    fullName: 'Dr. Emmanuel Tabi',
    role: 'faculty',
    password: 'password123',
    institutionId: 'inst-bamenda-01',
    institutionName: 'University of Bamenda (UBa) — College of Technology',
    academicField: 'Computer Engineering & AI Safety',
    country: 'Cameroon',
    preferredLanguage: 'en',
    creditsRemaining: 250,
    creditsTotal: 300,
    plan: 'professional',
    createdAt: '2026-03-01T08:30:00Z',
  },
  institution_admin: {
    id: 'usr-admin-inst-01',
    email: 'rectorat.conseil@univ-dschang.org',
    fullName: 'Pr. Roger Tsafack (Conseil Scientifique)',
    role: 'institution_admin',
    password: 'password123',
    institutionId: 'inst-dschang-01',
    institutionName: 'Université de Dschang (UDs) & University of Bamenda (UBa)',
    academicField: 'Gouvernance Universitaire & Intégrité Académique',
    country: 'Cameroun',
    preferredLanguage: 'fr',
    creditsRemaining: 9800,
    creditsTotal: 10000,
    plan: 'institution',
    createdAt: '2025-11-15T14:20:00Z',
  },
  super_admin: {
    id: 'usr-superadmin-01',
    email: 'admin.ops@scholarshield.cm',
    fullName: 'Alexandre Sterling (ScholarShield Cameroun)',
    role: 'super_admin',
    password: 'password123',
    academicField: 'Opérations Système & Infrastructure IA',
    country: 'Cameroun',
    preferredLanguage: 'fr',
    creditsRemaining: 999999,
    creditsTotal: 999999,
    plan: 'institution',
    createdAt: '2025-01-01T00:00:00Z',
  },
};

const USERS_DB_STORAGE_KEY = 'scholarshield_users_db_v1';
const SESSION_STORAGE_KEY = 'scholarshield_active_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load registered users from localStorage or initialize with seed defaults
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_DB_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('LocalStorage users db read warning:', e);
    }
    return Object.values(DEFAULT_USERS);
  });

  // Load active session (defaults to null if not logged in)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        return JSON.parse(storedSession);
      }
    } catch (e) {
      console.warn('LocalStorage session read warning:', e);
    }
    return null;
  });

  const [role, setRole] = useState<Role>(user?.role || 'student');

  // Persist registered users
  useEffect(() => {
    try {
      localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(registeredUsers));
    } catch (e) {
      console.warn('Could not save users to localStorage', e);
    }
  }, [registeredUsers]);

  // Persist current session
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
        setRole(user.role);
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Could not save session to localStorage', e);
    }
  }, [user]);

  const switchRole = (newRole: Role) => {
    const existing = registeredUsers.find((u) => u.role === newRole) || DEFAULT_USERS[newRole];
    setRole(newRole);
    setUser(existing);
  };

  const login = (
    email: string,
    password?: string,
    targetRole?: Role
  ): { success: boolean; error?: string; user?: User } => {
    const cleanEmail = email.trim().toLowerCase();

    // Check registered users
    const matched = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (matched) {
      if (password && matched.password && matched.password !== password) {
        return { success: false, error: 'Mot de passe incorrect pour cette adresse académique.' };
      }
      setUser(matched);
      setRole(matched.role);
      return { success: true, user: matched };
    }

    // Check default accounts by partial match or target role
    const defaultUser = Object.values(DEFAULT_USERS).find(
      (d) => d.email.toLowerCase() === cleanEmail || (targetRole && d.role === targetRole)
    );

    if (defaultUser) {
      if (password && defaultUser.password && defaultUser.password !== password) {
        return { success: false, error: 'Mot de passe incorrect.' };
      }
      setUser(defaultUser);
      setRole(defaultUser.role);
      return { success: true, user: defaultUser };
    }

    return {
      success: false,
      error: "Aucun compte n'a été trouvé avec cette adresse e-mail. Veuillez créer un compte.",
    };
  };

  const signup = (userData: {
    fullName: string;
    email: string;
    password?: string;
    role: Role;
    institutionName?: string;
    academicField?: string;
    country?: string;
  }): { success: boolean; error?: string; user?: User } => {
    const cleanEmail = userData.email.trim().toLowerCase();

    // Check if email already registered
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        error: 'Cette adresse e-mail est déjà inscrite. Veuillez vous connecter.',
      };
    }

    const template = DEFAULT_USERS[userData.role] || DEFAULT_USERS.student;
    const newUser: User = {
      ...template,
      id: `usr-${Date.now().toString(36)}`,
      fullName: userData.fullName.trim(),
      email: cleanEmail,
      role: userData.role,
      password: userData.password || 'password123',
      institutionName: userData.institutionName?.trim() || template.institutionName,
      academicField: userData.academicField?.trim() || template.academicField,
      country: userData.country?.trim() || 'France',
      creditsRemaining: userData.role === 'institution_admin' ? 10000 : userData.role === 'faculty' ? 300 : 50,
      creditsTotal: userData.role === 'institution_admin' ? 10000 : userData.role === 'faculty' ? 300 : 50,
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [newUser, ...prev]);
    setUser(newUser);
    setRole(newUser.role);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {}
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      setRegisteredUsers((all) => all.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        switchRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
