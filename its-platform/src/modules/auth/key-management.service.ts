import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export interface KeyPair {
  privateKey: crypto.KeyObject;
  publicKey: crypto.KeyObject;
  kid: string;
}

export interface KeyManagementService {
  getSigningKeyPair(): Promise<KeyPair>;
  getVerificationKey(kid: string): Promise<crypto.KeyObject | null>;
  rotateKeys(): Promise<KeyPair>;
}

/**
 * KeyManagementService — abstraction for key custody (KMS/HSM) with in-memory fallback.
 *
 * ADR-013 Q1 = Yes: the platform IS the Authorization Server, so it owns the signing keys.
 * Production deployments MUST replace this with a KMS/HSM-backed implementation.
 *
 * Current implementation (dev/test only):
 * - Generates RSA key pairs in-memory
 * - Single active key (kid: its-platform-1)
 * - No persistence across restarts
 *
 * TODO (production):
 * - [ ] AWS KMS / GCP KMS / Azure Key Vault integration
 * - [ ] HSM-backed signing (e.g., AWS CloudHSM, Google Cloud HSM)
 * - [ ] Automated key rotation with overlap period
 * - [ ] Key versioning and metadata (created_at, expires_at, status)
 * - [ ] Audit logging for all key operations
 * - [ ] Secure key export for JWKS publication
 */
@Injectable()
export class KeyManagementServiceImpl implements KeyManagementService {
  private readonly logger = new Logger(KeyManagementServiceImpl.name);
  private currentKeyPair: KeyPair | null = null;

  constructor() {
    this.initializeKeys();
  }

  private initializeKeys(): void {
    const keyPair = this.generateKeyPair('its-platform-1');
    this.currentKeyPair = keyPair;
    this.logger.log('Initialized in-memory RSA key pair for JWT signing (dev/test only)');
    this.logger.warn('KeyManagementServiceImpl: Using in-memory keys. Replace with KMS/HSM for production!');
  }

  private generateKeyPair(kid: string): KeyPair {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return {
      privateKey: crypto.createPrivateKey(privateKey),
      publicKey: crypto.createPublicKey(publicKey),
      kid,
    };
  }

  async getSigningKeyPair(): Promise<KeyPair> {
    if (!this.currentKeyPair) {
      this.initializeKeys();
    }
    return this.currentKeyPair!;
  }

  async getVerificationKey(kid: string): Promise<crypto.KeyObject | null> {
    if (this.currentKeyPair && this.currentKeyPair.kid === kid) {
      return this.currentKeyPair.publicKey;
    }
    return null;
  }

  async rotateKeys(): Promise<KeyPair> {
    const oldKid = this.currentKeyPair?.kid ?? 'unknown';
    const newKid = `its-platform-${Date.now()}`;
    const newKeyPair = this.generateKeyPair(newKid);
    this.currentKeyPair = newKeyPair;
    this.logger.log(`Rotated signing key: ${oldKid} -> ${newKid}`);
    return newKeyPair;
  }
}

export const KEY_MANAGEMENT_SERVICE = 'KEY_MANAGEMENT_SERVICE';