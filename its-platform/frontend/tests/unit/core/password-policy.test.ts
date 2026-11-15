// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  isEmailCandidate,
  validateNewPassword,
  validatePasswordLength,
} from '@/core/services/password-policy';

/**
 * A política de senha nova, em Isolamento.
 *
 * O limite de 72 caracteres não é arbitrário: é o ponto em que o **bcrypt** trunca a
 * senha. Uma senha de 73 caracteres aceitos aqui seria truncada no servidor, e o
 * usuário entraria com uma senha que nunca foi a que digitou.
 */
describe('password-policy', () => {
  it('RN01 — aceita uma senha dentro do mínimo e do máximo', () => {
    const password = 'a'.repeat(MIN_PASSWORD_LENGTH);
    expect(validateNewPassword(password, password)).toEqual({ ok: true });
  });

  it('RN02 — recusa uma senha curta demais', () => {
    const password = 'a'.repeat(MIN_PASSWORD_LENGTH - 1);
    expect(validateNewPassword(password, password)).toEqual({ ok: false, problem: 'too_short' });
  });

  it('RN03 — recusa uma senha acima do limite do bcrypt', () => {
    const password = 'a'.repeat(MAX_PASSWORD_LENGTH + 1);
    expect(validateNewPassword(password, password)).toEqual({ ok: false, problem: 'too_long' });
  });

  it('RN04 — recusa senhas que não conferem', () => {
    expect(validateNewPassword('senha-nova-456', 'senha-nova-457')).toEqual({
      ok: false,
      problem: 'mismatch',
    });
  });

  it('RN05 — o tamanho é conferido antes da confirmação', () => {
    // Uma senha curta **e** divergente é curta primeiro: dizer que os campos não
    // conferem esconderia o problema real atrás de um segundo.
    expect(validateNewPassword('curta', 'outra')).toEqual({ ok: false, problem: 'too_short' });
  });

  it('RN06 — a validação de tamanho ignora a confirmação', () => {
    expect(validatePasswordLength('senha-nova-456')).toEqual({ ok: true });
    expect(validatePasswordLength('curta')).toEqual({ ok: false, problem: 'too_short' });
  });

  it('RN07 — reconhece um e-mail com forma plausível', () => {
    expect(isEmailCandidate('dev@its.local')).toBe(true);
    expect(isEmailCandidate('  learner@example.com  ')).toBe(true);
  });

  it('RN08 — recusa um e-mail sem @ ou sem domínio', () => {
    expect(isEmailCandidate('sem-arroba')).toBe(false);
    expect(isEmailCandidate('sem@dominio')).toBe(false);
    expect(isEmailCandidate('espaco dentro@dominio.com')).toBe(false);
    expect(isEmailCandidate('')).toBe(false);
  });
});
