---
name: solid
description: Use ao projetar interfaces, módulos e dependências em TypeScript seguindo os princípios SOLID no projeto ITS.
---

# SOLID — TypeScript (ITS Platform)

Regras de design de classes/módulos. Para estrutura de camadas e Dependency Rule, use a skill `clean-architecture`.

## S — Single Responsibility

- Um módulo/classe tem **um** motivo de mudar. Se a classe muda por causa de regra de negócio *e* de formato de resposta, separe.

```ts
// ❌ mistura domínio, persistência e HTTP
class LessonService {
  async markComplete(id: string) { /* regra + SELECT + monta JSON */ }
}
// ✅ uma responsabilidade cada
class MasteryGateService { podeAvancar(skill: Skill): boolean { /* regra pura */ } }
class LessonRepository { async concluir(id: LessonId): Promise<void> { /* persistência */ } }
```

## O — Open/Closed

- Aberto para extensão, fechado para modificação: novos tipos de exercício entram por implementação nova, não por `if/else if` crescendo.

```ts
// ✅ adicionar "listening" = nova classe; nada do existente muda
export interface ExerciseStrategy {
  readonly tipo: TipoExercicio;
  pontuar(resposta: Resposta): Pontuacao;
  gerarDistratores(gabarito: Item): string[];
}

export class MinimalPairStrategy implements ExerciseStrategy { /* ... */ }
export class ListeningStrategy implements ExerciseStrategy { /* ... */ }

// registro via Map, nunca switch solto no meio do domínio
const strategies = new Map<TipoExercicio, ExerciseStrategy>([
  ['minimal_pair', new MinimalPairStrategy()],
  ['listening', new ListeningStrategy()],
]);
```

## L — Liskov Substitution

- Subtipos devem ser substituíveis sem quebrar quem usa o tipo base: mesma semântica, pré/pós-condições compatíveis.

```ts
// ❌ violação: "lado do pai" lança erro onde a base promete funcionar
class AudioUrlSignerLocal extends AudioUrlSigner {
  assinar(url: string) { throw new Error('offline não suportado'); }
}
// ✅ se não dá para cumprir o contrato, não estenda — use uma strategia "sem assinatura"
//    ou devolva Result tipado em vez de exceção surpresa
```

- Em TS: assinaturas de método devem ser compatíveis (parâmetros em posição covariante, retornos covariantes); não estreite tipos nem lance erro inesperado em caminho normal.

## I — Interface Segregation

- Interfaces pequenas e específicas; ninguém deve implementar método que não usa.

```ts
// ❌ interface gorda
interface ILessonEverything {
  get(id: string): Promise<Lesson>;
  save(l: Lesson): Promise<void>;
  marcarConcluida(id: string): Promise<void>;
  gerarRelatorioPdf(id: string): Promise<Buffer>; // UI nunca usa
}
// ✅ segregadas (ISP) — o consumidor declara o que precisa
interface ILessonReader { get(id: LessonId): Promise<Lesson>; }
interface ILessonWriter { concluir(id: LessonId): Promise<void>; }
```

- Componentes React: se a página só lê dados, não passe setter/mutation inteira como prop.

## D — Dependency Inversion

- Camadas de alto nível dependem de **abstrações**; concretos vêm de baixo (inversão de controle).

```ts
// core define a porta
export interface IMasteryRepository {
  getByLearner(learnerId: LearnerId): Promise<Mastery[]>;
}
// application depende da interface, nunca de PrismaRepository/TypeORMRepository
export class CalcularProximaLicao {
  constructor(private readonly masteryRepo: IMasteryRepository) {}
}
// infrastructure implementa
export class TypeOrmMasteryRepository implements IMasteryRepository { /* ... */ }
```

- Injeção de dependência: construtor (classes de domínio/app) ou Context/factory (React); evite `import` direto de concreto no núcleo.
- Frontend: cliente de API injetado por interface (`ILessonRepository` → implementação fetch/TanStack Query em `infrastructure/api/`), permitindo mock substituível em testes (LSP + DIP juntos).

## Checagem rápida na review

- [ ] Uma classe muda por mais de um motivo? → SRP
- [ ] Adicionar tipo novo exige editar `switch`/`if` central? → OCP
- [ ] Subclasse lança erro onde a base não lança? → LSP
- [ ] Interface com método que ninguém implementa? → ISP
- [ ] `new Concreto()` ou import de adapter dentro de `core/`/`application/`? → DIP
