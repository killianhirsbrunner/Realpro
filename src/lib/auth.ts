import { supabase } from './supabase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message || 'Échec de la connexion',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur inattendue est survenue',
    };
  }
}

export async function signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          first_name: credentials.firstName,
          last_name: credentials.lastName,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Échec de l'inscription",
      };
    }

    return {
      success: true,
      data,
      message: 'Compte créé avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur inattendue est survenue',
    };
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message || 'Échec de la déconnexion',
      };
    }

    return {
      success: true,
      message: 'Déconnexion réussie',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur inattendue est survenue',
    };
  }
}

export async function sendResetEmail(email: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Échec de l'envoi de l'email",
      };
    }

    return {
      success: true,
      message: 'Email de réinitialisation envoyé',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur inattendue est survenue',
    };
  }
}

export async function resetPassword(newPassword: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        message: error.message || 'Échec de la réinitialisation',
      };
    }

    return {
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur inattendue est survenue',
    };
  }
}

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

export async function refreshSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession();

    if (error) {
      return {
        success: false,
        message: error.message || 'Échec du rafraîchissement de la session',
      };
    }

    return {
      success: true,
      data: session,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur inattendue est survenue',
    };
  }
}

export async function updateUserProfile(updates: {
  firstName?: string;
  lastName?: string;
  email?: string;
}): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.updateUser({
      email: updates.email,
      data: {
        first_name: updates.firstName,
        last_name: updates.lastName,
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message || 'Échec de la mise à jour du profil',
      };
    }

    return {
      success: true,
      message: 'Profil mis à jour avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur inattendue est survenue',
    };
  }
}

export function isAuthenticated(): boolean {
  return !!getSession();
}
