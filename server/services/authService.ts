import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/connection.js';
import { RegisterInput, LoginInput, ProfileUpdateInput } from '../../shared/schemas/auth.js';
import { SafeUser } from '../../shared/types/index.js';
import { generateToken } from '../utils/jwt.js';

export class AuthService {
  static async register(input: RegisterInput): Promise<{ user: SafeUser; token: string }> {
    const db = await getDb();
    const normalizedEmail = input.email.trim().toLowerCase();

    // Check existing user
    const existing = await db.query(
      'SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1;',
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      const error: any = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const userId = uuidv4();
    const preferredLang = input.preferredLanguage || 'English';

    const insertResult = await db.query<any>(
      `INSERT INTO users (id, email, password_hash, full_name, preferred_language, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, email, full_name, preferred_language, created_at, updated_at;`,
      [userId, normalizedEmail, passwordHash, input.fullName.trim(), preferredLang]
    );

    const row = insertResult.rows[0];
    const user: SafeUser = {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      preferredLanguage: row.preferred_language,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    const token = generateToken({ userId: user.id, email: user.email });
    return { user, token };
  }

  static async login(input: LoginInput): Promise<{ user: SafeUser; token: string }> {
    const db = await getDb();
    const normalizedEmail = input.email.trim().toLowerCase();

    const userResult = await db.query<any>(
      'SELECT id, email, password_hash, full_name, preferred_language, created_at, updated_at FROM users WHERE LOWER(email) = $1 LIMIT 1;',
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      const error: any = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const row = userResult.rows[0];
    const passwordValid = await bcrypt.compare(input.password, row.password_hash);

    if (!passwordValid) {
      const error: any = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const user: SafeUser = {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      preferredLanguage: row.preferred_language,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    const token = generateToken({ userId: user.id, email: user.email });
    return { user, token };
  }

  static async getUserById(userId: string): Promise<SafeUser | null> {
    const db = await getDb();
    const result = await db.query<any>(
      'SELECT id, email, full_name, preferred_language, created_at, updated_at FROM users WHERE id = $1 LIMIT 1;',
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      preferredLanguage: row.preferred_language,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async updateProfile(userId: string, input: ProfileUpdateInput): Promise<SafeUser> {
    const db = await getDb();

    // Fetch user to verify
    const userResult = await db.query<any>(
      'SELECT id, password_hash FROM users WHERE id = $1 LIMIT 1;',
      [userId]
    );

    if (userResult.rows.length === 0) {
      const error: any = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const currentUser = userResult.rows[0];

    // If changing password, verify old password
    let updatedPasswordHash = currentUser.password_hash;
    if (input.newPassword) {
      if (!input.currentPassword) {
        const error: any = new Error('Current password is required to change password.');
        error.statusCode = 400;
        throw error;
      }

      const match = await bcrypt.compare(input.currentPassword, currentUser.password_hash);
      if (!match) {
        const error: any = new Error('Current password does not match.');
        error.statusCode = 400;
        throw error;
      }

      const salt = await bcrypt.genSalt(10);
      updatedPasswordHash = await bcrypt.hash(input.newPassword, salt);
    }

    const updateResult = await db.query<any>(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           preferred_language = COALESCE($2, preferred_language),
           password_hash = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, email, full_name, preferred_language, created_at, updated_at;`,
      [input.fullName?.trim() || null, input.preferredLanguage?.trim() || null, updatedPasswordHash, userId]
    );

    const row = updateResult.rows[0];
    return {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      preferredLanguage: row.preferred_language,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
