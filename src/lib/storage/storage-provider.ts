/**
 * Storage Provider Abstraction
 *
 * Cette interface permet de brancher differents fournisseurs de stockage
 * (Supabase, Exoscale, Infomaniak, etc.) sans changer le code applicatif.
 *
 * L'objectif est de permettre aux clients suisses d'utiliser des hebergements
 * conformes aux exigences de protection des donnees (LPD/RGPD).
 */

// =====================================================
// INTERFACES
// =====================================================

export interface StorageProvider {
  /**
   * Upload un fichier vers le storage
   */
  upload(bucket: string, path: string, file: File | Blob, options?: UploadOptions): Promise<UploadResult>;

  /**
   * Telecharge un fichier depuis le storage
   */
  download(bucket: string, path: string): Promise<Blob>;

  /**
   * Supprime un fichier du storage
   */
  delete(bucket: string, path: string): Promise<void>;

  /**
   * Supprime plusieurs fichiers
   */
  deleteMany(bucket: string, paths: string[]): Promise<void>;

  /**
   * Genere une URL signee temporaire pour un acces securise
   */
  getSignedUrl(bucket: string, path: string, expiresIn: number): Promise<string>;

  /**
   * Obtient l'URL publique d'un fichier (si le bucket est public)
   */
  getPublicUrl(bucket: string, path: string): string;

  /**
   * Liste les fichiers dans un repertoire
   */
  list(bucket: string, path: string, options?: ListOptions): Promise<StorageFile[]>;

  /**
   * Copie un fichier vers un autre emplacement
   */
  copy(bucket: string, fromPath: string, toPath: string): Promise<void>;

  /**
   * Deplace/renomme un fichier
   */
  move(bucket: string, fromPath: string, toPath: string): Promise<void>;

  /**
   * Verifie si un fichier existe
   */
  exists(bucket: string, path: string): Promise<boolean>;

  /**
   * Obtient les metadonnees d'un fichier
   */
  getMetadata(bucket: string, path: string): Promise<StorageFileMetadata>;
}

export interface UploadOptions {
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
  metadata?: Record<string, string>;
  onProgress?: (progress: UploadProgress) => void;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  path: string;
  fullPath: string;
  publicUrl?: string;
  size?: number;
}

export interface ListOptions {
  limit?: number;
  offset?: number;
  sortBy?: {
    column: 'name' | 'created_at' | 'updated_at' | 'size';
    order: 'asc' | 'desc';
  };
  search?: string;
}

export interface StorageFile {
  name: string;
  id?: string;
  size?: number;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, string>;
}

export interface StorageFileMetadata {
  size: number;
  mimetype: string;
  lastModified: Date;
  etag?: string;
  cacheControl?: string;
  contentEncoding?: string;
  metadata?: Record<string, string>;
}

// =====================================================
// TYPES DE PROVIDERS SUPPORTES
// =====================================================

export type StorageProviderType = 'supabase' | 'exoscale' | 'infomaniak' | 's3compatible' | 'local';

export interface StorageProviderConfig {
  type: StorageProviderType;
  // Config Supabase
  supabaseUrl?: string;
  supabaseKey?: string;
  // Config S3-compatible (Exoscale, Infomaniak, etc.)
  endpoint?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  // Config locale (pour dev/tests)
  basePath?: string;
}

// =====================================================
// FACTORY
// =====================================================

/**
 * Factory pour creer le provider selon la configuration
 */
export function createStorageProvider(config?: StorageProviderConfig): StorageProvider {
  const type = config?.type || (import.meta.env.VITE_STORAGE_PROVIDER as StorageProviderType) || 'supabase';

  switch (type) {
    case 'supabase':
      return new SupabaseStorageProvider();
    case 'exoscale':
      return new ExoscaleStorageProvider(config);
    case 'infomaniak':
      return new InfomaniakStorageProvider(config);
    case 's3compatible':
      return new S3CompatibleStorageProvider(config);
    case 'local':
      return new LocalStorageProvider(config);
    default:
      console.warn(`Unknown storage provider type: ${type}, falling back to Supabase`);
      return new SupabaseStorageProvider();
  }
}

// =====================================================
// IMPLEMENTATION SUPABASE (ACTUELLE)
// =====================================================

import { supabase } from '../supabase';

class SupabaseStorageProvider implements StorageProvider {
  async upload(bucket: string, path: string, file: File | Blob, options?: UploadOptions): Promise<UploadResult> {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: options?.contentType,
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert || false,
    });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

    return {
      path: data.path,
      fullPath: `${bucket}/${data.path}`,
      publicUrl: urlData.publicUrl,
    };
  }

  async download(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) throw error;
    return data;
  }

  async delete(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  }

  async deleteMany(bucket: string, paths: string[]): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) throw error;
  }

  async getSignedUrl(bucket: string, path: string, expiresIn: number): Promise<string> {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data.signedUrl;
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async list(bucket: string, path: string, options?: ListOptions): Promise<StorageFile[]> {
    const { data, error } = await supabase.storage.from(bucket).list(path, {
      limit: options?.limit,
      offset: options?.offset,
      sortBy: options?.sortBy,
      search: options?.search,
    });

    if (error) throw error;

    return (data || []).map((file) => ({
      name: file.name,
      id: file.id,
      size: file.metadata?.size,
      createdAt: file.created_at,
      updatedAt: file.updated_at,
      metadata: file.metadata,
    }));
  }

  async copy(bucket: string, fromPath: string, toPath: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).copy(fromPath, toPath);
    if (error) throw error;
  }

  async move(bucket: string, fromPath: string, toPath: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).move(fromPath, toPath);
    if (error) throw error;
  }

  async exists(bucket: string, path: string): Promise<boolean> {
    try {
      const { data } = await supabase.storage.from(bucket).list(path.split('/').slice(0, -1).join('/'), {
        search: path.split('/').pop(),
      });
      return (data?.length || 0) > 0;
    } catch {
      return false;
    }
  }

  async getMetadata(bucket: string, path: string): Promise<StorageFileMetadata> {
    // Supabase ne supporte pas directement les metadonnees detaillees
    // On utilise une approche via list
    const parentPath = path.split('/').slice(0, -1).join('/');
    const fileName = path.split('/').pop();

    const { data, error } = await supabase.storage.from(bucket).list(parentPath, {
      search: fileName,
    });

    if (error) throw error;

    const file = data?.find((f) => f.name === fileName);
    if (!file) throw new Error('File not found');

    return {
      size: file.metadata?.size || 0,
      mimetype: file.metadata?.mimetype || 'application/octet-stream',
      lastModified: new Date(file.updated_at || file.created_at),
      metadata: file.metadata,
    };
  }
}

// =====================================================
// IMPLEMENTATION S3-COMPATIBLE (BASE)
// =====================================================

/**
 * Implementation de base pour les storages S3-compatible
 * Utilisable pour Exoscale, Infomaniak, MinIO, etc.
 */
class S3CompatibleStorageProvider implements StorageProvider {
  protected config: StorageProviderConfig;

  constructor(config?: StorageProviderConfig) {
    this.config = config || {};
  }

  // Note: Ces methodes necessitent le SDK AWS S3 ou un equivalent
  // Pour l'instant, on leve des erreurs "not implemented"

  async upload(): Promise<UploadResult> {
    throw new Error('S3-compatible storage not yet implemented. Install @aws-sdk/client-s3 and implement.');
  }

  async download(): Promise<Blob> {
    throw new Error('S3-compatible storage not yet implemented');
  }

  async delete(): Promise<void> {
    throw new Error('S3-compatible storage not yet implemented');
  }

  async deleteMany(): Promise<void> {
    throw new Error('S3-compatible storage not yet implemented');
  }

  async getSignedUrl(): Promise<string> {
    throw new Error('S3-compatible storage not yet implemented');
  }

  getPublicUrl(_bucket: string, _path: string): string {
    // Format generique pour S3-compatible
    return `${this.config.endpoint}/${_bucket}/${_path}`;
  }

  async list(): Promise<StorageFile[]> {
    throw new Error('S3-compatible storage not yet implemented');
  }

  async copy(): Promise<void> {
    throw new Error('S3-compatible storage not yet implemented');
  }

  async move(): Promise<void> {
    throw new Error('S3-compatible storage not yet implemented');
  }

  async exists(): Promise<boolean> {
    throw new Error('S3-compatible storage not yet implemented');
  }

  async getMetadata(): Promise<StorageFileMetadata> {
    throw new Error('S3-compatible storage not yet implemented');
  }
}

// =====================================================
// IMPLEMENTATIONS SPECIFIQUES SUISSE
// =====================================================

/**
 * Exoscale Object Storage (Geneve/Zurich)
 * Compatible S3, datacenters suisses
 */
class ExoscaleStorageProvider extends S3CompatibleStorageProvider {
  constructor(config?: StorageProviderConfig) {
    super({
      ...config,
      endpoint: config?.endpoint || 'https://sos-ch-gva-2.exo.io', // Geneve
      region: config?.region || 'ch-gva-2',
    });
  }

  // TODO: Implementer avec @aws-sdk/client-s3
  // Endpoint: https://sos-{zone}.exo.io
  // Zones: ch-gva-2 (Geneve), ch-dk-2 (Zurich)
}

/**
 * Infomaniak Swiss Backup / Object Storage
 * 100% heberge en Suisse
 */
class InfomaniakStorageProvider extends S3CompatibleStorageProvider {
  constructor(config?: StorageProviderConfig) {
    super({
      ...config,
      endpoint: config?.endpoint || 'https://s3.pub1.infomaniak.cloud',
      region: config?.region || 'pub1',
    });
  }

  // TODO: Implementer avec @aws-sdk/client-s3 ou API Infomaniak
  // Documentation: https://www.infomaniak.com/fr/hebergement/public-cloud/object-storage
}

/**
 * Provider local pour developpement et tests
 */
class LocalStorageProvider implements StorageProvider {
  private basePath: string;

  constructor(config?: StorageProviderConfig) {
    this.basePath = config?.basePath || '/tmp/realpro-storage';
  }

  async upload(_bucket: string, path: string, _file: File | Blob): Promise<UploadResult> {
    // En dev, on simule juste le stockage
    console.log(`[LocalStorage] Would upload to ${this.basePath}/${_bucket}/${path}`);
    return {
      path,
      fullPath: `${_bucket}/${path}`,
      publicUrl: `file://${this.basePath}/${_bucket}/${path}`,
    };
  }

  async download(): Promise<Blob> {
    throw new Error('Local storage download not implemented');
  }

  async delete(_bucket: string, path: string): Promise<void> {
    console.log(`[LocalStorage] Would delete ${this.basePath}/${_bucket}/${path}`);
  }

  async deleteMany(_bucket: string, paths: string[]): Promise<void> {
    paths.forEach((path) => console.log(`[LocalStorage] Would delete ${this.basePath}/${_bucket}/${path}`));
  }

  async getSignedUrl(_bucket: string, path: string): Promise<string> {
    return `file://${this.basePath}/${_bucket}/${path}?signed=true`;
  }

  getPublicUrl(_bucket: string, path: string): string {
    return `file://${this.basePath}/${_bucket}/${path}`;
  }

  async list(): Promise<StorageFile[]> {
    return [];
  }

  async copy(): Promise<void> {
    console.log('[LocalStorage] Copy not implemented');
  }

  async move(): Promise<void> {
    console.log('[LocalStorage] Move not implemented');
  }

  async exists(): Promise<boolean> {
    return false;
  }

  async getMetadata(): Promise<StorageFileMetadata> {
    return {
      size: 0,
      mimetype: 'application/octet-stream',
      lastModified: new Date(),
    };
  }
}

// =====================================================
// EXPORT DU PROVIDER CONFIGURE
// =====================================================

/**
 * Instance du provider de stockage configuree selon l'environnement
 */
export const storageProvider = createStorageProvider();

/**
 * Helper pour uploader un document projet
 */
export async function uploadProjectDocument(
  projectId: string,
  file: File,
  options?: {
    folder?: string;
    metadata?: Record<string, string>;
  }
): Promise<UploadResult> {
  const folder = options?.folder || 'documents';
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `projects/${projectId}/${folder}/${timestamp}_${safeName}`;

  return storageProvider.upload('documents', path, file, {
    contentType: file.type,
    metadata: options?.metadata,
  });
}

/**
 * Helper pour obtenir une URL de telechargement securisee
 */
export async function getSecureDownloadUrl(path: string, expiresInSeconds = 3600): Promise<string> {
  return storageProvider.getSignedUrl('documents', path, expiresInSeconds);
}
